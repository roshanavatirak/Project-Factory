"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight, Cpu, Code2, Shield, Smartphone,
  Database, Network, Zap, Sparkles, Compass,
  CheckCircle2, Terminal, ShieldCheck, FileCheck, Layers
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { projectsData } from "@/data/projects";
import { TechLogoList } from "@/components/TechLogos";

// Dynamic import of R3F interactive universe Canvas
const ThreeScene = dynamic(() => import("@/components/ThreeScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full -z-10 bg-void flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-t-electric-iris border-slate-edge rounded-full animate-spin" />
    </div>
  ),
});



export default function Home() {
  const [activeStep, setActiveStep] = useState(0);



  // Statistics counters
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [techCount, setTechCount] = useState(0);
  const [domainCount, setDomainCount] = useState(0);

  useEffect(() => {
    const deliveredTimer = setInterval(() => {
      setDeliveredCount((prev) => {
        if (prev >= 1000) {
          clearInterval(deliveredTimer);
          return 1000;
        }
        return prev + 25;
      });
    }, 30);

    const techTimer = setInterval(() => {
      setTechCount((prev) => {
        if (prev >= 50) {
          clearInterval(techTimer);
          return 50;
        }
        return prev + 1;
      });
    }, 40);

    const domainTimer = setInterval(() => {
      setDomainCount((prev) => {
        if (prev >= 30) {
          clearInterval(domainTimer);
          return 30;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(deliveredTimer);
      clearInterval(techTimer);
      clearInterval(domainTimer);
    };
  }, []);

  const domainsList = [
    { name: "Agentic AI", icon: Cpu, desc: "Autonomous agentic loops and task routing mesh.", glow: "iris" as const },
    { name: "AI Agents", icon: Zap, desc: "LangGraph nodes, tool servers, and automated swarms.", glow: "ember" as const },
    { name: "Full Stack", icon: Code2, desc: "Next.js SaaS engines and postgres data streams.", glow: "iris" as const },
    { name: "Machine Learning", icon: Network, desc: "Conveyor scans, computer vision, and tensor networks.", glow: "ember" as const },
    { name: "Deep Learning", icon: Cpu, desc: "Neural networks model training and customization guides.", glow: "iris" as const },
    { name: "Blockchain", icon: Shield, desc: "Account abstraction smart wallets and web3 bridges.", glow: "ember" as const },
    { name: "Cyber Security", icon: ShieldCheck, desc: "eBPF packet sniffers and firewall rule hooks.", glow: "iris" as const },
    { name: "IoT Nodes", icon: Database, desc: "MQTT pub/sub streams and timeseries telemetry grids.", glow: "ember" as const },
  ];

  const techIcons = [
    "Solidity", "Node.js", "TensorFlow", "PyTorch", "Docker", "Kubernetes", "PostgreSQL",
    "React", "Next.js", "Python", "TypeScript", "FastAPI", "Go", "MongoDB", "AWS", "Gemini"
  ];

  // Horizontal Storytelling details with Huly deliverables arrays
  const workflowSteps = [
    {
      num: "01",
      title: "Scoping & Idea Consultation",
      desc: "Consult with senior software architects to map requirements, pick library specifications, and design data flow paths.",
      icon: Compass,
      tag: "Idea",
      deliverables: ["Project Specifications Draft", "Architecture Flow Diagrams", "Core Features Checklist"]
    },
    {
      num: "02",
      title: "Architecture Design",
      desc: "We build database models (e.g. Prisma), API schemas, and deployment config files (Docker/YAML) before coding.",
      icon: Layers,
      tag: "Design",
      deliverables: ["Database Prisma Schema", "API Route Spec (JSON)", "Docker Stack Blueprint"]
    },
    {
      num: "03",
      title: "Active Development",
      desc: "Monitor development inside your dashboard, view active commits, and preview branch deployments.",
      icon: Code2,
      tag: "Build",
      deliverables: ["Modular React Components", "Protected API Handlers", "Supabase Session Logic"]
    },
    {
      num: "04",
      title: "Rigorous System Testing",
      desc: "We write automated test suites and debug environment bottlenecks on physical WSL-2/Docker containers.",
      icon: ShieldCheck,
      tag: "Test",
      deliverables: ["TypeScript Strict Validations", "API Integration Tests", "Container Sandbox Diagnostics"]
    },
    {
      num: "05",
      title: "Telemetry & Deployment",
      desc: "Deploy instantly to Vercel/Docker Compose. We establish monitoring trackers to monitor logs.",
      icon: Terminal,
      tag: "Deploy",
      deliverables: ["Netlify Serverless Config", "Live SMTP verification", "Error Logging Monitors"]
    },
    {
      num: "06",
      title: "Walkthrough Documentation",
      desc: "Receive comprehensive PDFs detailing setup parameters, structure, and 1-on-1 pairing sessions.",
      icon: FileCheck,
      tag: "Handover",
      deliverables: ["Full Setup Guide (PDF)", "Source Code Walkthrough", "Docker Compose Starter Pack"]
    }
  ];

  const featured = projectsData.slice(0, 3);

  return (
    <div className="relative min-h-screen">
      {/* Dynamic 3D constellation universe */}
      <ThreeScene />

      {/* Grid overlay */}
      <div className="grid-background" />

      {/* Aurora Light Beam */}
      <div className="aurora-beam" />

      {/* SECTION 1: Hero */}
      <section className="relative max-w-[1200px] mx-auto px-6 pt-28 pb-32 flex flex-col items-start gap-12 z-10 min-h-[95vh] justify-center">
        {/* Subtitle tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-electric-iris/10 border border-electric-iris/25 text-xs font-semibold text-electric-iris tracking-wider uppercase animate-fade-in font-sans">
          <Sparkles className="w-3.5 h-3.5 text-ember-pulse" /> Launch Premium Digital Assets
        </div>

        {/* Display Heading */}
        <div className="max-w-5xl flex flex-col gap-5">
          <h1 className="font-display text-5xl md:text-8xl font-extrabold leading-[0.85] tracking-[-0.04em] text-white">
            BUILD THE FUTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-iris via-ember-pulse to-white">
              BEFORE YOU
            </span> <br />
            GRADUATE.
          </h1>
          <p className="font-sans text-base md:text-lg text-smoke max-w-xl mt-4 leading-relaxed">
            Acquire production-grade capstone structures, custom MVP setups, and research frameworks. Engineered with complete setup logs, Docker files, and dashboard metrics.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <Button variant="primary" href="/projects">
            Explore Projects <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="ghost" href="/contact">
            Book Free Consultation
          </Button>
        </div>

        {/* Statistics grid with counter animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-16 w-full border-t border-slate-edge/20">
          <div>
            <h3 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              {deliveredCount}+
            </h3>
            <p className="text-xs text-smoke font-sans tracking-wide uppercase mt-1">Projects Delivered</p>
          </div>
          <div>
            <h3 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              {techCount}+
            </h3>
            <p className="text-xs text-smoke font-sans tracking-wide uppercase mt-1">Tech Frameworks</p>
          </div>
          <div>
            <h3 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              {domainCount}+
            </h3>
            <p className="text-xs text-smoke font-sans tracking-wide uppercase mt-1">Active Domains</p>
          </div>
          <div>
            <h3 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              98%
            </h3>
            <p className="text-xs text-smoke font-sans tracking-wide uppercase mt-1">Client Satisfaction</p>
          </div>
        </div>
      </section>



      {/* SECTION 2: Horizontal Storytelling ("Why Project Factory") - Crisp White background */}
      <section className="bg-white py-32 relative z-10 border-b border-slate-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-semibold text-electric-iris uppercase tracking-widest font-sans">
              Workflow Lifecycle
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mt-2">
              Horizontal Storytelling Scroll
            </h2>
            <p className="text-slate-600 text-sm font-sans leading-relaxed mt-2">
              Every project undergoes six distinct development milestones. Check progress, logs, and setup walkthroughs directly on your dashboard.
            </p>
          </div>

          {/* Stepper buttons - Pill Grid Selector */}
          <div className="relative flex border border-slate-200 bg-slate-50/50 p-1 rounded-full mb-12 overflow-x-auto gap-1 max-w-4xl mx-auto justify-start md:justify-between items-center">
            {workflowSteps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`relative px-5 py-2.5 text-xs font-semibold tracking-wider rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap flex-1 text-center select-none z-10 ${activeStep === idx
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900 border border-transparent"
                  }`}
              >
                <span className="font-mono text-[10px] text-electric-iris mr-1.5">{st.num}</span>
                {st.tag}
              </button>
            ))}
          </div>

          {/* Active step panel display with Slate edge borders and Staggered Deliverables */}
          <div
            key={activeStep}
            className="border border-slate-200/80 rounded-2xl p-8 md:p-12 bg-slate-50/50 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[300px] animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-sm"
          >
            <div className="md:col-span-8 flex flex-col gap-4">
              <span className="font-display text-5xl font-extrabold text-slate-200">
                Step {workflowSteps[activeStep].num}
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                {workflowSteps[activeStep].title}
              </h3>
              <p className="text-slate-600 text-sm font-sans leading-relaxed mt-1">
                {workflowSteps[activeStep].desc}
              </p>

              {/* Dynamic checklist elements - Huly Deliverables */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200/60">
                <span className="text-[10px] uppercase font-bold tracking-widest text-electric-iris font-mono">Deliverables / Artifacts</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  {workflowSteps[activeStep].deliverables.map((del, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white border border-slate-200/70 shadow-sm animate-in fade-in slide-in-from-left duration-300"
                      style={{ animationDelay: `${dIdx * 100}ms` }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-electric-iris shrink-0" />
                      <span className="text-[11px] font-bold text-slate-700 font-sans tracking-wide">{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-electric-iris shadow-[0_4px_24px_rgba(86,131,218,0.08)]">
                {React.createElement(workflowSteps[activeStep].icon, { className: "w-10 h-10 animate-pulse" })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Project Categories */}
      <section className="py-32 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-semibold text-electric-iris uppercase tracking-widest font-sans">
                Curated Categories
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
                Project Categories
              </h2>
            </div>
            <p className="text-smoke text-sm md:text-base max-w-md font-sans leading-relaxed">
              We compile production-ready setup systems across modern computing fields.
            </p>
          </div>

          {/* 3D tilt categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {domainsList.map((dom, i) => {
              const IconComp = dom.icon;
              return (
                <Card
                  key={i}
                  glowColor={dom.glow}
                  className="flex flex-col gap-4 p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-void border border-slate-edge/30 flex items-center justify-center text-electric-iris shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-white tracking-tight">
                      {dom.name}
                    </h4>
                    <p className="text-smoke text-xs font-sans mt-2 leading-relaxed">
                      {dom.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: Product Code Showcase - Crisp White background */}
      <section className="bg-white py-24 relative z-10 border-y border-slate-200 shadow-sm font-sans">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left description column */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-electric-iris/10 border border-electric-iris/25 text-xs font-semibold text-electric-iris uppercase tracking-wider font-sans">
                <Code2 className="w-3.5 h-3.5" /> Systems Engineering
              </div>
              <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Inspect Real Code & Architectures
              </h2>
              <p className="text-slate-600 text-sm font-sans leading-relaxed">
                Dive into production-ready software structures designed for high-performance applications. We craft clean, modular configurations featuring immersive Three.js loops, serverless APIs, and automated configurations.
              </p>

              <div className="flex flex-col gap-3 text-xs text-slate-600 font-semibold font-sans">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-electric-iris shrink-0" />
                  <span>Strict compile-safe TypeScript guidelines</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-electric-iris shrink-0" />
                  <span>Clean environment mapping & setup walkthroughs</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-electric-iris shrink-0" />
                  <span>Production-grade Prisma schemas and API handlers</span>
                </div>
              </div>

              <Button variant="primary" href="/projects" className="self-start mt-2">
                Inspect Source Codes <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* Right product mockup: smaller screen/image column */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 max-w-[520px] transition-transform duration-300 hover:scale-[1.015]">
                <img
                  src="/ide-screenshot.png"
                  alt="Systems Engineering Mock Editor"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AI Frameworks Network Spotlight */}
      <section className="py-32 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual SVG Network */}
            <div className="lg:col-span-6 relative h-64 lg:h-96 flex items-center justify-center">
              <svg className="absolute w-full h-full text-slate-edge/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="100" r="6" className="fill-electric-iris animate-pulse" />
                <circle cx="350" cy="150" r="6" className="fill-ember-pulse animate-pulse" />
                <circle cx="200" cy="300" r="6" className="fill-electric-iris" />
                <circle cx="400" cy="250" r="6" className="fill-snow" />

                <line x1="150" y1="100" x2="350" y2="150" stroke="currentColor" strokeWidth="1" />
                <line x1="150" y1="100" x2="200" y2="300" stroke="currentColor" strokeWidth="1" />
                <line x1="350" y1="150" x2="400" y2="250" stroke="currentColor" strokeWidth="1" />
                <line x1="200" y1="300" x2="400" y2="250" stroke="currentColor" strokeWidth="1" />
              </svg>
              <div className="absolute top-1/4 left-1/4 p-4 rounded-xl bg-charcoal-card border border-slate-edge/20 font-mono text-[10px] text-smoke max-w-[200px] shadow-lg">
                <span className="text-electric-iris">const</span> swarm = new AgentSwarm(); <br />
                swarm.coordinate();
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-electric-iris/10 border border-electric-iris/25 text-xs font-semibold text-electric-iris uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-electric-iris animate-spin [animation-duration:12s]" /> Autonomous Systems
              </div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white leading-tight">
                Cinematic AI Integrations
              </h2>
              <p className="text-smoke text-sm font-sans leading-relaxed">
                Step into autonomous execution pipelines. We design complex agent meshes utilizing LangGraph node coordinators, Model Context Protocol servers, and local LLM routers.
              </p>
              <Button variant="glow" href="/projects?domain=agentic" className="self-start">
                Explore AI Swarms
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Call To Action - Glow Banner */}
      <section className="relative z-10 pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden bg-charcoal-card border border-slate-edge/20 p-12 md:p-20 flex flex-col items-center text-center gap-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-radial from-electric-iris/5 to-transparent blur-3xl pointer-events-none" />

            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white max-w-3xl leading-tight">
              Ready to construct <br />
              your next digital asset?
            </h2>
            <p className="text-smoke text-sm md:text-base font-sans max-w-md leading-relaxed mt-2">
              Scope your project specifications or pick a pre-engineered setup. Join hundreds of builders worldwide.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Button variant="primary" href="/contact">
                Get Custom Quote
              </Button>
              <Button variant="ghost" href="/projects">
                View Project Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
