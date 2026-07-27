"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type AppData = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "maintenance" | "deprecated";
  description: string;
  isPublic: boolean;
};

export default function AppCard({
  app,
  progress,
  index,
  total,
}: {
  app: AppData;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Stage 2 is from 0.20 to 0.55
  const stageStart = 0.2;
  const stageEnd = 0.55;
  const stageLength = stageEnd - stageStart;
  const step = stageLength / total;
  
  // Card enters
  const enterStart = stageStart + index * step;
  const enterEnd = enterStart + step * 0.6; // 60% of the step is for entry
  
  // Card exits (when the next card is entering)
  const exitStart = enterStart + step; 
  const exitEnd = exitStart + step * 0.6;

  // The last card shouldn't exit during this stage. It stays until Stage 3.
  const isLast = index === total - 1;

  // Carousel transform mapping
  const rotateY = useTransform(
    progress, 
    [enterStart, enterEnd, exitStart, exitEnd], 
    [-90, 0, 0, isLast ? 0 : 90] 
  );
  
  const x = useTransform(
    progress, 
    [enterStart, enterEnd, exitStart, exitEnd], 
    ["-50vw", "0vw", "0vw", isLast ? "0vw" : "50vw"] 
  );
  
  const opacity = useTransform(
    progress, 
    [enterStart, enterEnd, exitStart, exitEnd], 
    [0, 1, 1, isLast ? 1 : 0]
  );
  
  const z = useTransform(
    progress, 
    [enterStart, enterEnd, exitStart, exitEnd], 
    [-400, 0, 0, isLast ? 0 : -400]
  );

  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-white/0 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl flex flex-col justify-center gap-6 shadow-2xl"
      style={{
        rotateY,
        x,
        z,
        opacity,
        transformOrigin: "center center",
        transformStyle: "preserve-3d"
      }}
    >
      <div className="absolute top-8 right-8 flex gap-4 items-center">
        <StatusBadge status={app.status} />
        {app.isPublic && (
          <ExternalLink className="w-5 h-5 text-ink-400" />
        )}
      </div>
      
      <div className="max-w-3xl">
        <h3 className="text-5xl md:text-7xl font-display font-bold text-ink-100 mb-6 tracking-tight">
          {app.name}
        </h3>
        <p className="text-xl md:text-2xl text-ink-400 font-sans leading-relaxed">
          {app.description}
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <Link 
          href={`/apps/${app.slug}`}
          className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 hover:bg-accent-cyan hover:text-bg-void transition-all font-mono uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(79,216,232,0.2)] hover:shadow-[0_0_30px_rgba(79,216,232,0.4)]"
        >
          [ VIEW_DASHBOARD ]
        </Link>
      </div>
      
      {/* Decorative tech accent lines */}
      <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
      <div className="absolute top-12 bottom-12 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}
