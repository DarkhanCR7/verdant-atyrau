import type { Metadata } from "next";
import Link from "next/link";
import { GrowthMark } from "@/components/site/growth-mark";
import { listActiveDoctors } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Врачи",
  description: "Специалисты клиники Verdant в Атырау.",
};

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const doctors = await listActiveDoctors();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <p className="font-data text-sage text-sm tracking-widest uppercase">Специалисты</p>
      <h1 className="font-display text-deep mt-2 text-4xl font-bold md:text-5xl">Наша команда</h1>
      <p className="text-ink/70 mt-4 max-w-xl text-lg">
        Команда сертифицированных хирургов и косметологов клиники Verdant.
      </p>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <div key={d.id} className="border-line rounded-2xl border bg-white p-7">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <GrowthMark className="text-sage absolute h-20 w-20" animate={false} />
              <span className="font-display text-deep text-2xl font-bold">
                {d.fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")}
              </span>
            </div>
            <h2 className="font-display text-deep mt-4 text-xl font-semibold">{d.fullName}</h2>
            <p className="text-ink/60 text-sm">{d.specialization}</p>
            <p className="font-data text-sage mt-1 text-xs">Стаж {d.experienceYears} лет</p>
            {d.bio && <p className="text-ink/70 mt-3 text-sm">{d.bio}</p>}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/#booking"
          className="bg-deep hover:bg-deep-light inline-block rounded-full px-7 py-3.5 font-semibold text-white"
        >
          Записаться на приём
        </Link>
      </div>
    </div>
  );
}
