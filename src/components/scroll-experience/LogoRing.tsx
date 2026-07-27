"use client";

import { motion, useTransform, useTime, MotionValue } from "framer-motion";
import Image from "next/image";

export default function LogoRing({ progress }: { progress: MotionValue<number> }) {
  const time = useTime();
  
  // 360deg / 40s = 9deg / s = 0.009deg / ms
  const idleRotation = useTransform(time, (t) => t * 0.009);
  
  // scroll coupled rotation in stage 1 (0.05 to 0.20)
  const scrollRotation = useTransform(progress, [0.05, 0.2], [0, 900]);
  
  // Combine them using a useTransform on both
  const totalRingRotation = useTransform(
    () => idleRotation.get() + scrollRotation.get()
  );

  // Group Transform based on global scroll progress
  const scale = useTransform(progress, [0.05, 0.2], [1, 0.35]);
  const y = useTransform(progress, [0.05, 0.2], ["0vh", "-42vh"]);
  const z = useTransform(progress, [0.05, 0.125, 0.2], [0, -200, 0]);

  return (
    // Fixed wrapper to handle absolute center positioning and perspective
    <div 
      className="fixed left-0 top-0 w-full h-screen flex items-center justify-center pointer-events-none z-50"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          scale,
          y,
          z,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Inner Logo (No rotation) */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Image
            src="/images/ictlogo-r-00.png"
            alt="LICTD Inner Logo"
            width={240}
            height={240}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* Outer Ring (Rotates) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ rotate: totalRingRotation }}
        >
          <Image
            src="/images/ictlogo-r-01.png"
            alt="LICTD Outer Ring"
            width={400}
            height={400}
            className="object-contain opacity-90 mix-blend-screen"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
