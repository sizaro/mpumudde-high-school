import 'dotenv/config';

import { PrismaClient } from '../generated/prisma/client.js';

import { PrismaPg } from '@prisma/adapter-pg';

import { Pool } from 'pg';


const pool = new Pool({

  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

});


const adapter = new PrismaPg(pool);


const prisma = new PrismaClient({
  adapter,
});


async function main() {

  const user = await prisma.user.findUnique({

    where: {
      email: 'director@mpumudde.com',
    },

    include: {

      roles: {

        include: {

          role: true,

        },

      },

      director: true,

    },

  });


  console.log(JSON.stringify(user, null, 2));

}


main()

.finally(async () => {

  await prisma.$disconnect();

});