export type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";

interface BaseTask {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

interface BacklogTask extends BaseTask {
  status: "BACKLOG";
}

interface InProgressTask extends BaseTask {
  status: "IN_PROGRESS";
  startedAt: Date; // Specific data for this state
}

interface BlockedTask extends BaseTask {
  status: "BLOCKED";
  blockedReason: string; // Required only when blocked
}

interface CompletedTask extends BaseTask {
  status: "COMPLETED";
  completedAt: Date;
}

// The Union: A Task can ONLY be one of these shapes
export type SyncroTask = BacklogTask | InProgressTask | BlockedTask | CompletedTask;

/** Alias for components that accept any task-like object with status */
export type Task = SyncroTask | { id: string; title: string; description?: string | null; status: string; startedAt?: Date; completedAt?: Date; blockedReason?: string };