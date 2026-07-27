"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
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

export default function TeamSection({ progress }: { progress: MotionValue<number> }) {
  // Stage 3: 0.55 to 0.75
  const stageStart = 0.55;
  const enterEnd = 0.65; // animating in
  
  const exitStart = 0.75;
  const exitEnd = 0.85;

  // Animate all 3 cards in simultaneously
  const opacity = useTransform(progress, [stageStart, enterEnd, exitStart, exitEnd], [0, 1, 1, 0]);
  const y = useTransform(progress, [stageStart, enterEnd, exitStart, exitEnd], ["40px", "0px", "0px", "-40px"]);
  const scale = useTransform(progress, [stageStart, enterEnd, exitStart, exitEnd], [0.9, 1, 1, 0.9]);
  
  return (
    <div className="fixed left-0 top-0 w-full h-screen flex items-center justify-center pointer-events-none z-50 px-6 md:px-12">
      <motion.div 
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 pt-[10vh] pointer-events-auto"
        style={{ opacity, y, scale }}
      >
        {team.map((member) => (
          <div 
            key={member.name}
            className="relative flex flex-col justify-end border border-white/10 rounded-3xl overflow-hidden group shadow-2xl h-[400px] md:h-[500px]"
          >
            {/* Background Image */}
            <Image 
              src={member.image}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-[#060B18]/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Cyberpunk Glow Overlay */}
            <div className="absolute inset-0 bg-accent-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay pointer-events-none" />
            
            {/* Info */}
            <div className="relative z-10 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-3xl font-display font-bold text-ink-100 mb-2 drop-shadow-md">
                {member.name}
              </h3>
              <p className="text-sm text-accent-cyan font-mono tracking-widest uppercase font-bold drop-shadow-md">
                {member.role}
              </p>
            </div>
            
            {/* Decorative bottom border line that expands on hover */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent-cyan group-hover:w-full transition-all duration-700 ease-out" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
