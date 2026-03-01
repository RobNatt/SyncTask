# SyncroTask — Agnostic Workflow Orchestration Engine

A high-performance, configuration-driven orchestration engine for mission-critical industries. Replace static task lists with a **Dynamic Chain of Command** that enforces dependencies and self-heals through automated remediation when quality checks fail.

## Features

- **Zero-code onboarding** — Deploy workflows for new industries (Healthcare, Legal, Finance) by updating a TypeScript manifest
- **Dependency gates** — Prisma transactions ensure tasks unlock only when prerequisites are met
- **Automated remediation** — QC rejection dynamically generates remediation nodes and routes work back through the pipeline
- **Real-time sync** — TanStack Query polling keeps all actors in sync across sessions
- **Role-based flow** — Steps are guarded by actor roles (Doctor, Nurse, MedTech, etc.)

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 15, React |
| Language | TypeScript |
| Database | PostgreSQL, Prisma 7 |
| Client state | TanStack Query |
| Styling | Tailwind CSS v4 |
| Testing | Playwright |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted, e.g. Vercel Postgres, Supabase, Neon)

### Install

```bash
git clone https://github.com/RobNatt/SyncTask.git
cd SyncTask
npm install
```

### Environment

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### Database Setup

```bash
# Apply schema
npm run db:push

# Seed workflow template + test instance
npm run db:seed:workflow
```

The seed prints a test instance ID, e.g. `Test at: /workflow/test-instance`.

### Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and sales simulation, or `/workflow/test-instance` for the live workflow dashboard.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing + SalesLoop demo
│   ├── tasks/page.tsx         # Task list (CRUD)
│   ├── workflow/[id]/page.tsx # Live workflow dashboard
│   └── api/workflow/status/   # Workflow state API
├── components/
│   ├── demo/
│   │   ├── SalesLoop.tsx      # 120s battle-stress simulation
│   │   └── PositionPane.tsx   # Role columns
│   └── workflow/
│       ├── RealTaskItem.tsx   # Execute / complete logic
│       └── ReviewerActions.tsx # Reject & remediate
├── lib/
│   ├── db.ts                 # Prisma client
│   └── workflow-actions.ts    # Server actions
└── types/
    └── workflow.config.ts    # Manifest (roles, steps, validation)
prisma/
├── schema.prisma
├── seed-workflow.ts          # Template + instance seed
└── seed.ts                   # Entry (delegates to seed-workflow)
```

## Configuration: Adding a New Industry

Edit `src/types/workflow.config.ts` to define roles and steps:

```typescript
export const ClinicalManifest: WorkflowConfig = {
  industry: "Healthcare",
  roles: [
    { id: 'PRIMARY_ACTOR', label: 'Doctor' },
    { id: 'SUPPORT_ACTOR', label: 'Nurse' },
    { id: 'TECHNICAL_ACTOR', label: 'MedTech' }
  ],
  steps: [
    { id: 'VITALS', label: 'Patient Vitals', actor: 'SUPPORT_ACTOR', requires: [], validation: (d) => !!d.bp },
    { id: 'TECH_CHECK', label: 'Machine Calibration', actor: 'TECHNICAL_ACTOR', requires: [], validation: (d) => d.status === 'OK' },
    { id: 'DIAGNOSIS', label: 'Final Diagnosis', actor: 'PRIMARY_ACTOR', requires: ['VITALS', 'TECH_CHECK'], validation: (d) => !!d.plan }
  ]
};
```

Re-run `npm run db:seed:workflow` after schema/manifest changes.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:seed:workflow` | Seed workflow template + instance |

## Deployment (Vercel)

1. Connect the repo to [Vercel](https://vercel.com).
2. Set `DATABASE_URL` in Project Settings → Environment Variables.
3. Deploy; `postinstall` runs `prisma generate` automatically.

## Testing

```bash
npx playwright test
```

Workflow logic tests expect a seeded `test-instance`. Run `npm run db:seed:workflow` first.

## License

MIT
