import * as React from "react";
import { Suspense } from "react";
import { Shell } from "@/components/table/shell";
import { FeatureFlagsProvider } from "@/components/table/_components/feature-flags-provider";
import { TasksTable } from "@/components/table/_components/tasks-table";
import { sampleTasks } from "@/components/table/lib/constants";

function TableContent() {
  // Mock data instead of database queries - create mutable copies
  const mockData = {
    data: [...sampleTasks],
    pageCount: 1,
  };

  const mockStatusCounts = {
    todo: 2,
    in_progress: 1,
    done: 1,
    canceled: 1,
  };

  const mockPriorityCounts = {
    low: 1,
    medium: 2,
    high: 2,
  };

  const mockEstimatedHoursRange = {
    min: 2,
    max: 12,
  };

  const mockPromises = Promise.resolve([
    mockData,
    mockStatusCounts,
    mockPriorityCounts,
    mockEstimatedHoursRange,
  ] as [
    { data: any[]; pageCount: number },
    any,
    any,
    { min: any; max: any }
  ]);

  return (
    <FeatureFlagsProvider>
      <TasksTable promises={mockPromises} />
    </FeatureFlagsProvider>
  );
}

export default function IndexPage() {
  return (
    <Shell className="gap-2">
      <Suspense fallback={<div>Loading...</div>}>
        <TableContent />
      </Suspense>
    </Shell>
  );
}
