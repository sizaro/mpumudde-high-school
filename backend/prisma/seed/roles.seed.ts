import { prisma } from "./prisma.js";


export async function seedRoles() {

  console.log("Seeding roles...");


  const roles = [
    {
      name: "SUPER_ADMIN",
      description:
        "Full system access. Hidden from UI and cannot be modified.",
    },

    {
      name: "TEACHER",
      description:
        "Teacher access role.",
    },

    {
      name: "PARENT",
      description:
        "Parent access role.",
    },
  ];


  for (const role of roles) {

    await prisma.role.upsert({

      where: {
        name: role.name,
      },

      update: {},

      create: role,

    });


    console.log(`Role checked: ${role.name}`);

  }


  console.log("Roles completed.");

}