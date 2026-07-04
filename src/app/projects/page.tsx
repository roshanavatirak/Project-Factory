"use client";

import React, { useState, useMemo } from "react";
import { Compass, Search, LayoutGrid, Zap, Cpu, Shield, Database } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { projectsData } from "@/data/projects";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const domains = [
    { key: "all", name: "All Domains", icon: LayoutGrid },
    { key: "agentic", name: "Agentic AI", icon: Zap },
    { key: "ai-ml", name: "Machine Learning / AI", icon: Cpu },
    { key: "blockchain", name: "Blockchain & Crypt", icon: Shield },
    { key: "security", name: "Cyber Security", icon: Shield },
    { key: "iot", name: "IoT & Telemetry", icon: Database },
  ];

  const filteredProjects = useMemo(() => {
    return projectsData.filter((proj) => {
      const matchesSearch =
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDomain = selectedDomain === "all" || proj.domain === selectedDomain;

      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain]);

  return (
    <div className="relative min-h-screen pt-12 pb-32">
      {/* Background grids */}
      <div className="grid-background" />
      <div className="aurora-beam" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-electric-iris/10 border border-electric-iris/25 text-xs font-semibold text-electric-iris tracking-wider uppercase font-sans">
            <Compass className="w-3.5 h-3.5" /> Project Warehouse
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Explore Premium Projects
          </h1>
          <p className="font-sans text-smoke text-sm md:text-base max-w-xl leading-relaxed mt-1">
            Acquire production-ready capstone frameworks, AI agent pipelines, smart wallets, and web platforms with clean deployment configuration layers.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-grow max-w-md flex items-center p-[1px] rounded-full bg-slate-edge/30 focus-within:bg-gradient-to-r focus-within:from-electric-iris focus-within:to-ember-pulse">
              <Search className="w-4 h-4 text-smoke absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tech stack, domains, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-charcoal-card rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder-ash focus:outline-none"
              />
            </div>
          </div>

          {/* Domain Selection Pills */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {domains.map((dom) => {
              const IconComp = dom.icon;
              const isSelected = selectedDomain === dom.key;
              return (
                <button
                  key={dom.key}
                  onClick={() => setSelectedDomain(dom.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                    isSelected
                      ? "bg-electric-iris border-electric-iris text-white shadow-md"
                      : "bg-charcoal-card/60 border-slate-edge/40 text-smoke hover:border-white/50 hover:text-white"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {dom.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <Card key={proj.id} glowColor="iris" className="flex flex-col h-full">
                <div className="relative w-full h-48 bg-void rounded-lg overflow-hidden mb-6 border border-slate-edge/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-200"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-void/90 text-[10px] font-bold text-white tracking-wider uppercase border border-slate-edge/20">
                    {proj.duration}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 font-sans">
                  <span className="px-2.5 py-0.5 rounded-full bg-electric-iris/10 border border-electric-iris/25 text-[10px] font-semibold text-electric-iris uppercase tracking-wide">
                    {proj.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-edge/20 text-[10px] font-semibold text-smoke uppercase tracking-wide">
                    {proj.difficulty}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white tracking-tight mb-2 leading-tight">
                  {proj.title}
                </h3>
                
                <p className="text-smoke text-sm font-sans leading-relaxed mb-6 flex-grow">
                  {proj.description}
                </p>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono text-smoke px-2 py-0.5 bg-void rounded border border-slate-edge/30">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Primary specs CTA button */}
                <Button variant="white" href={`/projects/${proj.id}`} className="w-full justify-center">
                  Specs & Code Details
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border border-slate-edge/20 rounded-xl bg-charcoal-card p-20 flex flex-col items-center justify-center text-center gap-4">
            <Compass className="w-8 h-8 text-iron-veil" />
            <h3 className="font-display text-xl font-semibold text-white uppercase tracking-wider">No projects found</h3>
            <p className="text-smoke text-sm font-sans max-w-sm leading-relaxed">
              We couldn&apos;t find any projects matching your criteria. Try adjusting filters or searching for another term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
