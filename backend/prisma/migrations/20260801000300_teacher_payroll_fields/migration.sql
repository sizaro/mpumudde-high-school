-- Extends audited expenses with teacher payroll details. Existing expenses are preserved.
ALTER TABLE "Expense" ADD COLUMN "payrollPeriod" TEXT;
ALTER TABLE "Expense" ADD COLUMN "basicSalary" INTEGER;
ALTER TABLE "Expense" ADD COLUMN "allowances" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Expense" ADD COLUMN "deductions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Expense" ADD COLUMN "advances" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Expense" ADD COLUMN "grossPay" INTEGER;
ALTER TABLE "Expense" ADD COLUMN "netPay" INTEGER;

CREATE UNIQUE INDEX "Expense_teacherId_payrollPeriod_category_key"
ON "Expense"("teacherId", "payrollPeriod", "category");
