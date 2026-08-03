import type { FinanceStructure } from "../../../../services/feeStructureService";

type Props = {
  structure: FinanceStructure | null;
};

const fieldRow = (label: string, value: string) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
  </div>
);

export default function FeeStructureDetails({ structure }: Props) {
  if (!structure) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Select a fee structure to inspect its full record and audit details.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Fee Structure Details
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fieldRow(
          "Academic year",
          structure.academicYear?.name ?? structure.academicYearId,
        )}
        {fieldRow("Term", structure.term?.name ?? structure.termId)}
        {fieldRow("Class", structure.schoolClass?.name ?? structure.classId)}
        {fieldRow(
          "Student category",
          structure.studentCategory?.name ?? structure.studentCategoryId,
        )}
        {fieldRow("Fee type", structure.feeType?.name ?? structure.feeTypeId)}
        {fieldRow(
          "Expected amount",
          `UGX ${structure.expectedAmount.toLocaleString()}`,
        )}
        {fieldRow("Status", structure.isActive ? "Active" : "Inactive")}
        {fieldRow("Created by", structure.createdBy?.email ?? "System")}
        {fieldRow("Updated by", structure.updatedBy?.email ?? "System")}
        {fieldRow("Created at", new Date(structure.createdAt).toLocaleString())}
        {fieldRow("Updated at", new Date(structure.updatedAt).toLocaleString())}
      </div>
    </div>
  );
}
