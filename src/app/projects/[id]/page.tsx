import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Cpu, Code, CheckCircle, Terminal, Calendar, Award 
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { projectsData } from "@/data/projects";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen py-16">
      {/* Background elements */}
      <div className="grid-background" />
      <div className="aurora-beam" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-smoke hover:text-white transition-colors mb-12 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        {/* Hero Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-electric-iris/10 border border-electric-iris/25 text-xs font-semibold text-electric-iris uppercase tracking-wide">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-edge/20 text-xs font-semibold text-smoke uppercase tracking-wide">
                {project.difficulty}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {project.title}
            </h1>
            
            <p className="font-sans text-smoke text-sm md:text-base leading-relaxed mt-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-edge/20 mt-4">
              <div className="flex items-center gap-2 text-sm text-smoke">
                <Calendar className="w-4 h-4 text-electric-iris" />
                <span>Duration: <strong>{project.duration}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-smoke">
                <Award className="w-4 h-4 text-ember-pulse" />
                <span>Mentorship: <strong>Includes 2 Sessions</strong></span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden bg-charcoal-card border border-slate-edge/30 h-64 lg:h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Breakdown Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Detailed Features & Specs */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-4 tracking-wide uppercase">
                Architecture & Key Features
              </h2>
              <p className="text-smoke text-sm leading-relaxed mb-6 font-sans">
                Every project from Project Factory includes structural layouts, database integration config files, and detailed walkthrough instruction guides to simplify setup.
              </p>
              
              <div className="flex flex-col gap-4">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-charcoal-card/65 border border-slate-edge/20">
                    <CheckCircle className="w-5 h-5 text-electric-iris shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white font-sans">Checkpoint {idx + 1}</h4>
                      <p className="text-smoke text-xs font-sans mt-1 leading-relaxed">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Specs */}
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-4 tracking-wide uppercase">
                Integrated Environment Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-charcoal-card border border-slate-edge/30 text-xs font-mono text-white"
                  >
                    <Terminal className="w-3.5 h-3.5 text-electric-iris" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Acquisition Column */}
          <div className="lg:col-span-5">
            <Card glowColor="iris" className="flex flex-col gap-6">
              <div>
                <span className="text-xs font-semibold text-smoke uppercase tracking-wider font-sans">
                  Acquisition Scope
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-display font-extrabold text-white tracking-tight">
                    {project.price}
                  </span>
                  <span className="text-xs text-smoke font-sans">One-time payment</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 font-sans text-xs text-smoke border-y border-slate-edge/20 py-4">
                <div className="flex items-center justify-between">
                  <span>Production Ready Source Code</span>
                  <span className="text-white font-semibold">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Setup Guide & Video walkthrough</span>
                  <span className="text-white font-semibold">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>1-on-1 Debugging support</span>
                  <span className="text-white font-semibold">2 Hours Session</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Deployment files (Docker/Compose)</span>
                  <span className="text-white font-semibold">Included</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="primary" href={`/contact?project=${project.id}`} className="w-full justify-center">
                  Order Setup Package
                </Button>
                <Button variant="ghost" href="/contact" className="w-full justify-center">
                  Customize Feature Scope
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
