"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import Lenis from "lenis";
import LogoRing from "./LogoRing";
import AppDashboard from "./AppDashboard";
import TeamSection from "./TeamSection";
import HeritageSection from "./HeritageSection";

export default function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // The container will be 500vh tall to create the scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Setup Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08, // Smoothness
      wheelMultiplier: 0.4, // Low scroll sensitivity
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "800vh" }}>
      {/* Fixed Background Gradient */}
      <div className="fixed inset-0 bg-void-gradient -z-10" />

      {/* Stage 0 & 1: Logo Intro & Dock */}
      <LogoRing progress={scrollYProgress} />
      
      {/* Stage 2: App Dashboard Table */}
      <AppDashboard progress={scrollYProgress} />

      {/* Stage 3: Team Section */}
      <TeamSection progress={scrollYProgress} />

      {/* Stage 4: Seal & Heritage */}
      <HeritageSection progress={scrollYProgress} />
    </div>
  );
}
