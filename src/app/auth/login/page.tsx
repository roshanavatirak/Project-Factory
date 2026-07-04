"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal, Lock, Mail, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { loginAction } from "@/app/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (justRegistered) {
      setSuccessMsg("Account created! A verification link has been sent to your email address. Please click it to activate your account.");
    }
  }, [justRegistered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await loginAction({
        identifier,
        password,
      });

      if (!result.success) {
        setErrorMsg(result.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      setLoading(false);
      // Redirect to dashboard on login success
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("A system error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
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
          <h2 className="font-display text-xl font-bold text-white tracking-tight">Access Workspace Portal</h2>
          <p className="font-sans text-xs text-smoke mt-1">Enter your credentials (email or mobile) to log in.</p>
        </div>
      </div>

      {/* Card containing login form */}
      <Card glowColor="iris" className="p-8">
        {successMsg && (
          <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-sans leading-normal flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans leading-normal">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-white">Email or Mobile Number</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-smoke absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="name@university.edu or mobile number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-void border border-slate-edge/30 rounded-[4px] py-3 pl-10 pr-4 text-white focus:outline-none focus:border-electric-iris"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-white">Workspace Password</label>
              <Link href="/auth/forgot-password" className="text-[10px] text-electric-iris hover:underline font-semibold">
                Forgot Key?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-smoke absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
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
                <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Initializing Session...
              </>
            ) : (
              <>
                Sign In to Portal <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>

          <div className="text-center mt-2 font-sans text-xs text-smoke">
            New developer?{" "}
            <Link href="/auth/signup" className="text-electric-iris hover:underline font-semibold">
              Create an Account
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-16">
      <div className="grid-background" />
      <div className="aurora-beam" />
      
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-t-electric-iris border-slate-edge rounded-full animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
