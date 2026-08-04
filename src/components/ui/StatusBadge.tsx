import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Status = "active" | "maintenance" | "deprecated" | "ok" | "expiring" | "expired";

export default function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const statusStyles = {
    active: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
    maintenance: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    deprecated: "bg-ink-400/10 text-ink-400 border-ink-400/20",
    ok: "bg-green-500/10 text-green-400 border-green-500/20",
    expiring: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    expired: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  return (
    <span className={twMerge(
      "px-2 py-1 rounded-full text-xs font-mono border uppercase tracking-wider flex items-center gap-1.5",
      statusStyles[status]
    )}>
      <span className={clsx(
        "w-1.5 h-1.5 rounded-full",
        status === "active" && "bg-accent-cyan animate-pulse",
        status === "maintenance" && "bg-amber-500",
        status === "deprecated" && "bg-ink-400",
        status === "ok" && "bg-green-400",
        status === "expiring" && "bg-amber-500 animate-pulse",
        status === "expired" && "bg-red-400 animate-pulse"
      )} />
      {label ?? status}
    </span>
  );
}
