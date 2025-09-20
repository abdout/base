export const unknownError =
  "An unknown error occurred. Please try again later.";

export const databasePrefix = "registry";

export const sampleTasks = [
  {
    id: "1",
    code: "TASK-001",
    title: "Implement user authentication system",
    status: "in_progress" as const,
    priority: "high" as const,
    label: "feature" as const,
    estimatedHours: 8,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    code: "TASK-002",
    title: "Fix responsive layout issues on mobile",
    status: "todo" as const,
    priority: "medium" as const,
    label: "bug" as const,
    estimatedHours: 4,
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    code: "TASK-003",
    title: "Add dark mode toggle functionality",
    status: "done" as const,
    priority: "low" as const,
    label: "enhancement" as const,
    estimatedHours: 2,
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "4",
    code: "TASK-004",
    title: "Update API documentation",
    status: "todo" as const,
    priority: "medium" as const,
    label: "documentation" as const,
    estimatedHours: 6,
    createdAt: new Date("2024-01-17"),
  },
  {
    id: "5",
    code: "TASK-005",
    title: "Optimize database queries",
    status: "canceled" as const,
    priority: "high" as const,
    label: "feature" as const,
    estimatedHours: 12,
    createdAt: new Date("2024-01-13"),
  },
] as const;
