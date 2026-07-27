"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeritageSection() {
  return (
    <section id="contact" className="py-24 px-4 md:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Gold radial glow in background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle at 50% 60%, var(--accent-gold) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-12">
        {/* Logos row */}
        <motion.div
          className="flex flex-col items-center gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* LGU Seal */}
          <div className="relative w-36 h-36 md:w-44 md:h-44">
            <Image
              src="/images/lguseal.png"
              alt="LGU Seal"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(232,196,104,0.4)]"
            />
          </div>

          {/* I Heart Lantapan */}
          <div className="relative w-56 h-20 md:w-72 md:h-28">
            <Image
              src="/images/iheartslantapan-tungkaymadagway_logo.png"
              alt="I Heart Lantapan"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Contact */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xs font-mono text-ink-400 uppercase tracking-widest">Get in Touch</p>
          <a
            href="mailto:lictd@lantapan.gov.ph"
            className="text-xl md:text-3xl font-display font-bold text-accent-cyan hover:text-white transition-colors duration-300 drop-shadow-[0_0_15px_rgba(79,216,232,0.4)]"
          >
            lictd@lantapan.gov.ph
          </a>
        </motion.div>

        {/* Footer note */}
        <p className="text-xs text-ink-400/40 font-mono mt-8">
          © {new Date().getFullYear()} Lantapan ICT Division. All rights reserved.
        </p>
      </div>
    </section>
  );
}
