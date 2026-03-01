import { Task } from "@/types/task";

const statusStyles: Record<string, string> = {
  BACKLOG: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  "in-progress": "bg-amber-100 text-amber-800",
  BLOCKED: "bg-red-100 text-red-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  completed: "bg-emerald-100 text-emerald-800",
};

export function TaskBadge({ task }: { task: Task }) {
  const status = task.status.toUpperCase().replace("-", "_").replace(" ", "_");
  const label = status.replace("_", " ");
  const style = statusStyles[task.status] ?? statusStyles[status] ?? "bg-slate-100 text-slate-700";

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
      {label}
    </span>
  );
}
