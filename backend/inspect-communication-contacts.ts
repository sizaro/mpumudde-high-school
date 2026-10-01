import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const rows = await prisma.communicationContact.findMany({
    where: {
      ownerType: {
        in: ['PARENT', 'TEACHER'],
      },
    },
    select: {
      id: true,
      ownerType: true,
      ownerId: true,
      kind: true,
      value: true,
      isPrimary: true,
      isVerified: true,
      verifiedAt: true,
      verificationDeliveryStatus: true,
    },
    orderBy: [
      { ownerType: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  console.dir(rows, { depth: null });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
