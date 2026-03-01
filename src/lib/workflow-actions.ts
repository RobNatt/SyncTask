"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function completeWorkflowStep(
  instanceId: string,
  stepId: string,
  userId: string,
  data?: unknown
) {
  return await db.$transaction(async (tx) => {
    const txStepState = (tx as unknown as {
      stepState: {
        update: (arg: object) => Promise<unknown>;
        findMany: (arg: object) => Promise<{ id: string; status: string; node: { dependencies: { id: string }[] } }[]>;
        findUnique: (arg: object) => Promise<{ nodeId: string } | null>;
      };
    }).stepState;

    await txStepState.update({
      where: { id: stepId },
      data: {
        status: "COMPLETED",
        completedBy: userId,
        data: (data as object) ?? {},
      },
    });

    const completedStep = await txStepState.findUnique({
      where: { id: stepId },
      select: { nodeId: true },
    });
    const completedNodeId = completedStep?.nodeId;
    if (!completedNodeId) return { success: true };

    const dependentSteps = await txStepState.findMany({
      where: {
        instanceId,
        status: "LOCKED",
        node: {
          dependencies: {
            some: { id: completedNodeId },
          },
        },
      },
      include: {
        node: { include: { dependencies: true } },
      },
    });

    for (const step of dependentSteps) {
      const allPrereqs = await txStepState.findMany({
        where: {
          instanceId,
          nodeId: { in: step.node.dependencies.map((d: { id: string }) => d.id) },
        },
      });
      const isNowReady = allPrereqs.every((p: { status: string }) => p.status === "COMPLETED");
      if (isNowReady) {
        await txStepState.update({
          where: { id: step.id },
          data: { status: "READY" },
        });
      }
    }

    revalidatePath(`/workflow/${instanceId}`);
    return { success: true };
  });
}

export async function rejectTaskAction(instanceId: string, stepId: string) {
  return await db.$transaction(async (tx) => {
    const txDb = tx as unknown as {
      stepState: {
        update: (arg: object) => Promise<unknown>;
        create: (arg: object) => Promise<unknown>;
      };
      workflowInstance: { findUnique: (arg: object) => Promise<{ templateId: string } | null> };
      workflowNode: { create: (arg: object) => Promise<{ id: string }> };
    };

    // 1. Mark the current step as FAILED
    await txDb.stepState.update({
      where: { id: stepId },
      data: { status: "FAILED" },
    });

    // 2. Create remediation node and step state
    const instance = await txDb.workflowInstance.findUnique({
      where: { id: instanceId },
      select: { templateId: true },
    });
    if (!instance) {
      revalidatePath(`/workflow/${instanceId}`);
      return;
    }

    const remediationNode = await txDb.workflowNode.create({
      data: {
        templateId: instance.templateId,
        name: "✦ REMEDIATION: Fix Data Integrity",
        requiredRole: "PRIMARY_ACTOR",
      },
    });

    await txDb.stepState.create({
      data: {
        instanceId,
        nodeId: remediationNode.id,
        status: "READY",
      },
    });

    revalidatePath(`/workflow/${instanceId}`);
  });
}