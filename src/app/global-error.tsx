"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <div className="bg-paper flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
          <AlertTriangle className="text-terracotta h-12 w-12" />
          <h1 className="font-display text-deep text-2xl font-bold">Что-то пошло не так</h1>
          <p className="text-ink/60 max-w-sm">
            Произошла непредвиденная ошибка. Мы уже знаем о проблеме — попробуйте обновить страницу.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="bg-deep hover:bg-deep-light rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            >
              Попробовать снова
            </button>
            <Link
              href="/"
              className="border-line text-deep rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-white"
            >
              На главную
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
