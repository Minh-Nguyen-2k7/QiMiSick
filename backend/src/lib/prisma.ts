import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

// Prevent TypeScript compiler from complaining about the global variable layout contract
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        // 1. ADD THE PORT OPTION (Crucial since Aiven uses 17202)
        port: Number(process.env.DATABASE_PORT) || 17202,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5, // 5 slots is perfectly healthy for single-user dev environments
        allowPublicKeyRetrieval: true,
        // 2. ENFORCE SSL FOR AIVEN CLOUD
        ssl: true,
    });

    globalForPrisma.prisma = new PrismaClient({ adapter });
}

prisma = globalForPrisma.prisma;
export { prisma };