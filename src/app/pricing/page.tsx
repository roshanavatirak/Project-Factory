"use client";

import React, { useState, useEffect } from "react";
import { Check, Star, Sparkles, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/Toast";
import { getPackagesAction } from "@/app/actions/inquiry";

import Loader from "@/components/ui/Loader";

export default function PricingPage() {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<any[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);

  const isPromoActive = true;

  useEffect(() => {
    async function loadTiers() {
      try {
        const res = await getPackagesAction();
        if (res.success && res.packages) {
          setTiers(res.packages);
        } else {
          toast(res.error || "Failed to load pricing packages.", "error");
        }
      } catch (err) {
        console.error("Pricing load error:", err);
        toast("An error occurred loading prices.", "error");
      } finally {
        setLoadingTiers(false);
      }
    }
    loadTiers();
  }, [toast]);

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


        {/* Grid cards */}
        {loadingTiers ? (
          <Loader text="Loading live pricing package catalogs..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => {
              const currentPrice = isPromoActive ? tier.promoPrice : tier.standardPrice;
              const totalSaved = tier.originalPrice - currentPrice;
              const href = `/contact?package=${tier.key}`;
              
              return (
                <Card
                  key={idx}
                  glowColor={tier.glow as any}
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
                    <p className="text-smoke text-xs leading-relaxed min-h-[40px]">{tier.description}</p>
                    
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
                    {tier.features.map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-electric-iris shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={tier.popular ? "primary" : "ghost"}
                    href={href}
                    className="w-full justify-center cursor-pointer"
                  >
                    {tier.cta}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
