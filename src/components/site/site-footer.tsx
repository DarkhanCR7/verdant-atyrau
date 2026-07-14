import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { clinic } from "@/lib/clinic";

export function SiteFooter() {
  return (
    <footer className="border-line bg-deep border-t text-white/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="border-sage-light relative inline-block h-7 w-7 rounded-full border-2">
              <span className="bg-sage absolute inset-1.5 rounded-full" />
            </span>
            <span className="font-display text-lg font-bold">Verdant</span>
          </div>
          <p className="mt-3 text-sm text-white/60">
            Клиника лазерной косметологии и омоложения в Атырау.
          </p>
          <p className="mt-2 text-xs text-white/40">{clinic.license}</p>
        </div>

        <div>
          <h3 className="text-sage-light text-sm font-semibold tracking-wide uppercase">
            Контакты
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <MapPin className="text-sage-light mt-0.5 h-4 w-4 shrink-0" />
              <a
                href={clinic.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {clinic.address}
              </a>
            </li>
            {clinic.phones.map((p) => (
              <li key={p.href} className="flex items-center gap-2">
                <Phone className="text-sage-light h-4 w-4 shrink-0" />
                <a href={`tel:${p.href}`} className="font-data hover:text-white">
                  {p.label}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Mail className="text-sage-light h-4 w-4 shrink-0" />
              <a href={`mailto:${clinic.email}`} className="hover:text-white">
                {clinic.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sage-light text-sm font-semibold tracking-wide uppercase">
            Часы работы
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {clinic.hours.map((h) => (
              <li key={h.days} className="flex items-start gap-2">
                <Clock className="text-sage-light mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {h.days}: <span className="font-data">{h.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sage-light text-sm font-semibold tracking-wide uppercase">
            Навигация
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/services" className="hover:text-white">
                Услуги
              </Link>
            </li>
            <li>
              <Link href="/doctors" className="hover:text-white">
                Врачи
              </Link>
            </li>
            <li>
              <Link href="/prices" className="hover:text-white">
                Цены
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-white">
                Контакты
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Verdant. Все права защищены.</p>
          <Link href="/admin/login" className="hover:text-white/80">
            Вход для сотрудников
          </Link>
        </div>
      </div>
    </footer>
  );
}
