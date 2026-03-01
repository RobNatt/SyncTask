import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ClinicalManifest } from '../src/types/workflow.config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
// Prisma 7 + adapter: generated model delegates omitted from PrismaClient type; cast for runtime access
const prisma = new PrismaClient({ adapter }) as unknown as {
  tenant: { upsert: (arg: object) => Promise<{ id: string }> };
  workflowTemplate: { create: (arg: object) => Promise<{ id: string }> };
  workflowNode: {
    create: (arg: object) => Promise<{ id: string }>;
    update: (arg: object) => Promise<unknown>;
  };
  workflowInstance: { create: (arg: object) => Promise<{ id: string }> };
  stepState: { createMany: (arg: object) => Promise<{ count: number }> };
  $disconnect: () => Promise<void>;
};

async function main() {
  console.log('🚀 Starting Agnostic Workflow Seeding...');

  // 1. Create a Tenant (The Client)
  const tenant = await prisma.tenant.upsert({
    where: { id: 'org_123' },
    update: {},
    create: {
      id: 'org_123',
      name: 'General Hospital System',
      industry: ClinicalManifest.industry,
    },
  });

  // 2. Create the Workflow Template
  const template = await prisma.workflowTemplate.create({
    data: {
      name: `${ClinicalManifest.industry} Standard Protocol`,
      tenantId: tenant.id,
    },
  });

  // 3. Create the Nodes (Stages)
  // We do this in two passes: First create nodes, then link dependencies.
  const nodeMap: Record<string, string> = {};

  for (const step of ClinicalManifest.steps) {
    const node = await prisma.workflowNode.create({
      data: {
        templateId: template.id,
        name: step.label,
        requiredRole: step.actor,
      },
    });
    nodeMap[step.id] = node.id;
  }

  // 4. Link the Dependencies (The Sync Logic)
  for (const step of ClinicalManifest.steps) {
    if (step.requires.length > 0) {
      await prisma.workflowNode.update({
        where: { id: nodeMap[step.id] },
        data: {
          dependencies: {
            connect: step.requires.map((reqId) => ({ id: nodeMap[reqId] })),
          },
        },
      });
    }
  }

  // 5. Create sample WorkflowInstances for /workflow/[id]
  const instance = await prisma.workflowInstance.create({
    data: {
      id: "test-instance",
      templateId: template.id,
      status: "ACTIVE",
    },
  });

  const stepStatesData = ClinicalManifest.steps.map((step) => ({
    instanceId: instance.id,
    nodeId: nodeMap[step.id],
    status: step.requires.length === 0 ? "READY" : "LOCKED",
  }));
  // DIAGNOSIS depends on VITALS + TECH_CHECK; set READY once we seed
  const diagIdx = ClinicalManifest.steps.findIndex((s) => s.id === "DIAGNOSIS");
  if (diagIdx >= 0) stepStatesData[diagIdx].status = "LOCKED";

  await prisma.stepState.createMany({
    data: stepStatesData,
  });

  console.log("✅ Seeding Complete. Workflow engine is ready for deployment.");
  console.log(`   Test at: /workflow/${instance.id}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
