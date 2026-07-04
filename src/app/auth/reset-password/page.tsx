"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Terminal, Lock, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { resetPasswordAction } from "@/app/actions/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!token) {
      setErrorMsg("The password reset token is missing from this URL.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify both inputs.");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPasswordAction(token, password);
      if (result.success) {
        setSuccess(true);
      } else {
        setErrorMsg(result.error || "The reset token is invalid or has expired.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("A system database error occurred. Please try again.");
    } finally {
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
          <h2 className="font-display text-xl font-bold text-white tracking-tight">Set New Password</h2>
          <p className="font-sans text-xs text-smoke mt-1">Specify your new workspace login credentials.</p>
        </div>
      </div>

      {/* Card containing reset form */}
      <Card glowColor="iris" className="p-8">
        {success ? (
          <div className="text-center flex flex-col items-center gap-6 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight">Key Reset Complete!</h2>
              <p className="font-sans text-xs text-smoke mt-2 leading-relaxed">
                Your password has been successfully updated. You may now log in to the student portal.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-electric-iris text-white text-xs font-semibold hover:bg-electric-iris/90 cursor-pointer transition-colors w-full"
            >
              Sign In to Workspace
            </Link>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans leading-normal">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-white">New Workspace Password</label>
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

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-white">Confirm New Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-smoke absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Saving Credentials...
                  </>
                ) : (
                  <>
                    Save Password <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-16">
      <div className="grid-background" />
      <div className="aurora-beam" />
      
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-t-electric-iris border-slate-edge rounded-full animate-spin" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
