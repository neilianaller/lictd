"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import Image from "next/image";

type AppData = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "maintenance" | "deprecated";
  description: string;
  isPublic: boolean;
  icon: string | null;
  link: string | null;
};

export default function AppCard({
  app,
  progress,
  index,
  total,
  isActive,
}: {
  app: AppData;
  progress: MotionValue<number>;
  index: number;
  total: number;
  isActive: boolean;
}) {
  // Stage 2: 0.20 to 0.55
  const stageStart = 0.2;
  const stageEnd = 0.55;
  const step = (stageEnd - stageStart) / total;

  const enterStart = stageStart + index * step;
  const enterEnd = enterStart + step * 0.5;       // fade+float in
  const exitStart = enterStart + step;             // start fading out when next card enters
  const exitEnd = exitStart + step * 0.4;

  const isLast = index === total - 1;

  // Unified opacity covering full scroll range 0→1.
  // Starting at 0 ensures no card is visible at page load (no clamping issue).
  // Last card fades out at 0.55–0.65 when Team section appears.
  const inputRange = isLast
    ? [0, enterStart, enterEnd, 0.55, 0.65, 1]
    : [0, enterStart, enterEnd, exitStart, exitEnd, 1];
  const outputOpacity = [0, 0, 1, 1, 0, 0];
  const outputY: string[] = isLast
    ? ["40px", "40px", "0px", "0px", "-20px", "-20px"]
    : ["40px", "40px", "0px", "0px", "-30px", "-30px"];

  const opacity = useTransform(progress, inputRange, outputOpacity);
  const y = useTransform(progress, inputRange, outputY);
  const scale = useTransform(progress, inputRange, isLast ? [1, 1, 1, 1, 0.95, 0.95] : [1, 1, 1, 1, 1, 1]);


  const showLink = app.isPublic && app.status === "active" && app.link;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-white/0 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl flex flex-col justify-center gap-6 shadow-2xl overflow-hidden"
      style={{
        opacity,
        y,
        scale,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    >
      {/* Status badge top-right */}
      <div className="absolute top-8 right-8">
        <StatusBadge status={app.status} />
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl">
        {/* App Icon */}
        {app.icon && (
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden p-3">
            <Image
              src={app.icon}
              alt={`${app.name} icon`}
              fill
              className="object-contain p-2"
            />
          </div>
        )}

        {/* Text Info */}
        <div className="flex flex-col gap-4">
          <h3 className="text-4xl md:text-6xl font-display font-bold text-ink-100 tracking-tight">
            {app.name}
          </h3>
          <p className="text-lg md:text-xl text-ink-400 font-sans leading-relaxed max-w-2xl">
            {app.description}
          </p>
        </div>
      </div>

      {/* Actions — only receive pointer events on the active card */}
      <div className="mt-4 flex gap-4 flex-wrap" style={{ pointerEvents: isActive ? "auto" : "none" }}>
        {showLink && (
          <a
            href={app.link!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent-cyan text-[#060B18] font-mono uppercase tracking-widest text-sm font-bold shadow-[0_0_30px_rgba(79,216,232,0.4)] hover:shadow-[0_0_50px_rgba(79,216,232,0.7)] hover:scale-105 transition-all"
          >
            <span>↗</span> Visit Site
          </a>
        )}
        <a
          href={`/apps/${app.slug}`}
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/5 text-ink-400 border border-white/10 hover:border-accent-cyan/30 hover:text-accent-cyan transition-all font-mono uppercase tracking-widest text-sm"
        >
          [ VIEW_STATS ]
        </a>
      </div>

      {/* Decorative lines */}
      <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
      <div className="absolute top-12 bottom-12 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      {/* Large faded icon background watermark */}
      {app.icon && (
        <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 pointer-events-none">
          <Image
            src={app.icon}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      )}
    </motion.div>
  );
}
