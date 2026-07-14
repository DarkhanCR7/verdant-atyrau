import { describe, it, expect } from "vitest";
import {
  appointmentInputSchema,
  staffLoginSchema,
  contactMessageSchema,
  changePasswordSchema,
} from "@/lib/validations";

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

describe("appointmentInputSchema", () => {
  const base = {
    patientName: "Асель Тестова",
    phone: "+77771234567",
    serviceId: "550e8400-e29b-41d4-a716-446655440000",
    appointmentDate: tomorrow(),
    appointmentTime: "10:00",
  };

  it("accepts a valid appointment", () => {
    const result = appointmentInputSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects a name with digits", () => {
    const result = appointmentInputSchema.safeParse({ ...base, patientName: "Ivan123" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    const result = appointmentInputSchema.safeParse({ ...base, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("normalizes a phone number with spaces and dashes", () => {
    const result = appointmentInputSchema.safeParse({ ...base, phone: "+7 777 123-45-67" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+77771234567");
    }
  });

  it("rejects a date in the past", () => {
    const result = appointmentInputSchema.safeParse({ ...base, appointmentDate: "2020-01-01" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed time", () => {
    const result = appointmentInputSchema.safeParse({ ...base, appointmentTime: "25:99" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-uuid serviceId", () => {
    const result = appointmentInputSchema.safeParse({ ...base, serviceId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("flags a filled honeypot field", () => {
    const result = appointmentInputSchema.safeParse({ ...base, website: "spammer-filled-this" });
    expect(result.success).toBe(false);
  });

  it("allows an empty honeypot field", () => {
    const result = appointmentInputSchema.safeParse({ ...base, website: "" });
    expect(result.success).toBe(true);
  });
});

describe("staffLoginSchema", () => {
  it("rejects a short password", () => {
    const result = staffLoginSchema.safeParse({ email: "a@b.com", password: "short" });
    expect(result.success).toBe(false);
  });

  it("lowercases the email", () => {
    const result = staffLoginSchema.safeParse({
      email: "ADMIN@Retina-A.KZ",
      password: "longenoughpassword",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("admin@retina-a.kz");
    }
  });
});

describe("contactMessageSchema", () => {
  it("accepts a valid message", () => {
    const result = contactMessageSchema.safeParse({
      name: "Ержан",
      phone: "+77011234567",
      message: "Здравствуйте, вопрос по записи",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a too-short message", () => {
    const result = contactMessageSchema.safeParse({
      name: "Ержан",
      phone: "+77011234567",
      message: "Хи",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts matching, strong passwords", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass123",
      newPassword: "NewPass456",
      confirmPassword: "NewPass456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched confirmation", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass123",
      newPassword: "NewPass456",
      confirmPassword: "Different789",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without digits", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "OldPass123",
      newPassword: "OnlyLetters",
      confirmPassword: "OnlyLetters",
    });
    expect(result.success).toBe(false);
  });
});
