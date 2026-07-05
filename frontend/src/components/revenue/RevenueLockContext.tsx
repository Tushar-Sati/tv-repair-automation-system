"use client";

import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RevenueLockModal } from "@/components/revenue/RevenueLockModal";

type RevenueLockContextValue = {
  isRevenueUnlocked: boolean;
  requestRevenueUnlock: (targetPath?: string) => void;
  lockRevenue: () => void;
};

const RevenueLockContext = createContext<RevenueLockContextValue | null>(null);

export function RevenueLockProvider({ children }: { children: React.ReactNode }) {
  const [isRevenueUnlocked, setIsRevenueUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState("/dashboard/analytics");
  const router = useRouter();

  const requestRevenueUnlock = useCallback((targetPath = "/dashboard/analytics") => {
    setPendingPath(targetPath);
    setIsModalOpen(true);
  }, []);

  const lockRevenue = useCallback(() => {
    setIsRevenueUnlocked(false);
    setIsModalOpen(false);
  }, []);

  const handleUnlockSuccess = useCallback(() => {
    setIsRevenueUnlocked(true);
    setIsModalOpen(false);
    router.push(pendingPath);
  }, [pendingPath, router]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isRevenueUnlocked,
      requestRevenueUnlock,
      lockRevenue,
    }),
    [isRevenueUnlocked, lockRevenue, requestRevenueUnlock],
  );

  return (
    <RevenueLockContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        <RevenueLockQueryHandler />
      </Suspense>
      <RevenueLockModal open={isModalOpen} onCancel={handleCancel} onUnlockSuccess={handleUnlockSuccess} />
    </RevenueLockContext.Provider>
  );
}

function RevenueLockQueryHandler() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requestRevenueUnlock } = useRevenueLock();

  useEffect(() => {
    if (searchParams.get("revenueLock") === "1") {
      requestRevenueUnlock("/dashboard/analytics");
      if (pathname === "/dashboard") {
        router.replace("/dashboard", { scroll: false });
      }
    }
  }, [pathname, requestRevenueUnlock, router, searchParams]);

  return null;
}

export function useRevenueLock() {
  const context = useContext(RevenueLockContext);

  if (!context) {
    throw new Error("useRevenueLock must be used within RevenueLockProvider");
  }

  return context;
}
