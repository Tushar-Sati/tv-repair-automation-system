"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revenueLockConfig } from "@/lib/revenue-lock-config";
import { validateRevenuePin } from "@/lib/revenue-lock-service";
import { cn } from "@/lib/utils";

type RevenueLockModalProps = {
  open: boolean;
  onCancel: () => void;
  onUnlockSuccess: () => void;
};

export function RevenueLockModal({ open, onCancel, onUnlockSuccess }: RevenueLockModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setPin("");
      setError("");
      setIsShaking(false);
      return;
    }

    window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await validateRevenuePin(pin);
    if (result.success) {
      onUnlockSuccess();
      return;
    }

    setError(result.message || "Incorrect PIN. Please try again.");
    setIsShaking(true);
    window.setTimeout(() => setIsShaking(false), 450);
    inputRef.current?.select();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/75 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 text-blue-300 shadow-[0_0_32px_rgba(59,130,246,0.28)]">
                <LockKeyhole className="h-8 w-8" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Revenue Analytics Locked</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                This section contains confidential financial information.
              </p>
            </div>

            <div className="mt-7 space-y-2">
              <label htmlFor="revenue-pin" className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Administrator PIN
              </label>
              <motion.div animate={isShaking ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.38 }}>
                <Input
                  ref={inputRef}
                  id="revenue-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={revenueLockConfig.pinLength}
                  value={pin}
                  onChange={(event) => {
                    setPin(event.target.value.replace(/\D/g, "").slice(0, revenueLockConfig.pinLength));
                    setError("");
                  }}
                  className={cn(
                    "h-12 rounded-xl border-white/10 bg-white/[0.06] text-center text-xl font-semibold tracking-[0.65em] text-white shadow-inner outline-none focus-visible:ring-blue-500/70",
                    error && "border-red-400/70 bg-red-500/10 text-red-100 focus-visible:ring-red-500/70",
                  )}
                  aria-invalid={!!error}
                  aria-describedby={error ? "revenue-pin-error" : undefined}
                />
              </motion.div>
              <div className="min-h-5">
                {error && (
                  <motion.p
                    id="revenue-pin-error"
                    className="text-sm font-medium text-red-300"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button type="button" variant="glass" onClick={onCancel} className="h-11 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-500">
                Unlock
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
