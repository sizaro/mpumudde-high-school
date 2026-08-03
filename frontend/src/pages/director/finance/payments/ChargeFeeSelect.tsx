import { useEffect, useMemo, useState } from "react";
import type { StudentAccountDetails } from "../../../../services/studentAccountService";

type Props = { account: StudentAccountDetails | null; value: string; onChange: (value: string) => void; loading: boolean };
type NamedItem = { id: string; name: string };
const uniqueItems = (items: NamedItem[]) => Array.from(new Map(items.map((item) => [item.id, item])).values());

export default function ChargeFeeSelect({ account, value, onChange, loading }: Props) {
  const [academicYearId, setAcademicYearId] = useState("");
  const [termId, setTermId] = useState("");
  const [classId, setClassId] = useState("");
  const [studentCategoryId, setStudentCategoryId] = useState("");
  const charges = useMemo(() => account?.charges ?? [], [account]);

  useEffect(() => {
    const currentYearId = account?.student.academicYear?.id ?? "";
    const currentTermId = account?.student.term?.id ?? "";
    const currentClassId = account?.student.schoolClass?.id ?? "";
    const currentCategoryId = account?.student.studentCategory?.id ?? "";
    setAcademicYearId(charges.some((charge) => charge.financeStructure.academicYear.id === currentYearId) ? currentYearId : "");
    setTermId(charges.some((charge) => charge.financeStructure.term.id === currentTermId) ? currentTermId : "");
    setClassId(charges.some((charge) => charge.financeStructure.schoolClass.id === currentClassId) ? currentClassId : "");
    setStudentCategoryId(charges.some((charge) => charge.financeStructure.studentCategory.id === currentCategoryId) ? currentCategoryId : "");
    onChange("");
  }, [account?.student.id]);

  const years = uniqueItems(charges.map((charge) => charge.financeStructure.academicYear));
  const terms = uniqueItems(charges.filter((charge) => !academicYearId || charge.financeStructure.academicYear.id === academicYearId).map((charge) => charge.financeStructure.term));
  const classes = uniqueItems(charges.filter((charge) => (!academicYearId || charge.financeStructure.academicYear.id === academicYearId) && (!termId || charge.financeStructure.term.id === termId)).map((charge) => charge.financeStructure.schoolClass));
  const categories = uniqueItems(charges.filter((charge) => (!academicYearId || charge.financeStructure.academicYear.id === academicYearId) && (!termId || charge.financeStructure.term.id === termId) && (!classId || charge.financeStructure.schoolClass.id === classId)).map((charge) => charge.financeStructure.studentCategory));
  const matchingCharges = charges.filter((charge) => {
    const structure = charge.financeStructure;
    return structure.academicYear.id === academicYearId && structure.term.id === termId && structure.schoolClass.id === classId && structure.studentCategory.id === studentCategoryId;
  });
  const fieldClass = "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60";
  const changePeriod = (setter: (next: string) => void, next: string, resetFollowing: () => void) => { setter(next); resetFollowing(); onChange(""); };

  return <div className="mt-2 grid gap-3 sm:grid-cols-2">
    <label className="text-xs font-medium text-slate-600">Academic year<select required disabled={!account || loading} value={academicYearId} onChange={(event) => changePeriod(setAcademicYearId, event.target.value, () => { setTermId(""); setClassId(""); setStudentCategoryId(""); })} className={fieldClass}><option value="">Select academic year</option>{years.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="text-xs font-medium text-slate-600">Term<select required disabled={!academicYearId || loading} value={termId} onChange={(event) => changePeriod(setTermId, event.target.value, () => { setClassId(""); setStudentCategoryId(""); })} className={fieldClass}><option value="">Select term</option>{terms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="text-xs font-medium text-slate-600">Class for this debt<select required disabled={!termId || loading} value={classId} onChange={(event) => changePeriod(setClassId, event.target.value, () => setStudentCategoryId(""))} className={fieldClass}><option value="">Select class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="text-xs font-medium text-slate-600">Student category<select required disabled={!classId || loading} value={studentCategoryId} onChange={(event) => changePeriod(setStudentCategoryId, event.target.value, () => undefined)} className={fieldClass}><option value="">Select category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="text-xs font-medium text-slate-600 sm:col-span-2">Fee or charge being paid<select required disabled={!studentCategoryId || loading} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}><option value="">{loading ? "Matching fee structures..." : "Select fee or charge"}</option>{matchingCharges.map((charge) => { const balance = charge.expectedAmount - charge.paidAmount - charge.waivedAmount; return <option key={charge.id} value={charge.id}>{charge.financeStructure.feeType.name} · Balance UGX {balance.toLocaleString()}</option>; })}</select></label>
    {account && charges.length === 0 && <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 sm:col-span-2">No active fee structure matches this student’s placement. Create or apply the correct fee structure before recording a payment.</p>}
    {account && charges.length > 0 && academicYearId && termId && classId && studentCategoryId && matchingCharges.length === 0 && <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 sm:col-span-2">No charge exists for this exact year, term, class, and category.</p>}
  </div>;
}
