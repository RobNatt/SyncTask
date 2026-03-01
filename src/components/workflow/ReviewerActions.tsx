"use client";

import { useTransition } from 'react';
import { rejectTaskAction } from '@/lib/workflow-actions';
import { XCircle, CheckCircle, Loader2 } from "lucide-react";

export function ReviewerActions({ instanceId, targetStepId }: { instanceId: string; targetStepId?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleReject = () => {
    if (!targetStepId) return;
    startTransition(async () => {
      await rejectTaskAction(instanceId, targetStepId);
    });
  };

  return (
    <div className="space-y-4 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
      <p className="text-[10px] font-black text-white uppercase opacity-70">Review Authority</p>
      <div className="flex gap-2">
        <button 
          onClick={handleReject}
          disabled={isPending || !targetStepId}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
          REJECT & REBOUND
        </button>
      </div>
    </div>
  );
}