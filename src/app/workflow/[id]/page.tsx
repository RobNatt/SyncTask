"use client";

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RealTaskItem } from '@/components/workflow/RealTaskItem';
import { ReviewerActions } from '@/components/workflow/ReviewerActions';

export default function LiveProofPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: steps, isLoading } = useQuery({
    queryKey: ['workflow-state', id],
    queryFn: async () => {
      const res = await fetch(`/api/workflow/status?instanceId=${id}`);
      return res.json();
    },
    refetchInterval: 1500 // Polls every 1.5s to catch other people's work
  });

  if (isLoading) return <div className="bg-[#020617] min-h-screen p-20 text-blue-500 font-mono">CONNECTING_TO_ENGINE...</div>;

  return (
    <main className="min-h-screen bg-[#020617] p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-white text-3xl font-black">LIVE_ENGINE_PROOF <span className="text-blue-500 text-sm font-mono ml-4">ID: {id}</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps
            ? [...new Set((steps as { role: string }[]).map((s) => s.role))].map((role) => (
            <div key={role} className="space-y-4">
              <h2 className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{role}</h2>
              {steps?.filter((s: { role: string }) => s.role === role).map((step: { id: string; instanceId: string; label: string; status: string; role: string }) => (
                <RealTaskItem key={step.id} instanceId={id} step={step} />
              ))}
              {role === "PRIMARY_ACTOR" && (
                <ReviewerActions
                  instanceId={id}
                  targetStepId={steps?.find((s: { role: string; status: string }) => s.role === "PRIMARY_ACTOR" && s.status === "READY")?.id ?? steps?.[0]?.id}
                />
              )}
            </div>
          ))
            : null}
        </div>
      </div>
    </main>
  );
}