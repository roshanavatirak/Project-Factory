"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LoaderProps {
  text?: string;
  size?: number;
}

export default function Loader({ text, size = 180 }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/935243cd-53dd-4d65-90c9-33e555ae3bdf/cf4K2Yo1Xf.json"
          loop
          autoplay
          className="w-full h-full object-contain"
        />
      </div>
      {text && (
        <span className="text-smoke font-sans text-xs font-semibold animate-pulse tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
}
