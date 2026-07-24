import { useEffect, useMemo, useState } from "react";
import SetupService, { type AcademicYear, type FeeType, type FinanceStructure, type SchoolClass, type StudentCategory, type Term } from "../../../services/setupService";

const tabItems = [
  { key: "academicYears", label: "Academic Year" },
  { key: "terms", label: "Terms" },
  { key: "classes", label: "Classes" },
  { key: "studentCategories", label: "Student Categories" },
  { key: "feeTypes", label: "Fee Types" },
  { key: "financeStructures", label: "Finance Structure" },
] as const;

export default function AcademicSetupPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]["key"]>("academicYears");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [studentCategories, setStudentCategories] = useState<StudentCategory[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [financeStructures, setFinanceStructures] = useState<FinanceStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    academicYearName: "",
    termName: "",
    termAcademicYearId: "",
    className: "",
    studentCategoryName: "",
    feeTypeName: "",
    financeAcademicYearId: "",
    financeTermId: "",
    financeClassId: "",
    financeStudentCategoryId: "",
    financeFeeTypeId: "",
    financeExpectedAmount: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [years, termsData, classesData, categoriesData, feeTypesData, financeData] = await Promise.all([
        SetupService.getAcademicYears(),
        SetupService.getTerms(),
        SetupService.getClasses(),
        SetupService.getStudentCategories(),
        SetupService.getFeeTypes(),
        SetupService.getFinanceStructures(),
      ]);
      setAcademicYears(years);
      setTerms(termsData);
      setClasses(classesData);
      setStudentCategories(categoriesData);
      setFeeTypes(feeTypesData);
      setFinanceStructures(financeData);
    } catch {
      setMessage("Unable to load academic setup data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedYearNames = useMemo(() => academicYears.map((item) => item.name), [academicYears]);

  const handleCreateAcademicYear = async () => {
    if (!form.academicYearName.trim()) return;
    await SetupService.createAcademicYear({ name: form.academicYearName.trim() });
    setForm((current) => ({ ...current, academicYearName: "" }));
    setMessage("Academic year saved.");
    await loadData();
  };

  const handleCreateTerm = async () => {
    if (!form.termName.trim() || !form.termAcademicYearId) return;
    await SetupService.createTerm({ academicYearId: form.termAcademicYearId, name: form.termName.trim(), feeAmount: 0 });
    setForm((current) => ({ ...current, termName: "", termAcademicYearId: "" }));
    setMessage("Term saved.");
    await loadData();
  };

  const handleCreateClass = async () => {
    if (!form.className.trim()) return;
    await SetupService.createClass({ name: form.className.trim() });
    setForm((current) => ({ ...current, className: "" }));
    setMessage("Class saved.");
    await loadData();
  };

  const handleCreateStudentCategory = async () => {
    if (!form.studentCategoryName.trim()) return;
    await SetupService.createStudentCategory({ name: form.studentCategoryName.trim() });
    setForm((current) => ({ ...current, studentCategoryName: "" }));
    setMessage("Student category saved.");
    await loadData();
  };

  const handleCreateFeeType = async () => {
    if (!form.feeTypeName.trim()) return;
    await SetupService.createFeeType({ name: form.feeTypeName.trim() });
    setForm((current) => ({ ...current, feeTypeName: "" }));
    setMessage("Fee type saved.");
    await loadData();
  };

  const handleCreateFinanceStructure = async () => {
    if (!form.financeAcademicYearId || !form.financeTermId || !form.financeClassId || !form.financeStudentCategoryId || !form.financeFeeTypeId || !form.financeExpectedAmount) return;
    await SetupService.createFinanceStructure({
      academicYearId: form.financeAcademicYearId,
      termId: form.financeTermId,
      classId: form.financeClassId,
      studentCategoryId: form.financeStudentCategoryId,
      feeTypeId: form.financeFeeTypeId,
      expectedAmount: Number(form.financeExpectedAmount),
    });
    setForm((current) => ({ ...current, financeAcademicYearId: "", financeTermId: "", financeClassId: "", financeStudentCategoryId: "", financeFeeTypeId: "", financeExpectedAmount: "" }));
    setMessage("Finance structure saved.");
    await loadData();
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Academic Setup</h1>
          <p className="mt-2 text-sm text-slate-500">Configure academic years, terms, classes, student categories, fee types, and finance structures.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {selectedYearNames.length > 0 ? `${selectedYearNames.join(", ")}` : "No academic years yet"}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabItems.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

      {loading ? <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">Loading setup data…</div> : null}

      {!loading && activeTab === "academicYears" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Academic Years</h2>
            <p className="mt-2 text-sm text-slate-500">Add and activate academic years such as 2026.</p>
            <div className="mt-4 space-y-3">
              {academicYears.map((year) => (
                <div key={year.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{year.name}</p>
                    <p className="text-sm text-slate-500">{year.isActive ? "Active" : "Inactive"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${year.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{year.isActive ? "Active" : "Inactive"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add Academic Year</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Academic Year
              <input value={form.academicYearName} onChange={(event) => setForm((current) => ({ ...current, academicYearName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. 2026" />
            </label>
            <button type="button" onClick={handleCreateAcademicYear} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Academic Year</button>
          </div>
        </div>
      ) : null}

      {!loading && activeTab === "terms" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Terms</h2>
            <div className="mt-4 space-y-3">
              {terms.length ? terms.map((term) => (
                <div key={term.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{term.name}</p>
                  <p className="text-sm text-slate-500">{term.academicYear?.name ?? "Academic year"}</p>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">No terms created yet.</div>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add Term</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Academic Year
              <select value={form.termAcademicYearId} onChange={(event) => setForm((current) => ({ ...current, termAcademicYearId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select academic year</option>
                {academicYears.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Term Name
              <input value={form.termName} onChange={(event) => setForm((current) => ({ ...current, termName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. Term 1" />
            </label>
            <button type="button" onClick={handleCreateTerm} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Term</button>
          </div>
        </div>
      ) : null}

      {!loading && activeTab === "classes" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Classes</h2>
            <div className="mt-4 space-y-3">
              {classes.length ? classes.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{item.isActive ? "Active" : "Inactive"}</span>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">No classes created yet.</div>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add Class</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Class Name
              <input value={form.className} onChange={(event) => setForm((current) => ({ ...current, className: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. Senior 1" />
            </label>
            <button type="button" onClick={handleCreateClass} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Class</button>
          </div>
        </div>
      ) : null}

      {!loading && activeTab === "studentCategories" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Student Categories</h2>
            <div className="mt-4 space-y-3">
              {studentCategories.length ? studentCategories.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{item.isActive ? "Active" : "Inactive"}</span>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">No categories created yet.</div>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add Category</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Category Name
              <input value={form.studentCategoryName} onChange={(event) => setForm((current) => ({ ...current, studentCategoryName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. Boarding" />
            </label>
            <button type="button" onClick={handleCreateStudentCategory} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Category</button>
          </div>
        </div>
      ) : null}

      {!loading && activeTab === "feeTypes" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Fee Types</h2>
            <div className="mt-4 space-y-3">
              {feeTypes.length ? feeTypes.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{item.isActive ? "Active" : "Inactive"}</span>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">No fee types created yet.</div>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add Fee Type</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Fee Type Name
              <input value={form.feeTypeName} onChange={(event) => setForm((current) => ({ ...current, feeTypeName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. Tuition" />
            </label>
            <button type="button" onClick={handleCreateFeeType} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Fee Type</button>
          </div>
        </div>
      ) : null}

      {!loading && activeTab === "financeStructures" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Finance Structure</h2>
            <div className="mt-4 space-y-3">
              {financeStructures.length ? financeStructures.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-900">{item.academicYear?.name} • {item.term?.name} • {item.schoolClass?.name} • {item.studentCategory?.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.feeType?.name}: {item.expectedAmount.toLocaleString()} UGX</p>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">No finance structures created yet.</div>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Create Finance Structure</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Academic Year
              <select value={form.financeAcademicYearId} onChange={(event) => setForm((current) => ({ ...current, financeAcademicYearId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select academic year</option>
                {academicYears.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Term
              <select value={form.financeTermId} onChange={(event) => setForm((current) => ({ ...current, financeTermId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select term</option>
                {terms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Class
              <select value={form.financeClassId} onChange={(event) => setForm((current) => ({ ...current, financeClassId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select class</option>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Student Category
              <select value={form.financeStudentCategoryId} onChange={(event) => setForm((current) => ({ ...current, financeStudentCategoryId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select category</option>
                {studentCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Fee Type
              <select value={form.financeFeeTypeId} onChange={(event) => setForm((current) => ({ ...current, financeFeeTypeId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select fee type</option>
                {feeTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Expected Amount
              <input type="number" value={form.financeExpectedAmount} onChange={(event) => setForm((current) => ({ ...current, financeExpectedAmount: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="500000" />
            </label>
            <button type="button" onClick={handleCreateFinanceStructure} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Finance Structure</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
