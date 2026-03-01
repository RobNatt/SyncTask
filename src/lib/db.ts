import { PrismaClient } from "../../generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL ?? "postgresql://localhost";
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });
export default db;
