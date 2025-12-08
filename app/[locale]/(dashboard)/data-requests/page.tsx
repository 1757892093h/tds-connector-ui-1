"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { lazy, Suspense } from "react";

// Lazy load the DataRequestsListPage component
const DataRequestsListPage = lazy(() =>
  import("@/components/data-request").then((m) => ({
    default: m.DataRequestsListPage,
  }))
);

// Loading skeleton component
const TabLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="bg-muted h-24 w-full" />
      ))}
    </div>
    <Skeleton className="bg-muted h-96 w-full" />
  </div>
);

export default function DataRequestsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<TabLoadingSkeleton />}>
        <DataRequestsListPage />
      </Suspense>
    </div>
  );
}

