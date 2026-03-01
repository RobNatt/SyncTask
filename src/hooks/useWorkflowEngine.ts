import { useQuery } from '@tanstack/react-query';
import { WorkflowConfig, SystemRole } from '@/types/workflow.config';

export function useWorkflowEngine(instanceId: string, config: WorkflowConfig, userRole: SystemRole) {
  // 1. Fetch the current state of all steps for this instance from the Vault
  const { data: stepStates, isLoading } = useQuery({
    queryKey: ['workflow-instance', instanceId],
    queryFn: async () => {
      const response = await fetch(`/api/workflow/${instanceId}`);
      return response.json(); // Array of { nodeId: string, status: 'COMPLETED' | 'READY' | etc }
    }
  });

  // 2. The Logic Engine: Calculate what is locked or ready
  const processedSteps = config.steps.map(step => {
    // Check if the user has the right role for this specific step
    const hasRole = step.actor === userRole;

    // Check if all prerequisites are COMPLETED in the database
    const prerequisitesMet = step.requires.every(prereqId => {
      const prereqState = stepStates?.find((s: any) => s.nodeId === prereqId);
      return prereqState?.status === 'COMPLETED';
    });

    // Final State Determination
    const isLocked = !prerequisitesMet;
    const canInteract = hasRole && prerequisitesMet && !isLoading;

    return {
      ...step,
      isLocked,
      canInteract,
      currentStatus: stepStates?.find((s: any) => s.nodeId === step.id)?.status || 'LOCKED'
    };
  });

  return {
    steps: processedSteps,
    isFullyComplete: processedSteps.every(s => s.currentStatus === 'COMPLETED'),
    isLoading
  };
}