import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Populating missing academic data...');

  // Get the existing academic year
  const academicYear = await prisma.academicYear.findFirst({
    where: { name: '2027' },
  });

  if (!academicYear) {
    console.log('Academic year 2027 not found!');
    return;
  }

  // Check for existing terms and create missing ones
  const terms = await prisma.term.findMany({
    where: { academicYearId: academicYear.id },
  });

  const termNames = terms.map((t) => t.name);
  console.log('Existing terms:', termNames);

  // Create Term 2 if not exists
  if (!termNames.includes('Term 2')) {
    await prisma.term.create({
      data: {
        name: 'Term 2',
        academicYearId: academicYear.id,
        feeAmount: 0,
        startDate: new Date('2027-05-01'),
        endDate: new Date('2027-08-01'),
        isActive: true,
      },
    });
    console.log('✓ Created Term 2');
  }

  // Create Term 3 if not exists
  if (!termNames.includes('Term 3')) {
    await prisma.term.create({
      data: {
        name: 'Term 3',
        academicYearId: academicYear.id,
        feeAmount: 0,
        startDate: new Date('2027-08-15'),
        endDate: new Date('2027-11-30'),
        isActive: true,
      },
    });
    console.log('✓ Created Term 3');
  }

  // Check for existing classes and create missing ones
  const classes = await prisma.schoolClass.findMany();
  const classNames = classes.map((c) => c.name);
  console.log('Existing classes:', classNames);

  // Create Senior 2-6 if not exists
  const seniorClasses = ['Senior 2', 'Senior 3', 'Senior 4', 'Senior 5', 'Senior 6'];
  for (const className of seniorClasses) {
    if (!classNames.includes(className)) {
      await prisma.schoolClass.create({
        data: {
          name: className,
          isActive: true,
        },
      });
      console.log(`✓ Created ${className}`);
    }
  }

  console.log('✓ Data population complete!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
