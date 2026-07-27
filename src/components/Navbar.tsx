"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTime } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const { scrollY } = useScroll();
  // Fully visible after 80px of scroll
  const opacity = useTransform(scrollY, [60, 120], [0, 1]);
  const ringRotate = useTime();
  const rotate = useTransform(ringRotate, (t) => t * 0.009);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 h-16"
      style={{ opacity }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-[#060B18]/80 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" />

      {/* Logo lockup */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Mini ring logo */}
        <div className="relative w-10 h-10">
          {/* Inner */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Image
              src="/images/ictlogo-r-00.png"
              alt="LICTD"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          {/* Outer ring — rotating */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ rotate }}
          >
            <Image
              src="/images/ictlogo-r-01.png"
              alt=""
              width={40}
              height={40}
              className="object-contain opacity-80"
            />
          </motion.div>
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-display font-bold text-ink-100 tracking-wide">
            LICTD Systems Hub
          </span>
          <span className="text-[10px] font-mono text-ink-400 tracking-widest uppercase">
            Lantapan ICT Division
          </span>
        </div>
      </div>

      {/* Nav links */}
      <div className="relative z-10 hidden md:flex items-center gap-8">
        {["Systems", "Team", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-xs font-mono text-ink-400 hover:text-accent-cyan transition-colors uppercase tracking-widest"
          >
            {item}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
