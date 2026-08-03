import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import type { FinancePayment } from "../../../../services/paymentService";
import { formatKampalaDateTime } from "../../../../utils/kampalaDateTime";

type Props = {
  payments: FinancePayment[];
  loading: boolean;
  canEdit: boolean;
  canReverse: boolean;
  onView: (payment: FinancePayment) => void;
  onEdit: (payment: FinancePayment) => void;
  onReverse: (payment: FinancePayment) => void;
  onDelete: (payment: FinancePayment) => void;
};
export default function PaymentsTable({
  payments,
  loading,
  canEdit,
  canReverse,
  onView,
  onEdit,
  onReverse,
  onDelete,
}: Props) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
        <table className="w-max min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {[
                "Student",
                "Fee",
                "Academic period",
                "Class",
                "Receipt",
                "Date (EAT)",
                "Amount",
                "Method",
                "Status",
                "Actions",
              ].map((item) => (
                <th
                  key={item}
                  className="whitespace-nowrap px-4 py-4 font-semibold"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  Loading payments...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No payments match these filters.
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const structure = payment.studentCharge?.financeStructure;
                const status = payment.status.toUpperCase();
                const canDelete =
                  canEdit && ["DRAFT", "REJECTED"].includes(status);
                return (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="whitespace-nowrap font-medium text-slate-900">
                        {payment.student
                          ? `${payment.student.firstName} ${payment.student.lastName}`
                          : payment.studentId}
                      </p>
                      <p className="text-xs text-slate-500">
                        {payment.student?.admissionNumber}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {structure?.feeType?.name ?? payment.feeType?.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <p>{structure?.academicYear?.name ?? "Legacy"}</p>
                      <p className="text-xs text-slate-500">
                        {structure?.term?.name ?? "Period unavailable"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <p>{structure?.schoolClass?.name ?? "—"}</p>
                      <p className="text-xs text-slate-500">
                        {structure?.studentCategory?.name}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {payment.receiptNumber ?? "Legacy"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {formatKampalaDateTime(payment.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold">
                      UGX {payment.amount.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {payment.method.replaceAll("_", " ")}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          title="View payment"
                          onClick={() => onView(payment)}
                          className="rounded-lg p-2 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            title="Edit safe payment details"
                            onClick={() => onEdit(payment)}
                            className="rounded-lg p-2 text-amber-700 hover:bg-amber-50"
                          >
                            <Pencil size={17} />
                          </button>
                        )}
                        {canReverse && status === "COMPLETED" && (
                          <button
                            type="button"
                            title="Reverse payment"
                            onClick={() => onReverse(payment)}
                            className="rounded-lg p-2 text-rose-700 hover:bg-rose-50"
                          >
                            <RotateCcw size={17} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            title="Remove draft payment"
                            onClick={() => onDelete(payment)}
                            className="rounded-lg p-2 text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
