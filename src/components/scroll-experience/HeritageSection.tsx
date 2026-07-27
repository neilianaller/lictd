"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";

export default function HeritageSection({ progress }: { progress: MotionValue<number> }) {
  // Stage 4: 0.75 to 1.0 
  // Logos animate between 0.75 and 0.85
  const stageStart = 0.75;
  const stageEnd = 0.85;

  // Email animates between 0.85 and 0.95
  const emailStart = 0.85;
  const emailEnd = 0.95;

  const opacity = useTransform(progress, [stageStart, stageEnd], [0, 1]);
  const y = useTransform(progress, [stageStart, stageEnd], ["40px", "0px"]);
  const scale = useTransform(progress, [stageStart, stageEnd], [0.95, 1]);

  const emailOpacity = useTransform(progress, [emailStart, emailEnd], [0, 1]);
  const emailY = useTransform(progress, [emailStart, emailEnd], ["20px", "0px"]);

  // Gold background opacity shift (subtle)
  const bgOpacity = useTransform(progress, [stageStart, stageEnd], [0, 0.15]);

  return (
    <>
      {/* Background Gold shift */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-10"
        style={{ 
          opacity: bgOpacity,
          background: "radial-gradient(circle at center, var(--accent-gold) 0%, transparent 60%)" 
        }}
      />
      
      {/* Container */}
      <div className="fixed left-0 top-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-50 px-6">
        
        {/* Logos */}
        <motion.div 
          className="flex flex-col items-center justify-center gap-12"
          style={{ opacity, y, scale }}
        >
          {/* LGU Seal (Above) */}
          <div className="relative w-40 h-40 md:w-56 md:h-56">
            <Image 
              src="/images/lguseal.png"
              alt="LGU Seal"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(232,196,104,0.4)]"
            />
          </div>
          
          {/* I Heart Lantapan Logo (Below) */}
          <div className="relative w-56 h-20 md:w-72 md:h-28">
            <Image 
              src="/images/iheartslantapan-tungkaymadagway_logo.png"
              alt="I Heart Lantapan"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* Contact Email */}
        <motion.div
          className="absolute bottom-16 md:bottom-24 flex flex-col items-center justify-center pointer-events-auto"
          style={{ opacity: emailOpacity, y: emailY }}
        >
          <p className="text-ink-400 font-mono text-sm tracking-widest uppercase mb-3">
            Contact Us
          </p>
          <a 
            href="mailto:lictd@lantapan.gov.ph"
            className="text-xl md:text-3xl font-display font-bold text-accent-cyan hover:text-white transition-colors duration-300 drop-shadow-[0_0_15px_rgba(79,216,232,0.5)]"
          >
            lictd@lantapan.gov.ph
          </a>
        </motion.div>

      </div>
    </>
  );
}
