import type { Metadata } from "next";
import Link from "next/link";
import { listActiveServices } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Лазерная косметология, удаление новообразований и уход за кожей в клинике Verdant в Атырау.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await listActiveServices();
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <p className="font-data text-sage text-sm tracking-widest uppercase">Услуги</p>
      <h1 className="font-display text-deep mt-2 text-4xl font-bold md:text-5xl">
        Процедуры и уход
      </h1>
      <p className="text-ink/70 mt-4 max-w-xl text-lg">
        Полный спектр услуг — от консультации до лазерного удаления новообразований и аппаратного
        ухода за кожей.
      </p>

      {categories.map((category) => (
        <section key={category} className="mt-14">
          <h2 className="font-display text-deep text-2xl font-semibold">{category}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((s) => s.category === category)
              .map((s) => (
                <div key={s.id} className="border-line rounded-2xl border bg-white p-6">
                  <h3 className="font-display text-deep text-lg font-semibold">{s.name}</h3>
                  {s.description && <p className="text-ink/60 mt-2 text-sm">{s.description}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-data text-deep text-lg font-semibold">
                      {s.priceKzt.toLocaleString("ru-RU")} ₸
                    </span>
                    <span className="font-data text-ink/50 text-xs">{s.durationMinutes} мин</span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      <div className="bg-deep mt-16 rounded-2xl px-8 py-10 text-center text-white">
        <h2 className="font-display text-2xl font-semibold">Не знаете, какая услуга нужна?</h2>
        <p className="mt-2 text-white/70">
          Запишитесь на первичную консультацию — врач определит дальнейшую тактику обследования.
        </p>
        <Link
          href="/#booking"
          className="text-deep hover:bg-sage-light mt-5 inline-block rounded-full bg-white px-7 py-3 font-semibold"
        >
          Записаться на приём
        </Link>
      </div>
    </div>
  );
}
