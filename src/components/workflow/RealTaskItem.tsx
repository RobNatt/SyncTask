"use client";

import { useTransition } from 'react';
import { completeWorkflowStep } from '@/lib/workflow-actions';
import { CheckCircle2, Loader2 } from "lucide-react";

export type WorkflowStepShape = {
  id: string;
  instanceId: string;
  label: string;
  status: string;
  role: string;
};

type RealTaskItemProps = {
  instanceId: string;
  step: WorkflowStepShape;
  userId?: string;
};

export function RealTaskItem({ instanceId, step, userId = "demo-user" }: RealTaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const { id: stepId, label, status } = step;

  const handleComplete = () => {
    startTransition(async () => {
      await completeWorkflowStep(instanceId, stepId, userId);
    });
  };

  return (
    <div className={`p-3.5 rounded-2xl border transition-all duration-500 ${
      status === 'COMPLETED' ? 'opacity-40 border-emerald-500/20 bg-emerald-500/10' : 
      status === 'READY' ? 'opacity-100 border-white/10 bg-white/5 shadow-lg cursor-pointer hover:border-blue-500' : 
      'opacity-10 grayscale blur-[0.5px] pointer-events-none'
    }`}>
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-bold ${status === 'COMPLETED' ? 'line-through text-slate-600' : 'text-slate-100'}`}>
          {label}
        </span>
        
        {/* ACTION TRIGGER */}
        {status === 'READY' && !isPending && (
          <button 
            onClick={handleComplete}
            className="text-[9px] bg-blue-600 text-white px-2 py-1 rounded-md font-black hover:bg-blue-500 transition-colors"
          >
            EXECUTE
          </button>
        )}

        {isPending && <Loader2 size={12} className="text-blue-500 animate-spin" />}
        {status === 'COMPLETED' && (
          <span className="flex items-center gap-1 text-emerald-500 text-[9px] font-bold">
            <CheckCircle2 size={12} /> ✓ Verified
          </span>
        )}
      </div>
    </div>
  );
}