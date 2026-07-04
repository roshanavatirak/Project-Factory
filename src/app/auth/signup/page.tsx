"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail, ArrowRight, RefreshCw, User, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { signupAction } from "@/app/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await signupAction({
        name,
        email,
        phone: phone || undefined,
        password,
      });

      if (!result.success) {
        setErrorMsg(result.error || "An error occurred during registration.");
        setLoading(false);
        return;
      }

      setLoading(false);
      // Redirect to login page upon success
      router.push("/auth/login?registered=true");
    } catch (err) {
      console.error(err);
      setErrorMsg("A system error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16">
      <div className="grid-background" />
      <div className="aurora-beam" />

      <div className="w-full max-w-[450px] px-6 relative z-10">
        {/* Brand link */}
        <div className="flex flex-col items-center gap-6 mb-8 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-electric-iris to-ember-pulse flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tighter text-white">
              PROJECT<span className="text-electric-iris">FACTORY</span>
            </span>
          </Link>
          <div>
            <h2 className="font-display text-xl font-bold text-white tracking-tight">Create Workspace Session</h2>
            <p className="font-sans text-xs text-smoke mt-1">Register credentials to log in to active dashboards.</p>
          </div>
        </div>

        {/* Card containing signup form */}
        <Card glowColor="iris" className="p-8">
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans leading-normal">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-white">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-smoke absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-void border border-slate-edge/30 rounded-[4px] py-3 pl-10 pr-4 text-white focus:outline-none focus:border-electric-iris"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-white">Developer Email</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-smoke absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-void border border-slate-edge/30 rounded-[4px] py-3 pl-10 pr-4 text-white focus:outline-none focus:border-electric-iris"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-white">Mobile Number (Login Identifier)</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-smoke absolute left-3 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="e.g. +15550199 or 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-void border border-slate-edge/30 rounded-[4px] py-3 pl-10 pr-4 text-white focus:outline-none focus:border-electric-iris"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-white">Workspace Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-smoke absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-void border border-slate-edge/30 rounded-[4px] py-3 pl-10 pr-4 text-white focus:outline-none focus:border-electric-iris"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full justify-center py-3 text-sm font-semibold mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Building Workspace...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>

            <div className="text-center mt-2 font-sans text-xs text-smoke">
              Already registered?{" "}
              <Link href="/auth/login" className="text-electric-iris hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
