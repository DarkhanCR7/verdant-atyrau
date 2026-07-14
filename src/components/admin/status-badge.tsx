const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Ожидает", className: "bg-terracotta/15 text-terracotta" },
  CONFIRMED: { label: "Подтверждено", className: "bg-sage/15 text-sage" },
  CANCELLED: { label: "Отменено", className: "bg-red-100 text-red-600" },
  COMPLETED: { label: "Завершено", className: "bg-deep/10 text-deep" },
  NO_SHOW: { label: "Не пришёл", className: "bg-ink/10 text-ink/60" },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? { label: status, className: "bg-ink/10 text-ink/60" };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}>
      {style.label}
    </span>
  );
}
