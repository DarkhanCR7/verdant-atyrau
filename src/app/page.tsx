import Link from "next/link";
import { Sparkles, Leaf, ShieldCheck, Clock, MapPin, Phone } from "lucide-react";
import { GrowthMark } from "@/components/site/growth-mark";
import { BookingForm } from "@/components/site/booking-form";
import { clinic } from "@/lib/clinic";
import { listActiveDoctors, listActiveServices } from "@/server/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [doctors, services] = await Promise.all([listActiveDoctors(), listActiveServices()]);
  const featuredServices = services.slice(0, 6);

  return (
    <>
      {/* HERO — the growth mark sprouts beside the headline, echoing renewal + precision */}
      <section className="border-line relative overflow-hidden border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="fade-up relative z-10">
            <p className="font-data text-sage text-sm tracking-widest uppercase">
              Клиника лазерной косметологии · Атырау
            </p>
            <h1 className="font-display text-deep mt-4 text-4xl leading-[1.08] font-bold sm:text-5xl md:text-6xl">
              Свежий взгляд
              <br /> на вашу кожу
            </h1>
            <p className="text-ink/70 mt-5 max-w-md text-lg">
              Verdant удаляет новообразования, омолаживает и ухаживает за кожей — лазерными и
              аппаратными методами, безопасно и с гарантией результата.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#booking"
                className="bg-deep hover:bg-deep-light rounded-full px-7 py-3.5 text-base font-semibold text-white transition"
              >
                Записаться на приём
              </Link>
              <a
                href={`tel:${clinic.phones[0].href}`}
                className="border-deep/30 text-deep hover:bg-deep/5 flex items-center gap-2 rounded-full border px-7 py-3.5 text-base font-semibold transition"
              >
                <Phone className="h-4 w-4" /> {clinic.phones[0].label}
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <GrowthMark className="text-deep h-[340px] w-[340px] md:h-[420px] md:w-[420px]" />
            <div className="bg-deep absolute flex h-24 w-24 items-center justify-center rounded-full text-white md:h-28 md:w-28">
              <Leaf className="h-10 w-10" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-line border-b bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-10 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Leaf className="text-sage h-6 w-6 shrink-0" />
            <div>
              <p className="text-deep font-semibold">Безопасное удаление</p>
              <p className="text-ink/60 text-sm">Родинки, папилломы, бородавки — без рубцов</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-sage h-6 w-6 shrink-0" />
            <div>
              <p className="text-deep font-semibold">Опытные специалисты</p>
              <p className="text-ink/60 text-sm">Хирурги и косметологи с лицензией Минздрава РК</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="text-sage h-6 w-6 shrink-0" />
            <div>
              <p className="text-deep font-semibold">Современное оборудование</p>
              <p className="text-ink/60 text-sm">Лазерные и аппаратные методики нового поколения</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-data text-sage text-sm tracking-widest uppercase">Услуги</p>
            <h2 className="font-display text-deep mt-2 text-3xl font-bold md:text-4xl">
              Процедуры и уход
            </h2>
          </div>
          <Link href="/services" className="text-deep hover:text-sage text-sm font-semibold">
            Все услуги и цены →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((s) => (
            <div
              key={s.id}
              className="border-line hover:border-sage/50 rounded-2xl border bg-white p-6 transition hover:shadow-sm"
            >
              <p className="font-data text-sage text-xs tracking-wide uppercase">{s.category}</p>
              <h3 className="font-display text-deep mt-2 text-lg font-semibold">{s.name}</h3>
              {s.description && <p className="text-ink/60 mt-2 text-sm">{s.description}</p>}
              <p className="font-data text-deep mt-4 text-lg font-semibold">
                от {s.priceKzt.toLocaleString("ru-RU")} ₸
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DOCTORS PREVIEW */}
      <section className="border-line border-y bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="font-data text-sage text-sm tracking-widest uppercase">Специалисты</p>
          <h2 className="font-display text-deep mt-2 text-3xl font-bold md:text-4xl">
            Наша команда
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <div key={d.id} className="flex items-start gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <GrowthMark className="text-sage absolute h-16 w-16" animate={false} />
                  <span className="font-display text-deep text-lg font-bold">
                    {d.fullName
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-display text-deep text-lg font-semibold">{d.fullName}</p>
                  <p className="text-ink/60 text-sm">{d.specialization}</p>
                  <p className="font-data text-sage mt-1 text-xs">Стаж {d.experienceYears} лет</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="font-data text-sage text-sm tracking-widest uppercase">Запись</p>
            <h2 className="font-display text-deep mt-2 text-3xl font-bold md:text-4xl">
              Записаться на приём
            </h2>
            <p className="text-ink/70 mt-4">
              Заполните форму, и мы перезвоним для подтверждения времени. Либо позвоните нам
              напрямую — сегодня и завтра часто есть свободные окна.
            </p>
            <div className="text-ink/70 mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="text-sage h-4 w-4" /> Пн–Сб 10:00–18:00, Вс — выходной
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-sage h-4 w-4" /> {clinic.address}
              </div>
            </div>
          </div>
          <div className="border-line rounded-2xl border bg-white p-6 md:p-8">
            <BookingForm doctors={doctors} services={services} />
          </div>
        </div>
      </section>
    </>
  );
}
