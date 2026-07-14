import type { Metadata } from "next";
import Link from "next/link";
import { listActiveServices } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Цены",
  description: "Стоимость услуг клиники лазерной косметологии Verdant в Атырау.",
};

export const dynamic = "force-dynamic";

export default async function PricesPage() {
  const services = await listActiveServices();
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <p className="font-data text-sage text-sm tracking-widest uppercase">Прайс-лист</p>
      <h1 className="font-display text-deep mt-2 text-4xl font-bold md:text-5xl">Цены на услуги</h1>
      <p className="text-ink/70 mt-4 text-lg">
        Цены указаны в тенге. Точная стоимость лечения определяется врачом после диагностики.
      </p>

      {categories.map((category) => (
        <section key={category} className="mt-12">
          <h2 className="font-display text-deep text-xl font-semibold">{category}</h2>
          <div className="divide-line border-line mt-4 divide-y overflow-hidden rounded-xl border bg-white">
            {services
              .filter((s) => s.category === category)
              .map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-deep font-medium">{s.name}</p>
                    <p className="font-data text-ink/50 text-xs">{s.durationMinutes} мин</p>
                  </div>
                  <p className="font-data text-deep text-lg font-semibold whitespace-nowrap">
                    {s.priceKzt.toLocaleString("ru-RU")} ₸
                  </p>
                </div>
              ))}
          </div>
        </section>
      ))}

      <p className="text-ink/50 mt-10 text-sm">
        * Цены актуальны на момент публикации и могут быть уточнены по телефону.
      </p>

      <div className="mt-10 text-center">
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
