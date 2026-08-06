import type { StudentAccountDetails } from "../../../../services/studentAccountService";
export default function StudentChargesTable({
  charges,
}: {
  charges: StudentAccountDetails["charges"];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">Fee</th>
            <th className="px-4 py-3">Expected</th>
            <th className="px-4 py-3">Paid</th>
            <th className="px-4 py-3">Balance</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Proof</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {charges.map((charge) => {
            const latestProof = (charge.payments ?? []).find(
              (payment) => payment.proofUrl,
            );
            const balance =
              charge.expectedAmount - charge.paidAmount - charge.waivedAmount;
            return (
              <tr key={charge.id}>
                <td className="px-4 py-3 text-slate-800">
                  {charge.financeStructure.feeType.name}
                  <span className="block text-xs text-slate-500">
                    {charge.financeStructure.term.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  UGX {charge.expectedAmount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  UGX {charge.paidAmount.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-semibold">
                  UGX {balance.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                    {charge.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {latestProof?.proofUrl ? (
                    <a
                      href={latestProof.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View proof
                      {(charge.payments?.length ?? 0) > 1
                        ? ` (${charge.payments?.length})`
                        : ""}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
