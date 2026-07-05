"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Mail, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { requestPasswordResetAction } from "@/app/actions/auth";

import Loader from "@/components/ui/Loader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await requestPasswordResetAction(email);
      if (result.success) {
        setSuccessMsg(result.message || "A reset link has been dispatched to your email address.");
      } else {
        setErrorMsg(result.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("A system database error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16">
      {loading && (
        <div className="fixed inset-0 bg-void/80 z-[9999] flex items-center justify-center pointer-events-auto">
          <Loader text="Dispatching reset link..." />
        </div>
      )}
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
            <h2 className="font-display text-xl font-bold text-white tracking-tight">Forgot Workspace Key</h2>
            <p className="font-sans text-xs text-smoke mt-1">Specify your email address to set a new password.</p>
          </div>
        </div>

        {/* Form Card */}
        <Card glowColor="iris" className="p-8">
          {successMsg && (
            <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-sans leading-normal flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans leading-normal">
              {errorMsg}
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans text-xs">
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

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full justify-center py-3 text-sm font-semibold mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Dispatching Link...
                  </>
                ) : (
                  <>
                    Send Reset Link <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="text-center mt-6 font-sans text-xs text-smoke">
            Back to{" "}
            <Link href="/auth/login" className="text-electric-iris hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
