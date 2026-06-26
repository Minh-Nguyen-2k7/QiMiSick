import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

// Prevent TypeScript compiler from complaining about the global variable layout contract
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5, // 5 slots is perfectly healthy for single-user dev environments
        allowPublicKeyRetrieval: true,
    });

    globalForPrisma.prisma = new PrismaClient({ adapter });
}

prisma = globalForPrisma.prisma;
export { prisma };