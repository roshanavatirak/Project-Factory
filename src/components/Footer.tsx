"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Send, Github, Twitter, Linkedin, Sparkles } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const footerLinks = {
    platforms: [
      { name: "Explore Projects", href: "/projects" },
      { name: "Pricing Options", href: "/pricing" },
      { name: "Student Portal", href: "/dashboard" },
    ],
    domains: [
      { name: "Machine Learning & AI", href: "/projects?domain=ai-ml" },
      { name: "Full Stack Web Apps", href: "/projects?domain=web" },
      { name: "Agentic AI Systems", href: "/projects?domain=agentic" },
      { name: "Blockchain & Cyber", href: "/projects?domain=blockchain" },
    ],
    company: [
      { name: "About Us", href: "/" },
      { name: "Careers", href: "/" },
      { name: "Contact Hub", href: "/contact" },
    ],
  };

  return (
    <footer className="relative bg-void border-t border-slate-edge/20 pt-20 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-radial from-electric-iris/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          {/* Brand & Newsletter */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-electric-iris to-ember-pulse flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tighter text-white">
                PROJECT<span className="text-electric-iris">FACTORY</span>
              </span>
            </Link>
            <p className="text-smoke text-sm max-w-sm font-sans leading-relaxed">
              We engineer world-class, production-ready capstone, research, and startup MVP applications to empower the next generation of builders.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 max-w-sm mt-2">
              <span className="text-xs font-semibold text-white tracking-wider uppercase flex items-center gap-1.5 font-display">
                <Sparkles className="w-3.5 h-3.5 text-ember-pulse" /> Newsletter
              </span>
              <div className="relative flex items-center p-[1px] rounded-full bg-slate-edge/30 focus-within:bg-gradient-to-r focus-within:from-electric-iris focus-within:to-ember-pulse">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-charcoal-card rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder-ash focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 p-2 bg-electric-iris hover:bg-electric-iris/90 rounded-full text-white cursor-pointer transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <span className="text-xs text-ember-pulse animate-pulse">
                  Subscribed successfully! Welcome to the future.
                </span>
              )}
            </form>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-7">
            {/* Columns */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-snow mb-4 font-display">
                Platform
              </h4>
              <ul className="flex flex-col gap-3 text-sm">
                {footerLinks.platforms.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-smoke hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-snow mb-4 font-display">
                Top Domains
              </h4>
              <ul className="flex flex-col gap-3 text-sm">
                {footerLinks.domains.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-smoke hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-snow mb-4 font-display">
                Company
              </h4>
              <ul className="flex flex-col gap-3 text-sm">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-smoke hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-slate-edge/10" />

        {/* Copyright & Social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 text-xs text-smoke font-sans">
          <span>&copy; {new Date().getFullYear()} Project Factory. Engineered for excellence.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors" aria-label="Github link">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter link">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Linkedin link">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
