"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import apps from "@/data/apps.json";

type Status = "active" | "development" | "inactive";

const statusConfig: Record<Status, { color: string; glow: string; label: string; description: string }> = {
  active: {
    color: "bg-green-400",
    glow: "shadow-[0_0_10px_rgba(74,222,128,0.8)]",
    label: "Active",
    description: "System is live and operational",
  },
  development: {
    color: "bg-blue-400",
    glow: "shadow-[0_0_10px_rgba(96,165,250,0.8)]",
    label: "In Development",
    description: "Currently under active development",
  },
  inactive: {
    color: "bg-red-500",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.8)]",
    label: "Inactive",
    description: "System is stopped or decommissioned",
  },
};

function StatusDot({ status }: { status: Status }) {
  const cfg = statusConfig[status] ?? statusConfig.inactive;
  return (
    <div className="relative group flex items-center justify-center">
      <span className={`block w-3 h-3 rounded-full ${cfg.color} ${cfg.glow} cursor-default`} />
      {/* Tooltip */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex flex-col bg-[#0d1424] border border-white/10 rounded-xl px-4 py-3 shadow-xl min-w-max pointer-events-none">
        <span className={`text-sm font-bold font-mono ${status === "active" ? "text-green-400" : status === "development" ? "text-blue-400" : "text-red-400"}`}>
          {cfg.label}
        </span>
        <span className="text-xs text-ink-400 mt-0.5">{cfg.description}</span>
      </div>
    </div>
  );
}

export default function AppDashboard({ progress }: { progress: MotionValue<number> }) {
  // Fade in when logo docks (0.2 → 0.3), fade out when team section appears (0.55 → 0.65)
  const opacity = useTransform(progress, [0, 0.2, 0.28, 0.55, 0.65], [0, 0, 1, 1, 0]);
  const y = useTransform(progress, [0.2, 0.28, 0.55, 0.65], ["30px", "0px", "0px", "-20px"]);

  return (
    <div className="fixed left-0 top-0 w-full h-screen flex items-end justify-center pointer-events-none z-40 px-4 md:px-12 pb-10 md:pb-16">
      <motion.div
        className="w-full max-w-6xl"
        style={{ opacity, y }}
      >
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-ink-400 uppercase tracking-widest">System Registry</span>
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs font-mono text-ink-400">{apps.length} systems</span>
        </div>

        {/* Table */}
        <div className="w-full rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md bg-white/[0.02]" style={{ pointerEvents: "auto" }}>
          {/* Header row */}
          <div className="grid grid-cols-[40px_48px_1fr_1fr_120px_80px] gap-4 px-6 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Status</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Icon</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Name</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Developer</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">Last Update</span>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest text-right">Link</span>
          </div>

          {/* App rows */}
          {apps.map((app, i) => {
            const showLink = app.isPublic && app.status === "active" && app.link;
            return (
              <div
                key={app.id}
                className={`grid grid-cols-[40px_48px_1fr_1fr_120px_80px] gap-4 items-center px-6 py-4 hover:bg-white/5 transition-colors ${i < apps.length - 1 ? "border-b border-white/5" : ""}`}
              >
                {/* Status dot */}
                <StatusDot status={app.status as Status} />

                {/* Icon */}
                <div className="relative w-8 h-8 flex-shrink-0">
                  {app.icon && (
                    <Image
                      src={app.icon}
                      alt={app.name}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>

                {/* Name */}
                <span className="text-sm font-display font-semibold text-ink-100 truncate">
                  {app.name}
                </span>

                {/* Developer */}
                <span className="text-sm text-ink-400 font-mono truncate">
                  {app.developer}
                </span>

                {/* Last Update */}
                <span className="text-sm text-ink-400 font-mono">
                  {new Date(app.lastUpdate).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                </span>

                {/* Link */}
                <div className="flex justify-end">
                  {showLink ? (
                    <a
                      href={app.link!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-accent-cyan hover:text-white border border-accent-cyan/30 hover:border-accent-cyan px-3 py-1.5 rounded-full transition-all hover:bg-accent-cyan/10"
                    >
                      ↗ Visit
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-ink-400/40 px-3 py-1.5">
                      —
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
