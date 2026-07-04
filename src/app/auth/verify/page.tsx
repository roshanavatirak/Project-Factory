"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Terminal, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import { verifyEmailAction } from "@/app/actions/auth";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function executeVerification() {
      if (!token) {
        setErrorMsg("The email verification token parameter is missing from this URL.");
        setVerifying(false);
        return;
      }

      try {
        const res = await verifyEmailAction(token);
        if (res.success) {
          setSuccess(true);
        } else {
          setErrorMsg(res.error || "The verification token is invalid or has expired.");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("A system database connection error occurred during verification.");
      } finally {
        setVerifying(false);
      }
    }

    executeVerification();
  }, [token]);

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
      </div>

      {/* Verification Card */}
      <Card glowColor="iris" className="p-8 text-center flex flex-col items-center gap-6">
        {verifying && (
          <>
            <div className="w-12 h-12 rounded-full bg-electric-iris/10 border border-electric-iris flex items-center justify-center text-electric-iris">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight">Verifying Credentials</h2>
              <p className="font-sans text-xs text-smoke mt-2 leading-relaxed">Please wait while we activate your developer workspace access...</p>
            </div>
          </>
        )}

        {!verifying && success && (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight">Email Verified!</h2>
              <p className="font-sans text-xs text-smoke mt-2 leading-relaxed">
                Your email has been verified. You may now log in to access active student dashboards.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-electric-iris text-white text-xs font-semibold hover:bg-electric-iris/90 cursor-pointer transition-colors w-full"
            >
              Sign In to Workspace
            </Link>
          </>
        )}

        {!verifying && !success && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight">Verification Failed</h2>
              <p className="font-sans text-xs text-red-400 mt-2 leading-relaxed font-semibold">{errorMsg}</p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-slate-edge/40 text-white text-xs font-semibold hover:bg-charcoal-card cursor-pointer transition-colors w-full"
            >
              Back to Registration
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-16">
      <div className="grid-background" />
      <div className="aurora-beam" />
      
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-t-electric-iris border-slate-edge rounded-full animate-spin" />
        </div>
      }>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
