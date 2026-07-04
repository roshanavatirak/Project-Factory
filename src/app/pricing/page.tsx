"use client";

import React, { useState } from "react";
import { Check, Star, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/Toast";

export default function PricingPage() {
  const { toast } = useToast();
  const [promoInput, setPromoInput] = useState("EARLYBIRD");

  const isPromoActive = promoInput.toUpperCase().trim() === "EARLYBIRD";

  const tiers = [
    {
      name: "Academic Capstone Pack",
      originalPrice: 15000,
      standardPrice: 12000,
      promoPrice: 10000,
      desc: "Perfect for students needing a clean, fully documented boilerplate code template for capstone evaluation.",
      features: [
        "Complete Source Code (Github Repository Access)",
        "Step-by-step Setup instructions README.md",
        "Standard Project Synopsis Template (Word/PDF)",
        "Local SQLite/PostgreSQL Database setup scripts",
        "Standard environment configurations & lockfiles",
        "1-Hour dedicated remote setup & debugging support"
      ],
      popular: false,
      cta: "Acquire Capstone",
      href: "/projects",
      glow: "none" as const
    },
    {
      name: "Advanced SaaS Package",
      originalPrice: 18000,
      standardPrice: 15000,
      promoPrice: 12000,
      desc: "Ideal for comprehensive final year engineering presentations, standard product demos, and viva defense.",
      features: [
        "All Academic Capstone Deliverables",
        "Full Dashboard web app template codebase",
        "Complete Software Requirement Specs (SRS) & UML diagrams",
        "Pre-configured Docker & Docker Compose container files",
        "Project Presentation Slides (PPT) & Video setup guide",
        "External Examiner Viva prep Q&A guide sheet",
        "3-Hours total virtual pairing & deployment support"
      ],
      popular: true,
      cta: "Explore SaaS Packages",
      href: "/projects",
      glow: "iris" as const
    },
    {
      name: "Research & Startup MVP Pack",
      originalPrice: 22000,
      standardPrice: 18000,
      promoPrice: 15000,
      desc: "Designed for highly complex multi-agent swarms, PhD level research implementations, and startup MVP launches.",
      features: [
        "All Advanced SaaS Deliverables",
        "Custom scoped feature builds & AI agent sandbox logic",
        "Vercel, AWS, or GCP production cloud deployment scripts",
        "Comprehensive Project Report & LaTeX research paper draft",
        "Multi-model API routing configurations (Ollama/OpenAI)",
        "Direct WhatsApp/Slack access to Lead Engineer",
        "8-Hours dedicated virtual engineering pairing sessions"
      ],
      popular: false,
      cta: "Initiate MVP Scope",
      href: "/contact",
      glow: "ember" as const
    }
  ];

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase().trim() === "EARLYBIRD") {
      toast("Promo Code 'EARLYBIRD' applied successfully! Extra discounts unlocked.", "success");
    } else if (promoInput.trim() === "") {
      toast("Promo code cleared. Standard pricing active.", "info");
    } else {
      toast("Invalid Promo Code. Try using 'EARLYBIRD'.", "error");
    }
  };

  return (
    <div className="relative min-h-screen pt-12 pb-32 bg-void">
      <div className="grid-background" />
      <div className="aurora-beam" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <span className="text-xs font-semibold text-ember-pulse uppercase tracking-widest font-sans flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Premium Engineering Packages
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Transparent Pricing
          </h1>
          <p className="font-sans text-smoke text-sm md:text-base leading-relaxed mt-1">
            Acquire pre-configured software setups or consult with senior architects to custom design advanced agentic workflows and MVP backends.
          </p>
        </div>

        {/* Promo Code Input Block */}
        <div className="max-w-md mx-auto mb-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Card glowColor="iris" className="p-4 bg-charcoal-card/45 backdrop-blur-md border-slate-edge/20 flex flex-col gap-3 font-sans text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Have a Promo Code?</span>
              {isPromoActive ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  EARLYBIRD Active
                </span>
              ) : (
                <span className="text-smoke text-[10px]">Enter EARLYBIRD for 20% off</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. EARLYBIRD)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-grow bg-void border border-slate-edge/30 rounded-lg px-4 py-2.5 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-electric-iris font-mono"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-5 py-2.5 rounded-lg bg-electric-iris hover:bg-electric-iris/85 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
              >
                Apply
              </button>
            </div>
          </Card>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => {
            const currentPrice = isPromoActive ? tier.promoPrice : tier.standardPrice;
            const totalSaved = tier.originalPrice - currentPrice;
            
            return (
              <Card
                key={idx}
                glowColor={tier.glow}
                className={`flex flex-col h-full relative ${
                  tier.popular ? "border-electric-iris/50 bg-charcoal-card/85" : ""
                }`}
              >
                {tier.popular && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-electric-iris/20 border border-electric-iris text-[10px] font-bold uppercase tracking-wider text-white">
                    <Star className="w-3 h-3 fill-white" /> Popular
                  </span>
                )}

                <div className="mb-6 font-sans text-left">
                  <h3 className="font-display text-lg font-bold text-white tracking-wide mb-2">{tier.name}</h3>
                  <p className="text-smoke text-xs leading-relaxed min-h-[40px]">{tier.desc}</p>
                  
                  {/* Prices & Slashes */}
                  <div className="flex flex-col mt-6">
                    <div className="flex items-center gap-2 mb-2 font-mono text-sm font-semibold uppercase tracking-wider flex-wrap">
                      <span className="line-through text-white/40">₹{tier.originalPrice.toLocaleString("en-IN")}</span>
                      <span className="text-smoke/40">&rarr;</span>
                      <span className="text-ember-pulse bg-ember-pulse/10 border border-ember-pulse/20 px-2.5 py-0.5 rounded text-xs font-bold shrink-0">
                        Standard: ₹{tier.standardPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-5xl font-display font-extrabold text-white tracking-tight">
                        ₹{currentPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-smoke font-sans">/ fixed</span>
                    </div>

                    {isPromoActive && (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold mt-2.5 flex items-center gap-1 animate-pulse">
                        🔥 Extra Early Bird applied! Saved ₹{totalSaved.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-grow flex flex-col gap-4 font-sans text-xs text-smoke mb-8 border-t border-slate-edge/20 pt-6 text-left">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-electric-iris shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={tier.popular ? "primary" : "ghost"}
                  href={tier.href}
                  className="w-full justify-center cursor-pointer"
                >
                  {tier.cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
