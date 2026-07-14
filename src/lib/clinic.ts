export const clinic = {
  name: "Verdant",
  fullName: "Клиника лазерной косметологии и омоложения «Verdant»",
  address: "ул. Махамбета Утемисова, 37, 4 этаж, Атырау",
  city: "Атырау",
  phones: [{ label: "+7 702 455 50 50", href: "+77024555050" }],
  email: "info@verdant-atyrau.kz",
  instagram: "https://instagram.com/verdantatyrau",
  whatsapp: "https://wa.me/77024555050",
  mapEmbedQuery: "ул. Махамбета Утемисова, 37, Атырау",
  mapLink: "https://go.2gis.com/sLfU9",
  license: "Лицензия № 128-5669998, Министерство здравоохранения РК",
  hours: [
    { days: "Понедельник — Суббота", time: "10:00 — 18:00" },
    { days: "Воскресенье", time: "выходной" },
  ],
  workingHours: { start: "10:00", end: "18:00" },
} as const;
