"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CertificationsSection() {
  return (
    <section className="py-16 px-4 md:px-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">

        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono text-accent-cyan uppercase tracking-widest mb-2">
            / data privacy
          </p>
        </motion.div>

        {/* Certificates row */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* CORS Seal */}
          <a
            href="https://lantapan.gov.ph/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 hover:opacity-90 transition-opacity"
          >
            <div className="relative w-36 h-36 md:w-44 md:h-44 drop-shadow-[0_0_20px_rgba(79,216,232,0.15)] group-hover:drop-shadow-[0_0_30px_rgba(79,216,232,0.35)] transition-all">
              <Image
                src="/images/CORSseal.png"
                alt="CORS Seal"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-mono text-ink-400 group-hover:text-accent-cyan transition-colors tracking-widest uppercase">
              CORS Seal
            </span>
          </a>

          {/* Registration Certificate */}
          <a
            href="https://lantapan.gov.ph/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 hover:opacity-90 transition-opacity"
          >
            <div className="relative w-36 h-36 md:w-44 md:h-44 drop-shadow-[0_0_20px_rgba(79,216,232,0.15)] group-hover:drop-shadow-[0_0_30px_rgba(79,216,232,0.35)] transition-all">
              <Image
                src="/images/RegistrationCert.png"
                alt="Registration Certificate"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-mono text-ink-400 group-hover:text-accent-cyan transition-colors tracking-widest uppercase">
              Registration Certificate
            </span>
          </a>
        </motion.div>

        {/* Link */}
        <motion.a
          href="https://lantapan.gov.ph/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-mono text-ink-400 hover:text-accent-cyan transition-colors border-b border-ink-400/20 hover:border-accent-cyan/50 pb-0.5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          lantapan.gov.ph/privacy ↗
        </motion.a>

      </div>
    </section>
  );
}
