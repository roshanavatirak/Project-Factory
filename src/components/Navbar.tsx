"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Terminal, User, LogOut, ChevronDown, Package, 
  Home, Compass, CreditCard, LogIn, Laptop,
  ShieldCheck
} from "lucide-react";
import Button from "./ui/Button";
import { getSessionAction, logoutAction } from "@/app/actions/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Monitor scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch session on path changes
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await getSessionAction();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Navbar session fetch warning:", err);
        setUser(null);
      }
    }
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutAction();
      setUser(null);
      setProfileDropdownOpen(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Navbar logout warning:", err);
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP HEADER NAVBAR (Hidden on Mobile)                      */}
      {/* ------------------------------------------------------------- */}
      <header className="hidden md:block fixed top-4 left-0 right-0 z-50 px-6">
        <div
          className={`max-w-[1100px] mx-auto rounded-full border border-white/10 transition-all duration-300 shadow-2xl bg-void/40 backdrop-blur-xl ${
            scrolled 
              ? "py-2.5 px-8 border-electric-iris/30 shadow-electric-iris/5 bg-void/60" 
              : "py-3.5 px-8"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-electric-iris to-ember-pulse flex items-center justify-center overflow-hidden">
                <Terminal className="w-4 h-4 text-white relative z-10" />
                <div className="absolute inset-0 bg-void opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <span className="font-display font-bold text-base tracking-tighter text-white">
                PROJECT<span className="text-electric-iris">FACTORY</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="flex items-center gap-8">
              {/* Home */}
              <Link
                href="/"
                className={`relative font-sans text-xs font-semibold tracking-wide uppercase transition-colors hover:text-white cursor-pointer ${
                  pathname === "/" ? "text-white" : "text-smoke"
                }`}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-electric-iris rounded-full" />
                )}
              </Link>

              {/* Explore */}
              <Link
                href="/projects"
                className={`relative font-sans text-xs font-semibold tracking-wide uppercase transition-colors hover:text-white cursor-pointer ${
                  pathname === "/projects" ? "text-white" : "text-smoke"
                }`}
              >
                Explore
                {pathname === "/projects" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-electric-iris rounded-full" />
                )}
              </Link>
              
              {/* Pricing */}
              <Link
                href="/pricing"
                className={`relative font-sans text-xs font-semibold tracking-wide uppercase transition-colors hover:text-white cursor-pointer ${
                  pathname === "/pricing" ? "text-white" : "text-smoke"
                }`}
              >
                Pricing
                {pathname === "/pricing" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-electric-iris rounded-full" />
                )}
              </Link>

              {/* Logged in workspace links */}
              {user && (
                <Link
                  href="/dashboard"
                  className={`relative font-sans text-xs font-semibold tracking-wide uppercase transition-colors hover:text-white cursor-pointer ${
                    pathname === "/dashboard" ? "text-white" : "text-smoke"
                  }`}
                >
                  My Purchases
                  {pathname === "/dashboard" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-electric-iris rounded-full" />
                  )}
                </Link>
              )}

              {/* Admin Panel link */}
              {user && user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className={`relative font-sans text-xs font-semibold tracking-wide uppercase transition-colors hover:text-white cursor-pointer text-ember-pulse hover:text-white ${
                    pathname === "/admin/dashboard" ? "text-white" : "text-ember-pulse"
                  }`}
                >
                  Admin Panel
                  {pathname === "/admin/dashboard" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-ember-pulse rounded-full" />
                  )}
                </Link>
              )}
            </div>

            {/* Auth panel */}
            <div className="flex items-center gap-6">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 text-xs font-semibold text-white hover:text-electric-iris transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-electric-iris/20 border border-electric-iris/40 flex items-center justify-center text-[10px] font-bold text-electric-iris">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span>{user.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Card */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 rounded-xl bg-charcoal-card border border-slate-edge/30 p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-3 py-2 border-b border-slate-edge/10 text-[10px] text-smoke font-sans">
                        Logged in as <strong className="text-white block truncate mt-0.5">{user.email}</strong>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-smoke hover:bg-void hover:text-white transition-colors text-ember-pulse font-semibold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-ember-pulse" /> Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-smoke hover:bg-void hover:text-white transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-electric-iris" /> My Purchases
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/auth/login"
                    className="text-xs font-semibold text-smoke hover:text-white transition-colors cursor-pointer"
                  >
                    Sign In
                  </Link>
                  <Button variant="primary" href="/contact" className="py-2 px-4 text-xs rounded-full">
                    Get Project
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE TOP LOGO BAR                                           */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden fixed top-4 left-6 right-6 z-40 flex justify-between items-center bg-void/60 backdrop-blur-md border border-white/5 rounded-full px-5 py-2.5 shadow-lg">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-electric-iris to-ember-pulse flex items-center justify-center">
            <Terminal className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-bold text-xs tracking-tighter text-white">
            PROJECT<span className="text-electric-iris">FACTORY</span>
          </span>
        </Link>
        {user ? (
          <Link
            href="/dashboard"
            className="w-6 h-6 rounded-full bg-electric-iris/20 border border-electric-iris/40 flex items-center justify-center text-[9px] font-bold text-white uppercase"
          >
            {user.name ? user.name[0] : "U"}
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="text-[10px] font-semibold text-smoke hover:text-white tracking-wide uppercase"
          >
            Login
          </Link>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE FLOATING BOTTOM NAVBAR (Native App Tab Bar Style)      */}
      {/* ------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-void/85 backdrop-blur-xl border border-white/10 rounded-full py-2.5 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-around">
        {/* Tab 1: Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-center flex-1 transition-all ${
            pathname === "/" ? "text-electric-iris scale-105" : "text-smoke"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-bold font-sans tracking-wide">Home</span>
        </Link>

        {/* Tab 2: Explore */}
        <Link
          href="/projects"
          className={`flex flex-col items-center gap-0.5 text-center flex-1 transition-all ${
            pathname === "/projects" ? "text-electric-iris scale-105" : "text-smoke"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[9px] font-bold font-sans tracking-wide">Explore</span>
        </Link>

        {/* Tab 3: Pricing */}
        <Link
          href="/pricing"
          className={`flex flex-col items-center gap-0.5 text-center flex-1 transition-all ${
            pathname === "/pricing" ? "text-electric-iris scale-105" : "text-smoke"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-[9px] font-bold font-sans tracking-wide">Pricing</span>
        </Link>

        {/* Tab 4: Account/Dashboard */}
        {user ? (
          <Link
            href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            className={`flex flex-col items-center gap-0.5 text-center flex-1 transition-all ${
              pathname === "/dashboard" || pathname === "/admin/dashboard" ? "text-electric-iris scale-105" : "text-smoke"
            }`}
          >
            {user.role === "admin" ? (
              <>
                <ShieldCheck className="w-4 h-4 text-ember-pulse" />
                <span className="text-[9px] font-bold font-sans tracking-wide text-ember-pulse">Admin</span>
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                <span className="text-[9px] font-bold font-sans tracking-wide">Purchases</span>
              </>
            )}
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className={`flex flex-col items-center gap-0.5 text-center flex-1 transition-all ${
              pathname === "/auth/login" ? "text-electric-iris scale-105" : "text-smoke"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span className="text-[9px] font-bold font-sans tracking-wide">Sign In</span>
          </Link>
        )}
      </nav>
    </>
  );
}
