"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { clinic } from "@/lib/clinic";

const navLinks = [
  { href: "/services", label: "Услуги" },
  { href: "/doctors", label: "Врачи" },
  { href: "/prices", label: "Цены" },
  { href: "/contacts", label: "Контакты" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-line/70 bg-paper/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="border-deep relative inline-block h-8 w-8 rounded-full border-2">
            <span className="bg-sage absolute inset-1.5 rounded-full" />
          </span>
          <span className="font-display text-deep text-xl font-bold tracking-tight">Verdant</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/80 hover:text-sage text-sm font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={`tel:${clinic.phones[0].href}`}
            className="text-deep flex items-center gap-1.5 text-sm font-semibold"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
            {clinic.phones[0].label}
          </a>
          <Link
            href="/#booking"
            className="bg-deep hover:bg-deep-light rounded-full px-5 py-2.5 text-sm font-semibold text-white transition"
          >
            Записаться
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-line border-t md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink/85 hover:bg-sage-light/30 rounded-md px-2 py-2.5 text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${clinic.phones[0].href}`}
              className="text-deep mt-2 flex items-center gap-2 rounded-md px-2 py-2.5 text-base font-semibold"
            >
              <Phone className="h-4 w-4" /> {clinic.phones[0].label}
            </a>
            <Link
              href="/#booking"
              onClick={() => setOpen(false)}
              className="bg-deep mt-1 rounded-full px-5 py-3 text-center text-base font-semibold text-white"
            >
              Записаться на приём
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
