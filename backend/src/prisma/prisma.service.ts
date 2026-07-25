import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    console.log('Connecting Prisma...');

    await this.$connect();

    console.log('Prisma connected.');

    const result = await this.$queryRaw`
      SELECT current_user, current_database();
    `;

    console.log(result);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}