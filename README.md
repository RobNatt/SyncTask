🚀 SYNCRONICITY: The Agnostic Logic Engine
Syncronicity is a high-performance, configuration-driven orchestration engine designed for mission-critical industries. It replaces static "To-Do" lists with a Dynamic Chain of Command that self-heals during failures.

💎 The Value Proposition
Zero-Code Onboarding: Deploy complex workflows for new industries (Healthcare, Legal, Finance) by simply updating a JSON manifest.

Synchronous Integrity: Using Prisma Transactions, the system ensures tasks are only unlocked when strict dependencies are met.

Automated Remediation: When a Quality Control (QC) officer rejects work, the engine programmatically generates new "Remediation Nodes" to fix the error.

Context-Aware UI: A high-fidelity, "Obsidian-style" interface that provides real-time visual feedback on bottlenecks and priority overrides.

🏗️ Technical Architecture
The system is split into two distinct operational zones:

1. The Sales Engine (/)
A cinematic, 120-second simulation of the engine under "Battle Stress."

Tech: Framer Motion + React State.

Narrative: Demonstrates initial mapping, a critical QC failure, dynamic task generation, and final recovery.

2. The Production Proof (/workflow/[id])
A live, backend-connected dashboard that proves the "Synchronicity" logic.

Tech: Next.js Server Actions + TanStack Query + Supabase.

Function: Real-time database polling (1.5s interval) ensures that when an Architect clicks "Execute," the Engineer's screen unlocks instantly across the globe.

📂 Final File Directory
Plaintext

src/
├── app/
│   ├── page.tsx               # Cinematic Sales Landing Page
│   └── workflow/[id]/
│       └── page.tsx           # Real-Time Operational Dashboard
├── components/
│   ├── demo/
│   │   └── SalesLoop.tsx      # The 120s Simulation Component
│   └── workflow/
│       ├── RealTaskItem.tsx   # Production-ready Task Action logic
│       └── ReviewerActions.tsx# The Rejection/Remediation Trigger
├── lib/
│   ├── prisma.ts              # Database Client
│   ├── workflow-actions.ts    # Server Actions (The Muscle)
│   └── workflow-config.ts     # The Master Manifest (The Brain)
└── prisma/
    └── schema.prisma          # Relational State Vault
🛠️ Deployment: Adding a New Industry
To pivot the entire application to a new sector (e.g., from "Tech Integration" to "Real Estate Closing"), simply modify the workflow.config.ts:

TypeScript

// Example: Adding a new logic node
{
  id: "LEGAL_REVIEW",
  role: "QC",
  dependsOn: ["TITLE_SEARCH"],
  onReject: "RE_ISSUE_DOCS" // The engine handles the rest.
}