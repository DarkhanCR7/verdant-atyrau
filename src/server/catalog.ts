import { db } from "@/db";
import { doctors, services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { z } from "zod";
import type { doctorInputSchema, serviceInputSchema } from "@/lib/validations";

type DoctorInput = z.infer<typeof doctorInputSchema>;
type ServiceInput = z.infer<typeof serviceInputSchema>;

// --- Doctors ---

export async function listActiveDoctors() {
  return db.select().from(doctors).where(eq(doctors.isActive, true)).orderBy(asc(doctors.fullName));
}

export async function listAllDoctors() {
  return db.select().from(doctors).orderBy(asc(doctors.fullName));
}

export async function createDoctor(input: DoctorInput) {
  const [row] = await db
    .insert(doctors)
    .values({
      fullName: input.fullName,
      specialization: input.specialization,
      experienceYears: input.experienceYears,
      bio: input.bio || null,
      photoUrl: input.photoUrl || null,
      isActive: input.isActive,
    })
    .returning();
  return row;
}

export async function updateDoctor(id: string, input: Partial<DoctorInput>) {
  const [row] = await db
    .update(doctors)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(doctors.id, id))
    .returning();
  return row;
}

export async function deleteDoctor(id: string) {
  const [row] = await db
    .update(doctors)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(doctors.id, id))
    .returning();
  return row;
}

// --- Services ---

export async function listActiveServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(asc(services.category));
}

export async function listAllServices() {
  return db.select().from(services).orderBy(asc(services.category));
}

export async function createService(input: ServiceInput) {
  const [row] = await db
    .insert(services)
    .values({
      name: input.name,
      description: input.description || null,
      priceKzt: input.priceKzt,
      durationMinutes: input.durationMinutes,
      category: input.category,
      isActive: input.isActive,
    })
    .returning();
  return row;
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  const [row] = await db
    .update(services)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning();
  return row;
}

export async function deleteService(id: string) {
  const [row] = await db
    .update(services)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning();
  return row;
}
