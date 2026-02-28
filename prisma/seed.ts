import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.task.createMany({
    data: [
      { title: "Setup Project", description: "Initialize Next.js and Prisma", status: "COMPLETED" },
      { title: "Design Schema", description: "Define the Task Union types", status: "IN_PROGRESS" },
      { title: "Deploy to Vercel", description: "Waiting for API keys", status: "BLOCKED", blockedReason: "Missing Vercel Token" }
    ]
  })
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })