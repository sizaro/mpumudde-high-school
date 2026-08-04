import { Eye, Pencil, Power, Users } from "lucide-react";
import type { FinanceStructure } from "../../../../services/feeStructureService";

type Props = {
  feeStructures: FinanceStructure[];
  loading: boolean;
  canManage: boolean;
  onView: (structure: FinanceStructure) => void;
  onEdit: (structure: FinanceStructure) => void;
  onToggleStatus: (
    structure: FinanceStructure,
    isActive: boolean,
  ) => Promise<void>;
  onReload: () => Promise<void>;
  onApply: (structure: FinanceStructure) => Promise<void>;
};

export default function FeeStructureTable({
  feeStructures,
  loading,
  canManage,
  onView,
  onEdit,
  onToggleStatus,
  onReload,
  onApply,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            All structures
          </h3>
          <p className="text-sm text-slate-500">
            Search results are filtered above and saved state survives refresh.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void onReload()}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Structure</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Audit</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Loading fee structures...
                </td>
              </tr>
            ) : feeStructures.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No fee structures found.
                </td>
              </tr>
            ) : (
              feeStructures.map((structure) => (
                <tr key={structure.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">
                        {structure.academicYear?.name} · {structure.term?.name}
                      </p>
                      <p className="text-slate-500">
                        {structure.schoolClass?.name} ·{" "}
                        {structure.studentCategory?.name} ·{" "}
                        {structure.feeType?.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    UGX {structure.expectedAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${structure.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {structure.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div>
                      {structure.updatedBy?.email ??
                        structure.createdBy?.email ??
                        "System"}
                    </div>
                    <div>
                      {new Date(structure.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onView(structure)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <Eye size={16} /> View
                      </button>
                      {canManage ? (
                        <button
                          type="button"
                          onClick={() => void onApply(structure)}
                          className="inline-flex items-center gap-2 rounded-xl border border-sky-200 px-3 py-2 text-sky-700 hover:bg-sky-50"
                        >
                          <Users size={16} /> Apply
                        </button>
                      ) : null}
                      {canManage ? (
                        <button
                          type="button"
                          onClick={() => onEdit(structure)}
                          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-3 py-2 text-amber-700 hover:bg-amber-50"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                      ) : null}
                      {canManage ? (
                        <button
                          type="button"
                          onClick={() =>
                            void onToggleStatus(structure, !structure.isActive)
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
                        >
                          <Power size={16} />{" "}
                          {structure.isActive ? "Deactivate" : "Activate"}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
