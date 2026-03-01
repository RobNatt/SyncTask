// app/tasks/page.tsx
import type { Task } from '@/types/task';
import { TaskBadge } from '@/components/TaskBadge';

// Mock function - later this will be a database query
async function getTasks(): Promise<Task[]> {
  return [
    {
      id: '1',
      title: 'Fix Hydration Error',
      description: 'Check the footer component for mismatched tags.',
      status: 'in-progress',
      startedAt: new Date(),
    },
    {
      id: '2',
      title: 'Setup Database',
      description: 'Initialize Prisma and connect to PostgreSQL.',
      status: 'completed',
      completedAt: new Date(),
    },
  ];
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Team Tasks</h1>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{task.title}</h2>
              <TaskBadge task={task} />
            </div>
            <p className="text-gray-600 mt-2">{task.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}