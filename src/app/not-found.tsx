import Link from "next/link";
import { GrowthMark } from "@/components/site/growth-mark";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <GrowthMark className="text-deep absolute h-32 w-32" animate={false} />
        <span className="font-display text-deep text-3xl font-bold">404</span>
      </div>
      <h1 className="font-display text-deep text-2xl font-bold">Страница не найдена</h1>
      <p className="text-ink/60 max-w-sm">
        Похоже, такой страницы не существует, либо она была перемещена.
      </p>
      <Link
        href="/"
        className="bg-deep hover:bg-deep-light mt-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
