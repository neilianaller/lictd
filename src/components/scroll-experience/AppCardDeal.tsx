"use client";

import { MotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useState } from "react";
import AppCard from "./AppCard";
import apps from "@/data/apps.json";

export default function AppCardDeal({ progress }: { progress: MotionValue<number> }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Derive which card is currently visible from scroll progress
  const derivedIndex = useTransform(progress, (p) => {
    const stageStart = 0.2;
    const stageEnd = 0.55;
    if (p < stageStart || p >= stageEnd) return -1;
    const step = (stageEnd - stageStart) / apps.length;
    const idx = Math.floor((p - stageStart) / step);
    return Math.min(idx, apps.length - 1);
  });

  useMotionValueEvent(derivedIndex, "change", (v) => setActiveIndex(v));

  return (
    <div
      className="fixed left-0 top-0 w-full h-screen flex items-center justify-center pointer-events-none z-40 px-6 md:px-12"
      style={{ perspective: "1500px" }}
    >
      <div className="relative w-full max-w-6xl h-[60vh] md:h-[70vh] mt-[10vh]">
        {apps.map((app, index) => (
          <AppCard
            key={app.id}
            app={app as any}
            progress={progress}
            index={index}
            total={apps.length}
            isActive={activeIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
