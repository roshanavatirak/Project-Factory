"use client";

import React, { useRef, useState } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "iris" | "ember" | "none";
  tilt?: boolean;
}

export default function Card({
  children,
  className = "",
  glowColor = "none",
  tilt = true,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Position within the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation angles (max 6 degrees to keep it elegant and subtle)
    const rx = ((centerY - y) / centerY) * 6;
    const ry = ((x - centerX) / centerX) * 6;
    
    setRotateX(rx);
    setRotateY(ry);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const glowStyles = {
    none: "",
    iris: "before:absolute before:top-0 before:right-0 before:w-32 before:height-32 before:bg-radial before:from-electric-iris/25 before:to-transparent before:pointer-events-none before:z-0",
    ember: "before:absolute before:top-0 before:right-0 before:w-32 before:height-32 before:bg-radial before:from-ember-pulse/25 before:to-transparent before:pointer-events-none before:z-0",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden glass-card p-6 bg-charcoal-card/90 border border-slate-edge/30 transition-transform duration-200 ease-out hover-glow ${glowStyles[glowColor]} ${className}`}
      style={{
        transform: tilt
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`
          : "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic 3D depth wrapper */}
      <div style={{ transform: tilt ? "translateZ(10px)" : "none" }} className="relative z-10">
        {children}
      </div>
    </div>
  );
}
