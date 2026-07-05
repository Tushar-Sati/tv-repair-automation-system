"use client";

import { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { useRevenueLock } from "@/components/revenue/RevenueLockContext";
import { cn } from "@/lib/utils";

type ProtectedFinancialValueProps = {
  children: ReactNode;
  mask?: string;
  className?: string;
};

export function ProtectedFinancialValue({
  children,
  mask = "₹••••••",
  className,
}: ProtectedFinancialValueProps) {
  const { isRevenueUnlocked } = useRevenueLock();

  if (isRevenueUnlocked) {
    return <>{children}</>;
  }

  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)} aria-label="Financial value locked">
      <span className="blur-[1.5px]">{mask}</span>
      <LockKeyhole className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
    </span>
  );
}

export function ProtectedFinancialPanel({ children, className }: { children: ReactNode; className?: string }) {
  const { isRevenueUnlocked } = useRevenueLock();

  return (
    <div className={cn("relative", className)}>
      <div className={cn(!isRevenueUnlocked && "pointer-events-none select-none blur-sm")}>{children}</div>
      {!isRevenueUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-950/25 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-300 shadow-lg">
            <LockKeyhole className="h-3.5 w-3.5 text-blue-300" />
            Financial data locked
          </div>
        </div>
      )}
    </div>
  );
}
