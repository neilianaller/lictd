"use client";

import { MotionValue } from "framer-motion";
import AppCard from "./AppCard";
import apps from "@/data/apps.json";

export default function AppCardDeal({ progress }: { progress: MotionValue<number> }) {
  return (
    <div 
      className="fixed left-0 top-0 w-full h-screen flex items-center justify-center pointer-events-none z-40 px-6 md:px-12"
      style={{ perspective: "1500px" }}
    >
      <div className="relative w-full max-w-6xl h-[60vh] md:h-[70vh] mt-[10vh] pointer-events-auto">
        {apps.map((app, index) => (
          <AppCard 
            key={app.id} 
            app={app as any} 
            progress={progress} 
            index={index} 
            total={apps.length} 
          />
        ))}
      </div>
    </div>
  );
}
