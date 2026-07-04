"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  isExiting?: boolean;
}

interface ToastContextProps {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Smooth exit helper
  const triggerExit = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    
    // Fully clean from DOM after slide-out transition completes (300ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Trigger smooth exit transition after 3.2 seconds
    setTimeout(() => {
      triggerExit(id);
    }, 3200);
  }, [triggerExit]);

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-2xl border shadow-2xl bg-void/95 backdrop-blur-xl transform transition-all duration-300 ease-in-out ${
              t.isExiting
                ? "animate-out fade-out slide-out-to-right-6 scale-95 opacity-0 translate-x-12"
                : "animate-in fade-in slide-in-from-top-4 scale-100 opacity-100"
            } ${
              t.type === "success"
                ? "border-green-500/30 text-green-400 shadow-green-950/20"
                : t.type === "error"
                ? "border-red-500/30 text-red-400 shadow-red-950/20"
                : "border-electric-iris/30 text-electric-iris shadow-electric-iris/20"
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
              {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
              {t.type === "info" && <Info className="w-5 h-5 text-electric-iris shrink-0" />}
              <span className="text-xs font-sans font-semibold leading-relaxed text-slate-100">
                {t.message}
              </span>
            </div>
            <button
              onClick={() => triggerExit(t.id)}
              className="text-smoke hover:text-white hover:bg-white/5 transition-colors rounded-lg p-1.5 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
