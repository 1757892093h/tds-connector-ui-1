"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { lazy, Suspense } from "react";

// Lazy load the CreateContractPage component
const CreateContractPage = lazy(() =>
  import("@/components/contract").then((m) => ({
    default: m.CreateContractPage,
  }))
);

// Loading skeleton component
const TabLoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="bg-muted h-12 w-32" />
    <Skeleton className="bg-muted h-8 w-64" />
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="bg-muted h-96 w-full" />
      <Skeleton className="bg-muted h-96 w-full" />
    </div>
  </div>
);

export default function CreateContractPageRoute() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<TabLoadingSkeleton />}>
        <CreateContractPage />
      </Suspense>
    </div>
  );
}

