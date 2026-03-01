import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const instanceId = req.nextUrl.searchParams.get("instanceId");
  if (!instanceId) {
    return NextResponse.json(
      { error: "Missing instanceId" },
      { status: 400 }
    );
  }

  try {
    const stepStates = await db.stepState.findMany({
      where: { instanceId },
      include: {
        node: { select: { name: true, requiredRole: true } },
      },
    });

    const steps = stepStates.map((s) => ({
      id: s.id,
      instanceId: s.instanceId,
      label: s.node.name,
      status: s.status,
      role: s.node.requiredRole,
    }));

    return NextResponse.json(steps);
  } catch (err) {
    console.error("[workflow/status]", err);
    return NextResponse.json(
      { error: "Failed to fetch workflow status" },
      { status: 500 }
    );
  }
}
