import { prisma } from "./prisma.js";


export async function seedPermissions() {

  console.log("Seeding permissions...");


  const permissions = [

    {
  name: "actions.all",
  description: "Full system access. Bypasses all permission checks.",
},

    // Students
    {
      name: "students.create",
      description: "Create students",
    },

    {
      name: "students.view",
      description: "View students",
    },

    {
      name: "students.update",
      description: "Update students",
    },


    // Teachers
    {
      name: "teachers.create",
      description: "Create teachers",
    },

    {
      name: "teachers.view",
      description: "View teachers",
    },


    // Finance
    {
      name: "finance.view",
      description: "View finance records",
    },

    {
      name: "finance.approve",
      description: "Approve financial transactions",
    },


    // Reports
    {
      name: "reports.view",
      description: "View system reports",
    },


  ];


  for (const permission of permissions) {


    await prisma.permission.upsert({

      where:{
        name: permission.name,
      },


      update:{},


      create: permission,

    });


    console.log(
      `Permission checked: ${permission.name}`
    );

  }


  console.log("Permissions completed.");

}