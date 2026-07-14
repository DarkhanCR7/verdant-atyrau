import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
  date,
  time,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
]);

export const staffRoleEnum = pgEnum("staff_role", ["ADMIN", "STAFF"]);

// ---------- Doctors ----------
export const doctors = pgTable("doctors", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  specialization: varchar("specialization", { length: 200 }).notNull(),
  experienceYears: integer("experience_years").notNull().default(0),
  bio: text("bio"),
  photoUrl: varchar("photo_url", { length: 500 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Services ----------
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  priceKzt: integer("price_kzt").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  category: varchar("category", { length: 100 }).notNull().default("Диагностика"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Staff users (admin panel accounts) ----------
export const staffUsers = pgTable(
  "staff_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 200 }).notNull(),
    role: staffRoleEnum("role").notNull().default("STAFF"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("staff_users_email_idx").on(table.email),
  }),
);

// ---------- Appointments ----------
export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patientName: varchar("patient_name", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    email: varchar("email", { length: 255 }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),
    doctorId: uuid("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    appointmentDate: date("appointment_date").notNull(),
    appointmentTime: time("appointment_time").notNull(),
    status: appointmentStatusEnum("status").notNull().default("PENDING"),
    comment: text("comment"),
    // security / anti-abuse metadata
    sourceIpHash: varchar("source_ip_hash", { length: 128 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    dateIdx: index("appointments_date_idx").on(table.appointmentDate),
    doctorDateIdx: index("appointments_doctor_date_idx").on(table.doctorId, table.appointmentDate),
    statusIdx: index("appointments_status_idx").on(table.status),
    // prevent double-booking the same doctor at the same date/time slot
    doctorSlotUnique: uniqueIndex("appointments_doctor_slot_unique").on(
      table.doctorId,
      table.appointmentDate,
      table.appointmentTime,
    ),
  }),
);

// ---------- Audit log (tracks staff actions on appointments) ----------
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffUserId: uuid("staff_user_id").references(() => staffUsers.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: uuid("entity_id"),
  details: text("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- Relations ----------
export const doctorsRelations = relations(doctors, ({ many }) => ({
  appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
  service: one(services, { fields: [appointments.serviceId], references: [services.id] }),
}));

export type Doctor = typeof doctors.$inferSelect;
export type NewDoctor = typeof doctors.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type StaffUser = typeof staffUsers.$inferSelect;
