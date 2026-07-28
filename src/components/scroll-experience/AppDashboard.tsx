"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import apps from "@/data/apps.json";
import statsData from "@/data/stats.json";

type Status = "active" | "development" | "inactive";

type StatsEntry = {
  lastUpdated: string;
  metrics: unknown[];
};

const statusConfig: Record<Status, { color: string; glow: string; ring: string; label: string; description: string }> = {
  active: {
    color: "bg-green-400",
    glow: "shadow-[0_0_8px_rgba(74,222,128,0.8)]",
    ring: "ring-green-400/30",
    label: "Active",
    description: "System is live and operational",
  },
  development: {
    color: "bg-blue-400",
    glow: "shadow-[0_0_8px_rgba(96,165,250,0.8)]",
    ring: "ring-blue-400/30",
    label: "In Development",
    description: "Currently under active development",
  },
  inactive: {
    color: "bg-red-500",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.8)]",
    ring: "ring-red-500/30",
    label: "Inactive",
    description: "System is stopped or decommissioned",
  },
};

function StatusDot({ status }: { status: Status }) {
  const cfg = statusConfig[status] ?? statusConfig.inactive;
  return (
    <div className="relative group flex items-center justify-center">
      <span
        className={`block w-2.5 h-2.5 rounded-full ring-4 ${cfg.color} ${cfg.glow} ${cfg.ring} cursor-default flex-shrink-0`}
      />
      {/* Tooltip */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex flex-col bg-[#0d1424] border border-white/10 rounded-xl px-4 py-3 shadow-2xl min-w-max pointer-events-none">
        <span className={`text-sm font-bold font-mono ${status === "active" ? "text-green-400" : status === "development" ? "text-blue-400" : "text-red-400"}`}>
          {cfg.label}
        </span>
        <span className="text-xs text-ink-400 mt-0.5">{cfg.description}</span>
      </div>
    </div>
  );
}

export default function AppDashboard() {
  const activeCount = apps.filter(a => a.status === "active").length;
  const devCount = apps.filter(a => a.status === "development").length;
  const inactiveCount = apps.filter(a => a.status === "inactive").length;

  return (
    <section id="systems" className="py-24 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono text-accent-cyan uppercase tracking-widest mb-2">/ Systems Registry</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-ink-100 mb-6">
            LGU Applications & Systems
          </h2>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 text-xs font-mono bg-green-400/10 text-green-400 border border-green-400/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {activeCount} Active
            </span>
            <span className="flex items-center gap-2 text-xs font-mono bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {devCount} In Development
            </span>
            <span className="flex items-center gap-2 text-xs font-mono bg-red-500/10 text-red-400 border border-red-400/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {inactiveCount} Inactive
            </span>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          className="w-full rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Header */}
          <div className="hidden md:grid grid-cols-[48px_48px_1fr_140px_140px_110px_100px] gap-4 px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Status</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Icon</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Name</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Developer</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Last Update</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest text-center">Stats</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest text-right">Link</span>
          </div>

          {/* Rows */}
          {[...apps].sort((a, b) => a.name.localeCompare(b.name)).map((app, i) => {
            const showLink = app.isPublic && app.status === "active" && app.link;
            const appStats = (statsData as Record<string, StatsEntry>)[app.slug];
            const displayDate = appStats?.lastUpdated || app.lastUpdate;
            return (
              <motion.div
                key={app.id}
                className={`px-4 md:px-6 py-4 hover:bg-white/[0.04] transition-colors ${i < apps.length - 1 ? "border-b border-white/5" : ""}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                {/* ── MOBILE LAYOUT ── */}
                <div className="flex md:hidden items-start gap-3">
                  {/* Status + Icon stacked left */}
                  <div className="flex flex-col items-center gap-2 pt-1 flex-shrink-0">
                    <StatusDot status={app.status as Status} />
                    <div className="relative w-8 h-8 flex-shrink-0">
                      {app.icon && (
                        <Image src={app.icon} alt={app.name} fill className="object-contain" />
                      )}
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-semibold text-ink-100 leading-snug">
                      {app.name}
                    </p>
                    <p className="text-xs text-ink-400 font-mono mt-0.5">{app.developer}</p>
                    <p className="text-xs text-ink-400/60 font-mono">
                      {new Date(displayDate).toLocaleDateString("en-PH", {
                        year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Manila"
                      })}
                    </p>
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {app.status === "active" && (
                        <a
                          href={`/apps/${app.slug}`}
                          className="text-xs font-mono text-ink-400 hover:text-accent-cyan border border-white/10 hover:border-accent-cyan/30 px-3 py-1 rounded-full transition-all hover:bg-accent-cyan/5"
                        >
                          ⎔ Stats
                        </a>
                      )}
                      {showLink && (
                        <a
                          href={app.link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-accent-cyan hover:text-white border border-accent-cyan/30 hover:border-accent-cyan px-3 py-1 rounded-full transition-all hover:bg-accent-cyan/10"
                        >
                          ↗ Visit
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── DESKTOP LAYOUT ── */}
                <div className="hidden md:grid grid-cols-[48px_48px_1fr_140px_140px_110px_100px] gap-4 items-center">
                  {/* Status */}
                  <StatusDot status={app.status as Status} />

                  {/* Icon */}
                  <div className="relative w-8 h-8 flex-shrink-0">
                    {app.icon && (
                      <Image src={app.icon} alt={app.name} fill className="object-contain" />
                    )}
                  </div>

                  {/* Name */}
                  <span className="text-sm font-display font-semibold text-ink-100 truncate">
                    {app.name}
                  </span>

                  {/* Developer */}
                  <span className="text-sm text-ink-400 font-mono">
                    {app.developer}
                  </span>

                  {/* Last Update */}
                  <span className="text-sm text-ink-400 font-mono">
                    {new Date(displayDate).toLocaleDateString("en-PH", {
                      year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Manila"
                    })}
                  </span>

                  {/* Stats */}
                  <div className="flex justify-center">
                    {app.status === "active" ? (
                      <a
                        href={`/apps/${app.slug}`}
                        className="text-xs font-mono text-ink-400 hover:text-accent-cyan border border-white/10 hover:border-accent-cyan/30 px-3 py-1.5 rounded-full transition-all hover:bg-accent-cyan/5 whitespace-nowrap"
                      >
                        ⎔ Stats
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-ink-400/30 px-3 py-1.5">—</span>
                    )}
                  </div>

                  {/* Link */}
                  <div className="flex justify-end">
                    {showLink ? (
                      <a
                        href={app.link!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-accent-cyan hover:text-white border border-accent-cyan/30 hover:border-accent-cyan px-3 py-1.5 rounded-full transition-all hover:bg-accent-cyan/10 whitespace-nowrap"
                      >
                        ↗ Visit
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-ink-400/30 px-3 py-1.5">—</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
