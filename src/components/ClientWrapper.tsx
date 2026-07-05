"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { Terminal } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
          <div className="absolute w-[400px] h-[400px] rounded-full bg-radial from-electric-iris/15 to-transparent blur-3xl" />
          
          <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-[280px] h-[280px]">
            <DotLottieReact
              src="https://lottie.host/935243cd-53dd-4d65-90c9-33e555ae3bdf/cf4K2Yo1Xf.json"
              loop
              autoplay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Global Noise Overlay */}
      <div className="noise-overlay" />

      {children}
    </>
  );
}
