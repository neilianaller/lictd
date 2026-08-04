import StatusBadge from "@/components/ui/StatusBadge";
import { getSslStatuses, type SslStatus } from "@/lib/ssl";

export const dynamic = "force-dynamic";

type Row = SslStatus & { daysRemaining: number | null };

function getDaysRemaining(expiry: string | null): number | null {
  if (!expiry) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(expiry).getTime() - Date.now()) / msPerDay);
}

function getStatusInfo(daysRemaining: number | null): { status: "ok" | "expiring" | "expired"; label: string } {
  if (daysRemaining === null || daysRemaining <= 0) return { status: "expired", label: "Expired" };
  if (daysRemaining <= 30) return { status: "expiring", label: "Expiring Soon" };
  return { status: "ok", label: "OK" };
}

function formatExpiry(expiry: string | null): string {
  if (!expiry) return "—";
  return new Date(expiry).toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SslMonitoringPage() {
  const statuses = await getSslStatuses();

  const rows: Row[] = statuses
    .map((s) => ({ ...s, daysRemaining: getDaysRemaining(s.expiry) }))
    .sort((a, b) => {
      const aVal = a.daysRemaining ?? -Infinity;
      const bVal = b.daysRemaining ?? -Infinity;
      return aVal - bVal;
    });

  return (
    <main className="min-h-screen bg-void flex flex-col items-center px-4 py-16 md:py-24">
      <div className="fixed inset-0 bg-void-gradient pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-8">
        <div className="border-b border-white/10 pb-8">
          <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
            / SSL Monitoring
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-ink-100 mt-2">
            Certificate Expiry
          </h1>
          <p className="text-sm font-mono text-ink-400 mt-2">
            Live TLS certificate status for monitored domains.
          </p>
        </div>

        <div className="overflow-x-auto bg-white/[0.02] border border-white/10 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-xs font-mono text-ink-400 uppercase tracking-widest">App Name</th>
                <th className="px-6 py-4 text-xs font-mono text-ink-400 uppercase tracking-widest">Domain</th>
                <th className="px-6 py-4 text-xs font-mono text-ink-400 uppercase tracking-widest">Expiry Date</th>
                <th className="px-6 py-4 text-xs font-mono text-ink-400 uppercase tracking-widest">Days Remaining</th>
                <th className="px-6 py-4 text-xs font-mono text-ink-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const { status, label } = getStatusInfo(row.daysRemaining);
                return (
                  <tr key={row.domain} className="border-b border-white/5 last:border-b-0">
                    <td className="px-6 py-4 text-sm font-display text-ink-100">{row.name}</td>
                    <td className="px-6 py-4 text-sm font-mono text-ink-400">{row.domain}</td>
                    <td className="px-6 py-4 text-sm font-mono text-ink-100">{formatExpiry(row.expiry)}</td>
                    <td className="px-6 py-4 text-sm font-mono text-ink-100">
                      {row.daysRemaining !== null ? row.daysRemaining : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={status} label={label} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
