import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';


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

  const result = await prisma.$queryRaw`
    SELECT current_user, current_database();
  `;

  console.log(result);


  const password = await bcrypt.hash(
    'director123',
    10,
  );


  const user = await prisma.user.create({

    data: {

      email: 'director@mpumudde.com',

      password,

      role: 'DIRECTOR',

      director: {
        create: {
          firstName: 'School',
          lastName: 'Director',
          phone: '0700000000',
        },
      },

    },

  });


  console.log(user);

}


main()
.then(() => {
  console.log('Seed complete');
})
.catch((error) => {
  console.error(error);
})
.finally(async () => {
  await prisma.$disconnect();
});