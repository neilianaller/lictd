"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type AppData = {
  id: string;
  name: string;
  slug: string;
  status: string;
  developer: string;
  lastUpdate: string;
  isPublic: boolean;
  icon: string | null;
  link: string | null;
};

type Metric = {
  label: string;
  value: any;
  type: "currency" | "number" | "string" | "date";
  icon: string;
  color: string;
};

type AppStatsData = {
  lastUpdated: string;
  metrics: Metric[];
};

function formatValue(value: any, type: Metric["type"]) {
  if (value == null) return "—";

  switch (type) {
    case "currency":
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      }).format(Number(value));
    case "number":
      return new Intl.NumberFormat("en-US").format(Number(value));
    case "date":
      return new Date(String(value)).toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "string":
    default:
      return String(value);
  }
}

function getColorClasses(color: string) {
  switch (color) {
    case "gold":
      return "text-accent-gold drop-shadow-[0_0_15px_rgba(232,196,104,0.3)]";
    case "cyan":
      return "text-accent-cyan drop-shadow-[0_0_15px_rgba(79,216,232,0.3)]";
    case "green":
      return "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]";
    case "blue":
      return "text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]";
    case "red":
      return "text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]";
    default:
      return "text-white";
  }
}

export default function AppStatsClient({
  app,
  appStats,
}: {
  app: AppData;
  appStats: AppStatsData | null;
}) {
  const router = useRouter();

  const hasStats = appStats && appStats.metrics && appStats.metrics.length > 0;
  // Use appStats.lastUpdated if it exists, otherwise fallback to app.lastUpdate
  const displayDate = appStats?.lastUpdated || app.lastUpdate;

  return (
    <main className="min-h-screen bg-void flex flex-col items-center px-4 py-16 md:py-24">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-void-gradient pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-8">
        {/* Top Nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => router.back()}
            className="text-xs font-mono text-ink-400 hover:text-accent-cyan transition-colors"
          >
            ← Back
          </button>
        </motion.div>

        {/* App Header */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-white/10 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Icon */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 drop-shadow-[0_0_30px_rgba(79,216,232,0.15)]">
            {app.icon ? (
              <Image src={app.icon} alt={app.name} fill className="object-contain" />
            ) : (
              <div className="w-full h-full bg-white/5 rounded-2xl flex items-center justify-center text-ink-400 font-mono text-xs">
                No Icon
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-[10px] font-mono text-accent-cyan tracking-widest uppercase border border-accent-cyan/20 bg-accent-cyan/10 px-2 py-0.5 rounded-full">
                {app.status}
              </span>
              {app.isPublic && (
                <span className="text-[10px] font-mono text-ink-400 tracking-widest uppercase border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                  Public
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-ink-100 mb-2">
              {app.name}
            </h1>
            <p className="text-sm font-mono text-ink-400 mb-4">
              Developed by {app.developer}
            </p>
            {app.link && (
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center self-center md:self-start gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-ink-100 text-sm font-mono px-6 py-2 rounded-full transition-all"
              >
                Visit ↗
              </a>
            )}
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="flex flex-col gap-6">
          <motion.h2
            className="text-sm font-mono text-accent-cyan uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            / System Analytics
          </motion.h2>

          {hasStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appStats.metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col justify-between bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1, type: "spring", bounce: 0.4 }}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl font-display">{metric.icon}</span>
                  </div>
                  <span className="text-xs font-mono text-ink-400 uppercase tracking-widest mb-4">
                    {metric.label}
                  </span>
                  <span
                    className={`text-3xl md:text-4xl font-display font-bold ${getColorClasses(
                      metric.color
                    )}`}
                  >
                    {formatValue(metric.value, metric.type)}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/10 border-dashed rounded-2xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-3xl mb-4 opacity-50">📊</span>
              <h3 className="text-lg font-display text-ink-100 mb-2">No data available</h3>
              <p className="text-sm font-mono text-ink-400">
                Analytics are not yet configured for this system.
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          className="mt-8 pt-8 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-[10px] font-mono text-ink-400/50 uppercase tracking-widest">
            Last Updated:{" "}
            {new Intl.DateTimeFormat("en-US", {
              timeZone: "Asia/Manila",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(displayDate))}
          </p>
        </motion.div>
      </div>
    </main>
  );
}
