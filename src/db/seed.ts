import "dotenv/config";
import { db } from "./index";
import { doctors, services, staffUsers } from "./schema";
import { hashPassword } from "../lib/password";

async function main() {
  console.log("🌱 Seeding database...");

  const [existingService] = await db.select().from(services).limit(1);
  if (existingService) {
    console.log("⚠️  Data already exists, skipping seed. (Delete rows manually to re-seed.)");
    return;
  }

  await db
    .insert(services)
    .values([
      {
        name: "Консультация хирурга",
        description: "Первичный осмотр, диагностика новообразований, определение тактики лечения.",
        priceKzt: 10000,
        durationMinutes: 20,
        category: "Консультация",
      },
      {
        name: "Удаление бородавки",
        description: "Лазерное удаление бородавки с гистологическим контролем при необходимости.",
        priceKzt: 20000,
        durationMinutes: 20,
        category: "Удаление новообразований",
      },
      {
        name: "Удаление родинки",
        description: "Безопасное лазерное удаление невуса, кожа заживает без рубцов.",
        priceKzt: 28000,
        durationMinutes: 20,
        category: "Удаление новообразований",
      },
      {
        name: "Удаление папилломы",
        description: "Быстрое лазерное удаление папиллом любой локализации.",
        priceKzt: 15000,
        durationMinutes: 15,
        category: "Удаление новообразований",
      },
      {
        name: "Консультация косметолога",
        description: "Оценка состояния кожи, подбор программы ухода и процедур.",
        priceKzt: 8000,
        durationMinutes: 30,
        category: "Консультация",
      },
      {
        name: "Биоревитализация",
        description: "Увлажнение и восстановление кожи инъекциями гиалуроновой кислоты.",
        priceKzt: 35000,
        durationMinutes: 40,
        category: "Омоложение",
      },
      {
        name: "Чистка лица",
        description: "Комплексная механическая или аппаратная чистка кожи лица.",
        priceKzt: 18000,
        durationMinutes: 60,
        category: "Уход за кожей",
      },
      {
        name: "Лазерная эпиляция (зона на выбор)",
        description: "Удаление волос лазером, длительный результат за несколько процедур.",
        priceKzt: 12000,
        durationMinutes: 30,
        category: "Лазерная эпиляция",
      },
    ])
    .returning();

  // Демо-специалисты — замените на реальных врачей клиники через /admin/doctors
  await db
    .insert(doctors)
    .values([
      {
        fullName: "Врач-косметолог клиники",
        specialization: "Косметология, эстетическая медицина",
        experienceYears: 5,
        bio: "Замените это демо-описание на реального специалиста через панель администратора.",
      },
      {
        fullName: "Врач-хирург клиники",
        specialization: "Удаление новообразований кожи",
        experienceYears: 5,
        bio: "Замените это демо-описание на реального специалиста через панель администратора.",
      },
    ])
    .returning();

  const defaultAdminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@verdant-atyrau.kz";
  const defaultAdminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  await db.insert(staffUsers).values({
    email: defaultAdminEmail,
    passwordHash: await hashPassword(defaultAdminPassword),
    fullName: "Администратор клиники",
    role: "ADMIN",
  });

  console.log("✅ Seed complete.");
  console.log(`   Admin login: ${defaultAdminEmail}`);
  console.log(`   Admin password: ${defaultAdminPassword} (CHANGE THIS IMMEDIATELY)`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
