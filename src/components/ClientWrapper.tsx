"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { Terminal } from "lucide-react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // 1. Cinematic Loading Timer
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 4) + 1;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 600); // smooth fade out
      }
      setProgress(currentProgress);
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // 2. Init Lenis Smooth Scroll (Disabled while loading)
  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [loading]);

  // 3. Track Mouse Position for Spotlight card glows only
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glowElements = document.querySelectorAll(".hover-glow");
      glowElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elX = e.clientX - rect.left;
        const elY = e.clientY - rect.top;
        (el as HTMLElement).style.setProperty("--x", `${elX}px`);
        (el as HTMLElement).style.setProperty("--y", `${elY}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* 4. Cinematic Loading Screen Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-void z-[9999] flex flex-col items-center justify-center font-sans select-none pointer-events-auto">
          {/* Constellation background light */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-radial from-electric-iris/20 to-transparent blur-3xl animate-pulse" />
          
          <div className="flex flex-col items-center gap-8 relative z-10">
            {/* Spinning blueprint frame */}
            <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-electric-iris to-ember-pulse flex items-center justify-center relative animate-pulse">
              <Terminal className="w-10 h-10 text-white animate-pulse" />
              <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-xl animate-spin [animation-duration:15s]" />
            </div>

            <div className="text-center">
              <h2 className="font-display text-lg font-bold text-white tracking-widest uppercase">
                Project Factory
              </h2>
              <p className="text-[10px] text-smoke font-mono tracking-wider mt-1 uppercase">
                Assembling Systems...
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex flex-col items-center gap-2 w-48 mt-4">
              <span className="font-display text-4xl font-extrabold text-white tracking-tighter">
                {progress}%
              </span>
              <div className="w-full h-[2px] bg-slate-edge/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-electric-iris to-ember-pulse transition-all duration-100" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Noise Overlay */}
      <div className="noise-overlay" />

      {children}
    </>
  );
}
