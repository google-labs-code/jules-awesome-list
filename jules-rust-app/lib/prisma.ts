import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.warn("DATABASE_URL is missing. Using mock connection for build.");
    }
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
// export const prisma = {} as any;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
