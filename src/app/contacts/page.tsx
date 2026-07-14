import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Контакты",
  description: `${clinic.fullName}. Адрес: ${clinic.address}. Телефон: ${clinic.phones[0].label}.`,
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <p className="font-data text-sage text-sm tracking-widest uppercase">Контакты</p>
      <h1 className="font-display text-deep mt-2 text-4xl font-bold md:text-5xl">Как нас найти</h1>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <div>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="text-sage mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-deep font-semibold">Адрес</p>
                <a
                  href={clinic.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/70 hover:text-sage"
                >
                  {clinic.address}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-sage mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-deep font-semibold">Телефоны</p>
                {clinic.phones.map((p) => (
                  <a
                    key={p.href}
                    href={`tel:${p.href}`}
                    className="font-data text-ink/70 hover:text-sage block"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-sage mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-deep font-semibold">Email</p>
                <a href={`mailto:${clinic.email}`} className="text-ink/70 hover:text-sage">
                  {clinic.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-sage mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-deep font-semibold">Часы работы</p>
                {clinic.hours.map((h) => (
                  <p key={h.days} className="text-ink/70">
                    {h.days}: <span className="font-data">{h.time}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-line mt-8 overflow-hidden rounded-2xl border">
            <iframe
              title="Карта — Verdant"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.mapEmbedQuery)}&output=embed`}
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="border-line rounded-2xl border bg-white p-6 md:p-8">
          <h2 className="font-display text-deep text-xl font-semibold">Напишите нам</h2>
          <p className="text-ink/60 mt-1 text-sm">
            Ответим в рабочее время. Для срочных вопросов — звоните напрямую.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
