import { prisma } from './prisma.js';

export async function seedRolePermissions() {
  console.log('Seeding role permissions...');

  const superAdminRole = await prisma.role.findUnique({
    where: {
      name: 'SUPER_ADMIN',
    },
  });

  const teacherRole = await prisma.role.findUnique({
    where: {
      name: 'TEACHER',
    },
  });

  const parentRole = await prisma.role.findUnique({
    where: {
      name: 'PARENT',
    },
  });

  const bursarRole = await prisma.role.findUnique({
    where: {
      name: 'BURSAR',
    },
  });

  const secretaryRole = await prisma.role.findUnique({
    where: {
      name: 'SECRETARY',
    },
  });

  const actionsAll = await prisma.permission.findUnique({
    where: {
      name: 'actions.all',
    },
  });

  const studentCreate = await prisma.permission.findUnique({
    where: {
      name: 'students.create',
    },
  });

  const studentView = await prisma.permission.findUnique({
    where: {
      name: 'students.view',
    },
  });

  const teacherView = await prisma.permission.findUnique({
    where: {
      name: 'teachers.view',
    },
  });

  const feeStructuresView = await prisma.permission.findUnique({
    where: { name: 'finance.fee-structures.view' },
  });

  const feeStructuresManage = await prisma.permission.findUnique({
    where: { name: 'finance.fee-structures.manage' },
  });

  const financeClerkRole = await prisma.role.findUnique({
    where: { name: 'FINANCE_CLERK' },
  });

  const financeAccountsView = await prisma.permission.findUnique({
    where: { name: 'finance.accounts.view' },
  });
  const financePaymentsCreate = await prisma.permission.findUnique({
    where: { name: 'finance.payments.create' },
  });
  const financeView = await prisma.permission.findUnique({ where: { name: 'finance.view' } });
  const financePaymentsView = await prisma.permission.findUnique({ where: { name: 'finance.payments.view' } });
  const financeExpensesView = await prisma.permission.findUnique({ where: { name: 'finance.expenses.view' } });
  const financeExpensesCreate = await prisma.permission.findUnique({ where: { name: 'finance.expenses.create' } });
  const financeIncomeView = await prisma.permission.findUnique({ where: { name: 'finance.income.view' } });
  const financeIncomeCreate = await prisma.permission.findUnique({ where: { name: 'finance.income.create' } });
  const financeReportsView = await prisma.permission.findUnique({ where: { name: 'finance.reports.view' } });

  if (
    !superAdminRole ||
    !teacherRole ||
    !parentRole ||
    !bursarRole ||
    !secretaryRole ||
    !financeClerkRole
  ) {
    throw new Error('Roles missing. Run roles seed first.');
  }

  if (
    !actionsAll ||
    !studentCreate ||
    !studentView ||
    !teacherView ||
    !feeStructuresView ||
    !feeStructuresManage ||
    !financeAccountsView ||
    !financePaymentsCreate ||
    !financeView ||
    !financePaymentsView ||
    !financeExpensesView ||
    !financeExpensesCreate ||
    !financeIncomeView ||
    !financeIncomeCreate ||
    !financeReportsView
  ) {
    throw new Error('Permissions missing. Run permissions seed first.');
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

    // BURSAR
    {
      roleId: bursarRole.id,
      permissionId: feeStructuresView.id,
    },
    {
      roleId: bursarRole.id,
      permissionId: financeAccountsView.id,
    },
    {
      roleId: bursarRole.id,
      permissionId: financePaymentsCreate.id,
    },
    { roleId: bursarRole.id, permissionId: financeView.id },
    { roleId: bursarRole.id, permissionId: financePaymentsView.id },
    { roleId: bursarRole.id, permissionId: financeExpensesView.id },
    { roleId: bursarRole.id, permissionId: financeExpensesCreate.id },
    { roleId: bursarRole.id, permissionId: financeIncomeView.id },
    { roleId: bursarRole.id, permissionId: financeIncomeCreate.id },
    { roleId: bursarRole.id, permissionId: financeReportsView.id },

    // FINANCE CLERK
    { roleId: financeClerkRole.id, permissionId: feeStructuresView.id },
    { roleId: financeClerkRole.id, permissionId: financeAccountsView.id },
    { roleId: financeClerkRole.id, permissionId: financePaymentsView.id },
    { roleId: financeClerkRole.id, permissionId: financePaymentsCreate.id },
    { roleId: financeClerkRole.id, permissionId: financeExpensesView.id },
    { roleId: financeClerkRole.id, permissionId: financeExpensesCreate.id },
    { roleId: financeClerkRole.id, permissionId: financeView.id },
    { roleId: financeClerkRole.id, permissionId: financeIncomeView.id },
    { roleId: financeClerkRole.id, permissionId: financeIncomeCreate.id },
    { roleId: financeClerkRole.id, permissionId: financeReportsView.id },

    // SECRETARY
    {
      roleId: secretaryRole.id,
      permissionId: feeStructuresView.id,
    },
    {
      roleId: secretaryRole.id,
      permissionId: financeAccountsView.id,
    },
  ];

  // Bursars may view fee structures but cannot change them.
  await prisma.rolePermission.deleteMany({
    where: { roleId: bursarRole.id, permissionId: feeStructuresManage.id },
  });

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

  console.log('Role permissions completed.');
}
