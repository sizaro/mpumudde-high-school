import { prisma } from './prisma.js';

export async function seedPermissions() {
  console.log('Seeding permissions...');

  const permissions = [
    {
      name: 'actions.all',
      description: 'Full system access. Bypasses all permission checks.',
    },

    // Students
    {
      name: 'students.create',
      description: 'Create students',
    },

    {
      name: 'students.view',
      description: 'View students',
    },

    {
      name: 'students.update',
      description: 'Update students',
    },

    // Teachers
    {
      name: 'teachers.create',
      description: 'Create teachers',
    },

    {
      name: 'teachers.view',
      description: 'View teachers',
    },

    // Finance
    {
      name: 'finance.view',
      description: 'View finance records',
    },

    {
      name: 'finance.approve',
      description: 'Approve financial transactions',
    },

    {
      name: 'finance.fee-structures.view',
      description: 'View finance fee structures',
    },

    {
      name: 'finance.fee-structures.manage',
      description: 'Create and update finance fee structures',
    },

    {
      name: 'finance.accounts.view',
      description: 'View student financial accounts and statements',
    },
    {
      name: 'finance.payments.create',
      description: 'Record student payments and upload payment evidence',
    },
    {
      name: 'finance.payments.view',
      description: 'View student payment records and receipts',
    },
    {
      name: 'finance.payments.edit',
      description: 'Edit permitted payment details',
    },
    {
      name: 'finance.payments.reverse',
      description: 'Reverse approved payments without deleting audit history',
    },
    {
      name: 'finance.expenses.view',
      description: 'View school expense records',
    },
    {
      name: 'finance.expenses.create',
      description: 'Record school expenses and upload evidence',
    },
    {
      name: 'finance.income.view',
      description: 'View non-student school income',
    },
    {
      name: 'finance.income.create',
      description: 'Record non-student school income and evidence',
    },
    {
      name: 'finance.payroll.view',
      description: 'View teacher payroll records',
    },
    {
      name: 'finance.payroll.manage',
      description: 'Generate teacher payroll payments',
    },
    {
      name: 'finance.reports.view',
      description: 'View finance reports',
    },

    // Reports
    {
      name: 'reports.view',
      description: 'View system reports',
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },

      update: {},

      create: permission,
    });

    console.log(`Permission checked: ${permission.name}`);
  }

  console.log('Permissions completed.');
}
