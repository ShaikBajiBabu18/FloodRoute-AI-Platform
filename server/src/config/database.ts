import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('[Database] Connected successfully to storage engine.');
  } catch (err) {
    console.error('[Database] Connection failure:', err);
    throw err;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
