import type { StudentAccountDetails } from "../../../../services/studentAccountService";
import { formatKampalaDateTime } from "../../../../utils/kampalaDateTime";
export default function StudentPaymentHistory({
  payments,
}: {
  payments: StudentAccountDetails["payments"];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Receipt / reference</th>
            <th className="px-4 py-3">Fee</th>
            <th className="px-4 py-3">Method</th>
            <th className="px-4 py-3">Recorded by</th>
            <th className="px-4 py-3">Proof</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Transaction</th>
            <th className="px-4 py-3">Fee progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {payments.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-6 text-center text-slate-500">
                No payments recorded.
              </td>
            </tr>
          ) : (
            payments.map((payment) => {
              const chargeStatus =
                payment.studentCharge?.status?.replaceAll("_", " ") ?? "—";
              const chargeBalance = payment.studentCharge
                ? payment.studentCharge.expectedAmount -
                  payment.studentCharge.paidAmount -
                  payment.studentCharge.waivedAmount
                : null;
              return (
                <tr
                  key={payment.id}
                  className={payment.status === "REVERSED" ? "bg-rose-50" : ""}
                >
                  <td className="px-4 py-3">
                    {formatKampalaDateTime(payment.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span>{payment.receiptNumber ?? "—"}</span>
                    <span className="block text-xs text-slate-500">
                      {payment.transactionReference}
                    </span>
                  </td>
                  <td className="px-4 py-3">{payment.feeType?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {payment.method.replaceAll("_", " ")}
                  </td>
                  <td className="px-4 py-3">
                    {payment.recordedBy?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {payment.proofUrl ? (
                      <a
                        href={payment.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View proof
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    UGX {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800">
                      {chargeStatus}
                    </span>
                    {chargeBalance !== null && (
                      <div className="mt-1 text-xs text-slate-500">
                        Balance: UGX {chargeBalance.toLocaleString()}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
