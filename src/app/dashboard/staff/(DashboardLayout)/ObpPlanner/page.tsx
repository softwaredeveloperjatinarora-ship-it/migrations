"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to ObpDashboard page
    router.replace("/dashboard/staff/ObpPlanner/ObpDashboard");
  }, [router]);

  return null; 
}
