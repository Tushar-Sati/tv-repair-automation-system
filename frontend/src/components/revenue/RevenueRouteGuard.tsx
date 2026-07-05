"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRevenueLock } from "@/components/revenue/RevenueLockContext";

export function RevenueRouteGuard({ children }: { children: ReactNode }) {
  const { isRevenueUnlocked } = useRevenueLock();
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (isRevenueUnlocked) {
      setCanRender(true);
      return;
    }

    setCanRender(false);
    router.replace("/dashboard?revenueLock=1");
  }, [isRevenueUnlocked, router]);

  if (!canRender) {
    return null;
  }

  return <>{children}</>;
}
