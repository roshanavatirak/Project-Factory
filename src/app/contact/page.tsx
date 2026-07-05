"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Send, CheckCircle2, ChevronRight, Calculator, RefreshCw, Mail, Phone, Link2 } from "lucide-react";
import confetti from "canvas-confetti";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { submitInquiryAction, getPackagesAction } from "@/app/actions/inquiry";
import { getSessionAction } from "@/app/actions/auth";

function ContactWizard() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("project") || "";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    domain: "ai-ml",
    complexity: "major",
    name: "",
    email: "",
    teamSize: "1",
    teamNames: "",
    teammateMobile: "",
  });

  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(17500);

  // Pre-fill fields if project query exists
  useEffect(() => {
    if (initialProjectId === "nexus-swarm") {
      setFormData((prev) => ({ ...prev, domain: "ai-ml", complexity: "major" }));
    } else if (initialProjectId === "novapay-wallet") {
      setFormData((prev) => ({ ...prev, domain: "blockchain", complexity: "research" }));
    } else if (initialProjectId === "omniscribe-medical") {
      setFormData((prev) => ({ ...prev, domain: "nlp", complexity: "major" }));
    } else if (initialProjectId === "vortex-threat") {
      setFormData((prev) => ({ ...prev, domain: "security", complexity: "research" }));
    } else if (initialProjectId === "sentinel-iot") {
      setFormData((prev) => ({ ...prev, domain: "iot", complexity: "minor" }));
    }
  }, [initialProjectId]);

  // Pre-select package from URL parameter if redirected from Pricing
  useEffect(() => {
    const pkgParam = searchParams.get("package");
    if (pkgParam) {
      setFormData((prev) => ({
        ...prev,
        complexity: pkgParam,
      }));
    }
  }, [searchParams]);

  // Load logged-in user details & pricing packages from database
  useEffect(() => {
    async function loadSessionAndPackages() {
      try {
        const sessionRes = await getSessionAction();
        if (sessionRes.success && sessionRes.user) {
          setFormData((prev) => ({
            ...prev,
            name: prev.name || sessionRes.user.name || "",
            email: prev.email || sessionRes.user.email || "",
            teammateMobile: prev.teammateMobile || sessionRes.user.phone || "",
          }));
        }
      } catch (err) {
        console.error("Session load error in Contact:", err);
      }

      try {
        const pkgRes = await getPackagesAction();
        if (pkgRes.success && pkgRes.packages) {
          setDbPackages(pkgRes.packages);
        }
      } catch (err) {
        console.error("Packages load error in Contact:", err);
      }
    }
    loadSessionAndPackages();
  }, []);

  // Recalculate price estimation dynamically
  useEffect(() => {
    // Find matching base package price from loaded database data
    const matchedPkg = dbPackages.find((p) => p.key === formData.complexity);
    let base = matchedPkg ? matchedPkg.standardPrice : (
      formData.complexity === "minor" ? 12000 :
      formData.complexity === "major" ? 15000 : 18000
    );
    
    // Domain multipliers (INR)
    if (formData.domain === "ai-ml") base += 2500;
    if (formData.domain === "deep-learning") base += 4000;
    if (formData.domain === "nlp") base += 3000;
    if (formData.domain === "data-science") base += 2000;
    if (formData.domain === "cloud") base += 2500;
    if (formData.domain === "blockchain") base += 5000;
    if (formData.domain === "security") base += 4500;
    if (formData.domain === "networks") base += 1500;
    if (formData.domain === "iot") base += 2500;
    if (formData.domain === "games-arvr") base += 3500;
    if (formData.domain === "image-processing") base += 3000;
    if (formData.domain === "software") base += 1000;
    if (formData.domain === "algorithms") base += 1000;
    if (formData.domain === "web-dev") base += 1500;
    if (formData.domain === "app-dev") base += 2500;

    setEstimatedPrice(base);
  }, [formData.domain, formData.complexity, dbPackages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "teamSize") {
      // Reject non-numeric characters (only allow integers)
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 2 && (!formData.name || !formData.email || !formData.teammateMobile)) {
      alert("Name, Email, and Mobile Number are required to proceed.");
      return;
    }
    if (step === 2 && (!formData.teamSize || parseInt(formData.teamSize) < 1)) {
      alert("Team Size must be at least 1.");
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
        org: `Team Size: ${formData.teamSize}`,
        notes: `Teammate Mobile: ${formData.teammateMobile || "N/A"}${formData.teamNames ? ` | Members: ${formData.teamNames}` : ""}`,
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
                        <option value="ai-ml">AI & Machine Learning</option>
                        <option value="deep-learning">Deep Learning & Neural Networks</option>
                        <option value="nlp">Natural Language Processing (NLP)</option>
                        <option value="data-science">Data Science & Analytics (Data/Web Mining)</option>
                        <option value="cloud">Cloud & Grid Computing</option>
                        <option value="blockchain">Blockchain & Web3 Development</option>
                        <option value="security">Cyber-Security, Cryptography & Forensics</option>
                        <option value="networks">Computer Networks & Distributed Systems</option>
                        <option value="iot">Internet of Things (IoT) & Robotics</option>
                        <option value="games-arvr">Game Design, Development & AR/VR</option>
                        <option value="image-processing">Image Processing & Computer Vision</option>
                        <option value="software">Software Engineering & Database Systems</option>
                        <option value="algorithms">Algorithms & Theory</option>
                        <option value="web-dev">Web Development (Full-Stack SaaS)</option>
                        <option value="app-dev">App Development (Android, iOS & Cross-Platform)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white">Project Complexity Level</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { key: "minor", label: "Academic Minor", desc: "Minor capstone code & setup logs" },
                          { key: "major", label: "Academic Major", desc: "Full Major project & synopsis draft" },
                          { key: "research", label: "Academic Research (IEEE)", desc: "IEEE paper base & comparative charts" },
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-white">Mobile Number *</label>
                        <input
                          type="text"
                          name="teammateMobile"
                          required
                          value={formData.teammateMobile}
                          onChange={handleInputChange}
                          placeholder="e.g., +91 7972883376"
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-white">Team Size *</label>
                        <input
                          type="text"
                          name="teamSize"
                          required
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          placeholder="e.g., 3"
                          className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white">Team Member Names (Optional)</label>
                      <input
                        type="text"
                        name="teamNames"
                        value={formData.teamNames}
                        onChange={handleInputChange}
                        placeholder="e.g., Roshan Avatirak, Rahul Gupta"
                        className="bg-void border border-slate-edge/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-electric-iris"
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
                          ₹{estimatedPrice.toLocaleString("en-IN")} <span className="text-xs text-smoke font-sans font-normal">INR</span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs text-smoke border-t border-slate-edge/20 pt-4">
                      <div className="flex justify-between">
                        <span>Full Name:</span>
                        <strong className="text-white">{formData.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Email Address:</span>
                        <strong className="text-white">{formData.email}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Mobile Number:</span>
                        <strong className="text-white">{formData.teammateMobile}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Size:</span>
                        <strong className="text-white">
                          {formData.teamSize === "1" ? "1 Member (Individual)" : `${formData.teamSize} Members`}
                        </strong>
                      </div>
                      {formData.teamNames && (
                        <div className="flex justify-between">
                          <span>Team Members:</span>
                          <strong className="text-white">{formData.teamNames}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Domain:</span>
                        <strong className="text-white">
                          {formData.domain === "ai-ml"
                            ? "AI & Machine Learning"
                            : formData.domain === "deep-learning"
                            ? "Deep Learning & Neural Networks"
                            : formData.domain === "nlp"
                            ? "Natural Language Processing (NLP)"
                            : formData.domain === "data-science"
                            ? "Data Science & Analytics"
                            : formData.domain === "cloud"
                            ? "Cloud Computing"
                            : formData.domain === "blockchain"
                            ? "Blockchain"
                            : formData.domain === "security"
                            ? "Cyber-Security & Cryptography"
                            : formData.domain === "networks"
                            ? "Computer Networks"
                            : formData.domain === "iot"
                            ? "Internet of Things & Robotics"
                            : formData.domain === "games-arvr"
                            ? "Game Design & AR/VR"
                            : formData.domain === "image-processing"
                            ? "Image Processing & Vision"
                            : formData.domain === "software"
                            ? "Software Engineering"
                            : formData.domain === "algorithms"
                            ? "Algorithms & Theory"
                            : formData.domain === "web-dev"
                            ? "Web Development"
                            : formData.domain === "app-dev"
                            ? "App Development"
                            : formData.domain}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Project Level:</span>
                        <strong className="text-white">
                          {formData.complexity === "minor"
                            ? "Academic Minor"
                            : formData.complexity === "major"
                            ? "Academic Major"
                            : "Academic Research (IEEE)"}
                        </strong>
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
                  Thank you, <strong>{formData.name}</strong>. We have logged your request under the estimated scope of <strong>₹{estimatedPrice.toLocaleString("en-IN")}</strong>. A dedicated solutions engineer will email you at <strong>{formData.email}</strong> within 12 hours.
                </p>
                
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFormData({
                      domain: "ai-ml",
                      complexity: "major",
                      name: "",
                      email: "",
                      teamSize: "1",
                      teamNames: "",
                      teammateMobile: "",
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
