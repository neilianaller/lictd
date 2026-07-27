"use client";

import { motion, useTime, useTransform } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const time = useTime();
  const rotate = useTransform(time, (t) => t * 0.009);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-void-gradient pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(79,216,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(79,216,232,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo */}
      <motion.div
        className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Inner logo — never rotates */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Image
            src="/images/ictlogo-r-00.png"
            alt="LICTD Inner Logo"
            width={230}
            height={230}
            className="object-contain drop-shadow-[0_0_30px_rgba(79,216,232,0.25)]"
            priority
          />
        </div>
        {/* Outer ring — continuous idle rotation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ rotate }}
        >
          <Image
            src="/images/ictlogo-r-01.png"
            alt="LICTD Ring"
            width={380}
            height={380}
            className="object-contain opacity-90 mix-blend-screen"
            priority
          />
        </motion.div>
      </motion.div>


      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2 text-ink-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-accent-cyan/60 to-transparent"
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
