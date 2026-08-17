import { useState } from "react";
import type { StudentAccountDetails } from "../../../../services/studentAccountService";
import { formatKampalaDateTime } from "../../../../utils/kampalaDateTime";
import ProofPreviewModal, { type ProofPreview } from "../payments/ProofPreviewModal";
export default function StudentPaymentHistory({
  payments,
}: {
  payments: StudentAccountDetails["payments"];
}) {
  const [proof, setProof] = useState<ProofPreview | null>(null);
  return (
    <><div className="overflow-x-auto rounded-2xl border border-slate-200">
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
                  className={payment.status === "REVERSED" ? "!bg-rose-50" : ""}
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
                      <button
                        type="button"
                        onClick={() => setProof({ url: payment.proofUrl!, fileName: payment.proofFileName })}
                        className="portal-link rounded-lg px-2 py-1 hover:bg-sky-50"
                      >
                        View proof
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    UGX {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`portal-status ${payment.status === "REVERSED" ? "portal-status--danger" : payment.status === "COMPLETED" ? "portal-status--success" : "portal-status--warning"}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`portal-status ${chargeStatus.toUpperCase().includes("PAID") ? "portal-status--success" : "portal-status--info"}`}>
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
    </div><ProofPreviewModal proof={proof} onClose={() => setProof(null)} /></>
  );
}
