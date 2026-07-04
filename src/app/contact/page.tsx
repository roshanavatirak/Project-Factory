"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Send, CheckCircle2, ChevronRight, Calculator, RefreshCw, Mail, Phone, Link2 } from "lucide-react";
import confetti from "canvas-confetti";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { submitInquiryAction } from "@/app/actions/inquiry";

function ContactWizard() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("project") || "";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    domain: "agentic",
    complexity: "standard",
    name: "",
    email: "",
    org: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(599);

  // Pre-fill fields if project query exists
  useEffect(() => {
    if (initialProjectId === "nexus-swarm") {
      setFormData((prev) => ({ ...prev, domain: "agentic", complexity: "standard" }));
    } else if (initialProjectId === "novapay-wallet") {
      setFormData((prev) => ({ ...prev, domain: "blockchain", complexity: "enterprise" }));
    } else if (initialProjectId === "omniscribe-medical") {
      setFormData((prev) => ({ ...prev, domain: "ai-ml", complexity: "standard" }));
    } else if (initialProjectId === "vortex-threat") {
      setFormData((prev) => ({ ...prev, domain: "security", complexity: "enterprise" }));
    } else if (initialProjectId === "sentinel-iot") {
      setFormData((prev) => ({ ...prev, domain: "iot", complexity: "basic" }));
    }
  }, [initialProjectId]);

  // Recalculate price estimation dynamically
  useEffect(() => {
    let base = 399;
    
    // Domain multipliers
    if (formData.domain === "agentic") base += 200;
    if (formData.domain === "blockchain") base += 300;
    if (formData.domain === "ai-ml") base += 150;
    if (formData.domain === "security") base += 250;
    if (formData.domain === "iot") base += 100;

    // Complexity multipliers
    if (formData.complexity === "standard") base += 150;
    if (formData.complexity === "enterprise") base += 400;

    setEstimatedPrice(base);
  }, [formData.domain, formData.complexity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 2 && (!formData.name || !formData.email)) {
      alert("Name and Email are required to proceed.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitInquiryAction({
        name: formData.name,
        email: formData.email,
        org: formData.org,
        notes: formData.notes,
        domain: formData.domain,
        complexity: formData.complexity,
        estimatedPrice: estimatedPrice,
      });

      if (!result.success) {
        alert(result.error || "An error occurred submitting your inquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitted(true);
      
      // Trigger dynamic confetti effect
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#5683da", "#ff8964", "#ffffff"],
      });
    } catch (err) {
      console.error(err);
      alert("A system error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 relative z-10 pb-20">
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white text-center mb-2">
        Get In Touch
      </h1>
      <p className="font-sans text-smoke text-sm text-center mb-12 max-w-md mx-auto">
        Scope your engineering requirements or reach out to our leadership directly via communication channels.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* Left Column: Direct Info Card */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <Card glowColor="ember" className="p-6 flex flex-col gap-6 font-sans">
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-tight">
                Direct Channels
              </h3>
              <p className="text-xs text-smoke leading-relaxed mt-2">
                Have specific design blueprints or custom enterprise proposals? Contact directly:
              </p>
            </div>
            
            <div className="flex flex-col gap-5 text-xs">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-electric-iris/10 border border-electric-iris/20 flex items-center justify-center text-electric-iris shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] font-bold text-electric-iris uppercase tracking-widest">Email</span>
                  <a 
                    href="mailto:roshanawatirak@gmail.com" 
                    className="text-white hover:text-electric-iris font-semibold transition-colors truncate"
                  >
                    roshanawatirak@gmail.com
                  </a>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-electric-iris/10 border border-electric-iris/20 flex items-center justify-center text-electric-iris shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-electric-iris uppercase tracking-widest">Phone</span>
                  <a 
                    href="tel:+917972883376" 
                    className="text-white hover:text-electric-iris font-semibold transition-colors"
                  >
                    +91 7972883376
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-electric-iris/10 border border-electric-iris/20 flex items-center justify-center text-electric-iris shrink-0">
                  <Link2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-electric-iris uppercase tracking-widest">LinkedIn</span>
                  <a 
                    href="https://www.linkedin.com/in/roshan-avatirak/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-electric-iris font-semibold transition-colors flex items-center gap-1"
                  >
                    roshan-avatirak <span className="text-[9px] text-smoke">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Scoper Wizard */}
        <div className="lg:col-span-8 w-full">
          <Card glowColor="iris" className="p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
                {/* Step indicator header */}
                <div className="flex items-center justify-between border-b border-slate-edge/20 pb-4 text-xs font-semibold uppercase tracking-wider text-smoke">
                  <span>Step {step} of 3</span>
                  <span>{step === 1 ? "Domain & Complexity" : step === 2 ? "Client Profile" : "Summary & Quote"}</span>
                </div>

                {/* STEP 1: Specs scoping */}
                {step === 1 && (
                  <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white">Target Project Domain</label>
                      <select
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris"
                      >
                        <option value="agentic">Agentic AI & Multi-Agent Swarms</option>
                        <option value="web">Full-Stack Web Architectures</option>
                        <option value="ai-ml">Machine / Deep Learning & NLP</option>
                        <option value="blockchain">Blockchain ERC-4337 Smart Wallets</option>
                        <option value="security">Cybersecurity Threat Parsers</option>
                        <option value="iot">IoT Nodes & mqtt Grid Controllers</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white">Project Complexity Level</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { key: "basic", label: "Basic Academic", desc: "Clean capstone template" },
                          { key: "standard", label: "Standard SaaS", desc: "Complete dashboard suite" },
                          { key: "enterprise", label: "Enterprise / MVP", desc: "Production grade pipelines" },
                        ].map((comp) => (
                          <button
                            key={comp.key}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, complexity: comp.key }))}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                              formData.complexity === comp.key
                                ? "bg-electric-iris/10 border-electric-iris"
                                : "bg-void/40 border-slate-edge/30 hover:border-slate-edge/60"
                            }`}
                          >
                            <span className="text-xs font-bold text-white">{comp.label}</span>
                            <span className="text-[10px] text-smoke leading-snug">{comp.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="mt-4 flex items-center justify-center gap-1.5 py-3 rounded-full bg-white hover:bg-white/95 text-sm font-semibold text-void transition-all cursor-pointer"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STEP 2: Profile inputs */}
                {step === 2 && (
                  <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-white">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Alex Johnson"
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-white">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g., alex@university.edu"
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white">University / Startup Organization</label>
                      <input
                        type="text"
                        name="org"
                        value={formData.org}
                        onChange={handleInputChange}
                        placeholder="e.g., Stanford University / Stealth AI"
                        className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white">Custom Requests & Context Details</label>
                      <textarea
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Specify customized integrations, deployment architectures, or additional API features needed..."
                        className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-3 rounded-full border border-slate-edge/30 hover:bg-charcoal-card text-sm font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="py-3 rounded-full bg-white hover:bg-white/95 text-sm font-semibold text-void transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        Next Step <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Summary & submit */}
                {step === 3 && (
                  <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                    <div className="rounded-xl p-4 bg-void border border-slate-edge/20 flex items-center gap-4">
                      <Calculator className="w-10 h-10 text-electric-iris shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-smoke tracking-wider">Dynamic Cost Estimate</span>
                        <h3 className="text-2xl font-bold font-display tracking-tight text-white mt-0.5">
                          ${estimatedPrice} <span className="text-xs text-smoke font-sans font-normal">USD</span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs text-smoke border-t border-slate-edge/20 pt-4">
                      <div className="flex justify-between">
                        <span>Full Name:</span>
                        <strong className="text-white">{formData.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <strong className="text-white">{formData.email}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Domain:</span>
                        <strong className="text-white capitalize">{formData.domain} Framework</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Complexity:</span>
                        <strong className="text-white capitalize">{formData.complexity} Scope</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handlePrevStep}
                        className="py-3 rounded-full border border-slate-edge/30 hover:bg-charcoal-card text-sm font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-3 rounded-full bg-gradient-to-r from-electric-iris to-ember-pulse hover:shadow-[0_0_20px_rgba(86,131,218,0.4)] text-sm font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Scoping...
                          </>
                        ) : (
                          <>
                            Submit Inquiry <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              /* SUCCESS OVERLAY */
              <div className="flex flex-col items-center justify-center text-center py-12 animate-in zoom-in-95 duration-200 gap-6">
                <div className="w-16 h-16 rounded-full bg-electric-iris/15 border border-electric-iris flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-electric-iris" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-white uppercase tracking-wider">Inquiry Scoped!</h2>
                <p className="font-sans text-smoke text-sm max-w-sm leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. We have logged your request under the estimated scope of <strong>${estimatedPrice}</strong>. A dedicated solutions engineer will email you at <strong>{formData.email}</strong> within 12 hours.
                </p>
                
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFormData({
                      domain: "agentic",
                      complexity: "standard",
                      name: "",
                      email: "",
                      org: "",
                      notes: "",
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full border border-slate-edge/30 hover:bg-charcoal-card text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Scope Another Project
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ContactWizardPage() {
  return (
    <div className="relative min-h-screen py-16">
      <div className="grid-background" />
      <div className="aurora-beam" />
      
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-t-electric-iris border-slate-edge rounded-full animate-spin" />
        </div>
      }>
        <ContactWizard />
      </Suspense>
    </div>
  );
}
