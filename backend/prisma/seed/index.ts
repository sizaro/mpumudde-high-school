import { prisma } from './prisma.js';
import { seedRoles } from './roles.seed.js';
import { seedPermissions } from './permissions.seed.js';
import { seedRolePermissions } from './role-permissions.seed.js';
import { seedDirector } from './director.seed.js';
import { seedDocumentCategories } from './document-categories.seed.js';

async function main() {
  await seedRoles();

  await seedPermissions();

  await seedRolePermissions();

  await seedDirector();

  await seedDocumentCategories();
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
