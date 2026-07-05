"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, Terminal } from "lucide-react";
import { loginWithOAuthTokenAction } from "@/app/actions/oauth";

function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("Authentication token is missing. Redirecting to login...");
      const timer = setTimeout(() => {
        router.push("/auth/login?error=OAuth%20Token%20Missing");
      }, 2500);
      return () => clearTimeout(timer);
    }

    async function authorizeSession() {
      try {
        const result = await loginWithOAuthTokenAction(token!);
        if (result.success) {
          router.push("/dashboard");
        } else {
          setErrorMsg(result.error || "Authentication failed.");
          setTimeout(() => {
            router.push(`/auth/login?error=${encodeURIComponent(result.error || "OAuth Failed")}`);
          }, 3000);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to authorize session.");
        setTimeout(() => {
          router.push("/auth/login?error=Session%20Authorization%20Failed");
        }, 3000);
      }
    }

    authorizeSession();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-electric-iris to-ember-pulse flex items-center justify-center animate-pulse">
        <Terminal className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-white tracking-tight">Authenticating Session</h2>
        <p className="font-sans text-xs text-smoke mt-1.5 animate-pulse max-w-[280px]">
          {errorMsg || "Mapping credentials and synchronizing workspace tokens..."}
        </p>
      </div>
      {!errorMsg && <RefreshCw className="w-5 h-5 text-electric-iris animate-spin mt-4" />}
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-16 bg-void">
      <div className="grid-background" />
      <div className="aurora-beam" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-electric-iris animate-spin" />
        </div>
      }>
        <OAuthCallbackHandler />
      </Suspense>
    </div>
  );
}
