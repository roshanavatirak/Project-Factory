import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "white" | "glow";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-snow/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-tight";

  const variants = {
    primary:
      "bg-electric-iris text-white hover:bg-electric-iris/95 hover:shadow-[0_0_20px_rgba(86,131,218,0.4)] px-6 py-3 rounded-full text-sm",
    ghost:
      "bg-transparent border border-slate-edge/60 text-white hover:bg-white hover:text-void px-5 py-2.5 rounded-full text-sm",
    white:
      "bg-white text-void hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] px-6 py-3 rounded-full text-sm font-semibold",
    glow:
      "relative p-[1px] rounded-full overflow-hidden group bg-gradient-to-r from-electric-iris to-ember-pulse hover:shadow-[0_0_20px_rgba(255,137,100,0.3)]",
  };

  const glowInnerStyles =
    "bg-void rounded-full px-5 py-2.5 text-sm text-white group-hover:bg-void/80 transition-all duration-300 w-full h-full flex items-center justify-center";

  if (href) {
    if (variant === "glow") {
      return (
        <Link href={href} className={`${variants.glow} ${className}`}>
          <span className={glowInnerStyles}>{children}</span>
        </Link>
      );
    }
    return (
      <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  if (variant === "glow") {
    return (
      <button className={`${variants.glow} ${className}`} {...props}>
        <span className={glowInnerStyles}>{children}</span>
      </button>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
