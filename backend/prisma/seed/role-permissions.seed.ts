import { prisma } from "./prisma.js";


export async function seedRolePermissions() {

  console.log("Seeding role permissions...");


  const superAdminRole = await prisma.role.findUnique({
    where: {
      name: "SUPER_ADMIN",
    },
  });


  const teacherRole = await prisma.role.findUnique({
    where: {
      name: "TEACHER",
    },
  });


  const parentRole = await prisma.role.findUnique({
    where: {
      name: "PARENT",
    },
  });



  const actionsAll = await prisma.permission.findUnique({
    where: {
      name: "actions.all",
    },
  });


  const studentCreate = await prisma.permission.findUnique({
    where: {
      name: "students.create",
    },
  });


  const studentView = await prisma.permission.findUnique({
    where: {
      name: "students.view",
    },
  });


  const teacherView = await prisma.permission.findUnique({
    where: {
      name: "teachers.view",
    },
  });



  if (!superAdminRole || !teacherRole || !parentRole) {
    throw new Error("Roles missing. Run roles seed first.");
  }


  if (!actionsAll || !studentCreate || !studentView || !teacherView) {
    throw new Error("Permissions missing. Run permissions seed first.");
  }



  const rolePermissions = [


    // SUPER ADMIN
    {
      roleId: superAdminRole.id,
      permissionId: actionsAll.id,
    },


    // TEACHER
    {
      roleId: teacherRole.id,
      permissionId: studentView.id,
    },

    {
      roleId: teacherRole.id,
      permissionId: teacherView.id,
    },


    // PARENT
    {
      roleId: parentRole.id,
      permissionId: studentView.id,
    },


  ];



  for (const item of rolePermissions) {


    await prisma.rolePermission.upsert({

      where: {

        roleId_permissionId: {

          roleId: item.roleId,

          permissionId: item.permissionId,

        },

      },


      update: {},


      create: item,

    });


  }


  console.log("Role permissions completed.");

}