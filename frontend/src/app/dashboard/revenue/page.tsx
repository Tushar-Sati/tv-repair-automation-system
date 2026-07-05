"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RevenueRouteAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?revenueLock=1");
  }, [router]);

  return null;
}
