import { z } from "zod";

// Kazakhstani phone numbers: +7 7XX XXX XX XX (mobile) — validated loosely to also allow
// landlines like +7 7122 XX XX XX used by the clinic itself.
const phoneRegex = /^\+?7\d{9,10}$/;

export const appointmentInputSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(2, "Введите имя (минимум 2 символа)")
    .max(200, "Слишком длинное имя")
    .regex(/^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі\s'-]+$/, "Имя может содержать только буквы"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(phoneRegex, "Введите телефон в формате +7XXXXXXXXXX")),
  email: z.string().trim().toLowerCase().email("Некорректный email").optional().or(z.literal("")),
  serviceId: z.string().uuid("Выберите услугу"),
  doctorId: z.string().uuid().optional().or(z.literal("")),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Некорректная дата")
    .refine((val) => {
      const date = new Date(val + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Дата не может быть в прошлом"),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Некорректное время"),
  comment: z.string().trim().max(1000, "Комментарий слишком длинный").optional().or(z.literal("")),
  // Honeypot field: real users never fill this in; bots that auto-fill every field will.
  website: z.string().max(0, "Спам обнаружен").optional().or(z.literal("")),
});

export type AppointmentInput = z.infer<typeof appointmentInputSchema>;

export const appointmentStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
});

export const doctorInputSchema = z.object({
  fullName: z.string().trim().min(2).max(200),
  specialization: z.string().trim().min(2).max(200),
  experienceYears: z.coerce.number().int().min(0).max(80),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  photoUrl: z.string().trim().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const serviceInputSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  priceKzt: z.coerce.number().int().min(0).max(10_000_000),
  durationMinutes: z.coerce.number().int().min(5).max(480),
  category: z.string().trim().min(2).max(100),
  isActive: z.boolean().default(true),
});

export const staffLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Некорректный email"),
  password: z.string().min(8, "Пароль минимум 8 символов").max(200),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z
      .string()
      .min(8, "Пароль минимум 8 символов")
      .max(200)
      .regex(/[A-Za-zА-Яа-я]/, "Пароль должен содержать буквы")
      .regex(/[0-9]/, "Пароль должен содержать цифру"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const createStaffSchema = z.object({
  fullName: z.string().trim().min(2, "Введите имя").max(200),
  email: z.string().trim().toLowerCase().email("Некорректный email"),
  password: z
    .string()
    .min(8, "Пароль минимум 8 символов")
    .max(200)
    .regex(/[A-Za-zА-Яа-я]/, "Пароль должен содержать буквы")
    .regex(/[0-9]/, "Пароль должен содержать цифру"),
  role: z.enum(["ADMIN", "STAFF"]),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(200),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(phoneRegex, "Введите телефон в формате +7XXXXXXXXXX")),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0).optional().or(z.literal("")),
});
