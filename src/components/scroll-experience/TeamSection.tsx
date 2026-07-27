"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  {
    name: "Atty. Aina",
    role: "Municipal Administrator",
    image: "/images/team_atty.png",
  },
  {
    name: "Legargie",
    role: "Fullstack Developer",
    image: "/images/team_legargie.png",
  },
  {
    name: "Neil",
    role: "Fullstack Developer",
    image: "/images/team_neil.png",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-4 md:px-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono text-accent-cyan uppercase tracking-widest mb-2">/ The Team</p>

        </motion.div>

        {/* Team cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="relative flex flex-col justify-end border border-white/10 rounded-3xl overflow-hidden group shadow-2xl h-[400px] md:h-[480px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Background Image */}
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-[#060B18]/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Cyan glow overlay on hover */}
              <div className="absolute inset-0 bg-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none" />

              {/* Info */}
              <div className="relative z-10 p-8 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-display font-bold text-ink-100 mb-1 drop-shadow-md">
                  {member.name}
                </h3>
                <p className="text-xs text-accent-cyan font-mono tracking-widest uppercase font-bold drop-shadow-md">
                  {member.role}
                </p>
              </div>

              {/* Expanding bottom border on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-cyan group-hover:w-full transition-all duration-700 ease-out" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
