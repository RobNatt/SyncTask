"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function completeWorkflowStep(
  instanceId: string, 
  stepId: string, 
  userId: string,
  data?: any
) {
  try {
    return await db.$transaction(async (tx) => {
      const stepState = (tx as unknown as { stepState: { update: (arg: object) => Promise<unknown>; findMany: (arg: object) => Promise<{ id: string; status: string; node: { dependencies: { id: string }[] } }[]> } }).stepState;
      // 1. Mark the current step as COMPLETED
      await stepState.update({
        where: { 
          // Assuming a unique constraint on instanceId and nodeId
          id: stepId 
        },
        data: {
          status: "COMPLETED",
          completedBy: userId,
          data: data || {},
        },
      });

      // 2. Find all steps in this instance that DEPEND on the one we just finished
      const dependentSteps = await stepState.findMany({
        where: {
          instanceId: instanceId,
          status: "LOCKED",
          node: {
            dependencies: {
              some: { id: stepId }
            }
          }
        },
        include: {
          node: {
            include: { dependencies: true }
          }
        }
      });

      // 3. Check each dependent step: Are ALL its prerequisites now COMPLETED?
      for (const step of dependentSteps) {
        const allPrereqs = await stepState.findMany({
          where: {
            instanceId: instanceId,
            nodeId: { in: step.node.dependencies.map((d: { id: string }) => d.id) }
          }
        });

        const isNowReady = allPrereqs.every((p) => p.status === "COMPLETED");

        if (isNowReady) {
          await stepState.update({
            where: { id: step.id },
            data: { status: "READY" }
          });
        }
      }

      revalidatePath(`/workflow/${instanceId}`);
      return { success: true };
    });
  } catch (error) {
    console.error("Workflow Transition Error:", error);
    return { success: false, error: "Failed to transition workflow state." };
  }
}