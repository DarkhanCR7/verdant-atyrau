import { db } from "@/db";
import { appointments, doctors, services } from "@/db/schema";
import { and, eq, gte, lte, asc, sql } from "drizzle-orm";
import type { AppointmentInput } from "@/lib/validations";

export class SlotTakenError extends Error {
  constructor() {
    super("Это время у выбранного врача уже занято. Пожалуйста, выберите другое время.");
    this.name = "SlotTakenError";
  }
}

/**
 * Creates a new appointment. Relies on the DB unique index
 * (doctorId, appointmentDate, appointmentTime) as the source of truth for
 * preventing double-booking under concurrent requests (race-safe), and
 * translates the resulting unique-violation into a friendly error.
 */
export async function createAppointment(input: AppointmentInput, sourceIpHash: string) {
  try {
    const [created] = await db
      .insert(appointments)
      .values({
        patientName: input.patientName,
        phone: input.phone,
        email: input.email || null,
        serviceId: input.serviceId,
        doctorId: input.doctorId || null,
        appointmentDate: input.appointmentDate,
        appointmentTime: input.appointmentTime,
        comment: input.comment || null,
        sourceIpHash,
      })
      .returning();
    return created;
  } catch (err: unknown) {
    // postgres.js unique violation error code — drizzle wraps the underlying
    // postgres error inside `.cause` rather than exposing `code` directly.
    const pgCode =
      (err as { code?: string })?.code ?? (err as { cause?: { code?: string } })?.cause?.code;
    if (pgCode === "23505") {
      throw new SlotTakenError();
    }
    throw err;
  }
}

export interface AppointmentFilters {
  date?: string;
  status?: string;
  doctorId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function listAppointments(filters: AppointmentFilters = {}) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const pageSize = filters.pageSize && filters.pageSize > 0 ? Math.min(filters.pageSize, 100) : 20;

  const conditions = [];
  if (filters.date) conditions.push(eq(appointments.appointmentDate, filters.date));
  if (filters.status)
    conditions.push(
      eq(appointments.status, filters.status as (typeof appointments.status.enumValues)[number]),
    );
  if (filters.doctorId) conditions.push(eq(appointments.doctorId, filters.doctorId));
  if (filters.search) {
    conditions.push(
      sql`(${appointments.patientName} ILIKE ${"%" + filters.search + "%"} OR ${appointments.phone} ILIKE ${"%" + filters.search + "%"})`,
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ count }]] = await Promise.all([
    db
      .select({
        appointment: appointments,
        doctor: doctors,
        service: services,
      })
      .from(appointments)
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(where)
      .orderBy(asc(appointments.appointmentDate), asc(appointments.appointmentTime))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(appointments)
      .where(where),
  ]);

  return { rows, total: count, page, pageSize };
}

export async function getTodayAppointments() {
  const today = new Date().toISOString().slice(0, 10);
  return listAppointments({ date: today, pageSize: 100 });
}

export async function updateAppointmentStatus(
  id: string,
  status: (typeof appointments.status.enumValues)[number],
) {
  const [updated] = await db
    .update(appointments)
    .set({ status, updatedAt: new Date() })
    .where(eq(appointments.id, id))
    .returning();
  return updated;
}

export async function getAppointmentById(id: string) {
  const [row] = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return row;
}

/** Returns already-booked HH:mm slots for a doctor on a given date, to disable them in the UI. */
export async function getTakenSlots(doctorId: string, date: string) {
  const rows = await db
    .select({ time: appointments.appointmentTime })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.appointmentDate, date),
        sql`${appointments.status} != 'CANCELLED'`,
      ),
    );
  return rows.map((r) => r.time);
}

export async function getDashboardStats() {
  const today = new Date().toISOString().slice(0, 10);
  const [todayCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(eq(appointments.appointmentDate, today));

  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(eq(appointments.status, "PENDING"));

  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const [weekCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, today),
        lte(appointments.appointmentDate, weekFromNow.toISOString().slice(0, 10)),
      ),
    );

  return {
    today: todayCount?.count ?? 0,
    pending: pendingCount?.count ?? 0,
    thisWeek: weekCount?.count ?? 0,
  };
}
