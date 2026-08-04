import { useEffect, useMemo, useState } from "react";
import SetupService, { type AcademicYear, type FeeType, type FinanceStructure, type SchoolClass, type StudentCategory, type Subject, type Term } from "../../../services/setupService";

const tabItems = [
  { key: "academicYears", label: "Academic Year" },
  { key: "terms", label: "Terms" },
  { key: "classes", label: "Classes" },
  { key: "subjects", label: "Subjects" },
  { key: "studentCategories", label: "Student Categories" },
] as const;

export default function AcademicSetupPage() {
  const [activeTab, setActiveTab] = useState<string>("academicYears");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentCategories, setStudentCategories] = useState<StudentCategory[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [financeStructures, setFinanceStructures] = useState<FinanceStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    academicYearName: "",
    termAcademicYearId: "",
    termStartDate: "",
    termEndDate: "",
    termFeeAmount: "",
    termIsActive: true,
    termEditId: "",
    className: "",
    subjectName: "",
    subjectCode: "",
    studentCategoryName: "",
    feeTypeName: "",
    financeAcademicYearId: "",
    financeTermId: "",
    financeClassId: "",
    financeStudentCategoryId: "",
    financeFeeTypeId: "",
    financeExpectedAmount: "",
  });
  const [editingTermId, setEditingTermId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [years, termsData, classesData, subjectsData, categoriesData, feeTypesData, financeData] = await Promise.all([
        SetupService.getAcademicYears(),
        SetupService.getTerms(),
        SetupService.getClasses(),
        SetupService.getSubjects(),
        SetupService.getStudentCategories(),
        SetupService.getFeeTypes(),
        SetupService.getFinanceStructures(),
      ]);
      setAcademicYears(years);
      setTerms(termsData);
      setClasses(classesData);
      setSubjects(subjectsData);
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

  const prepareTerms = async () => {
    await Promise.all(academicYears.map((year) => SetupService.ensureStandardTerms(year.id)));
    await loadData();
  };

  const selectedYearNames = useMemo(() => academicYears.map((item) => item.name), [academicYears]);

  const handleCreateAcademicYear = async () => {
    if (!form.academicYearName.trim()) return;
    await SetupService.createAcademicYear({ name: form.academicYearName.trim() });
    setForm((current) => ({ ...current, academicYearName: "" }));
    setMessage("Academic year saved.");
    await loadData();
  };

  const handleCreateTerm = async () => {
    if (editingTermId && (!form.termStartDate || !form.termEndDate)) return;
    
    if (editingTermId) {
      // Update existing term
      const termToUpdate = terms.find(t => t.id === editingTermId);
      if (termToUpdate) {
        await SetupService.updateTerm(editingTermId, {
          academicYearId: termToUpdate.academicYearId,
          name: termToUpdate.name,
          feeAmount: form.termFeeAmount ? Number(form.termFeeAmount) : termToUpdate.feeAmount,
          startDate: form.termStartDate,
          endDate: form.termEndDate,
          isActive: form.termIsActive,
        });
        setMessage("Term updated successfully.");
        setEditingTermId(null);
        setForm((current) => ({ ...current, termStartDate: "", termEndDate: "", termFeeAmount: "", termIsActive: true, termEditId: "" }));
        await loadData();
      }
    }
  };

  const handleCreateClass = async () => {
    if (!form.className.trim()) return;
    await SetupService.createClass({ name: form.className.trim() });
    setForm((current) => ({ ...current, className: "" }));
    setMessage("Class saved.");
    await loadData();
  };

  const handleCreateSubject = async () => {
    if (!form.subjectName.trim()) return;
    await SetupService.createSubject({ name: form.subjectName.trim(), code: form.subjectCode.trim() || undefined });
    setForm((current) => ({ ...current, subjectName: "", subjectCode: "" }));
    setMessage("Subject saved. It can now be assigned to teachers.");
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
          <p className="mt-2 text-sm text-slate-500">Configure academic years, terms, classes, subjects, and student categories. Fee types and fee structures are managed in Finance.</p>
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
            <p className="mt-2 text-sm text-slate-500">Each academic year always has Term 1, Term 2, and Term 3. Turn a term on or off when needed.</p>
            <div className="mt-4 space-y-3">
              {["Term 1", "Term 2", "Term 3"].map((termName) => (
                <div key={termName} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{termName}</p>
                      {terms.find(t => t.name === termName)?.startDate && (
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(terms.find(t => t.name === termName)?.startDate || "").toLocaleDateString()} - {new Date(terms.find(t => t.name === termName)?.endDate || "").toLocaleDateString()}
                        </p>
                      )}
                      {terms.find(t => t.name === termName)?.feeAmount && (
                        <p className="text-xs text-slate-500">Fee: UGX {terms.find(t => t.name === termName)?.feeAmount.toLocaleString()}</p>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        const term = terms.find(t => t.name === termName);
                        if (term) {
                          setEditingTermId(term.id);
                          setForm((current) => ({ 
                            ...current, 
                            termStartDate: term.startDate || "", 
                            termEndDate: term.endDate || "",
                            termFeeAmount: term.feeAmount ? String(term.feeAmount) : "",
                            termIsActive: term.isActive,
                          }));
                        }
                      }}
                      className="rounded-2xl bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{editingTermId ? "Term settings" : "Set up standard terms"}</h2>
            {editingTermId ? (
              <>
                <label className="mt-4 block text-sm font-medium text-slate-700">
                  Start Date
                  <input type="date" value={form.termStartDate} onChange={(event) => setForm((current) => ({ ...current, termStartDate: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>
                <label className="mt-4 block text-sm font-medium text-slate-700">
                  End Date
                  <input type="date" value={form.termEndDate} onChange={(event) => setForm((current) => ({ ...current, termEndDate: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
                </label>
                <label className="mt-4 block text-sm font-medium text-slate-700">
                  Fee Amount (UGX) (Optional)
                  <input type="number" value={form.termFeeAmount} onChange={(event) => setForm((current) => ({ ...current, termFeeAmount: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="0" />
                </label>
                <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.termIsActive} onChange={(event) => setForm((current) => ({ ...current, termIsActive: event.target.checked }))} />Active term</label>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={handleCreateTerm} className="flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Changes</button>
                  <button type="button" onClick={() => {
                    setEditingTermId(null);
                    setForm((current) => ({ ...current, termStartDate: "", termEndDate: "", termFeeAmount: "", termIsActive: true }));
                  }} className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700">Cancel</button>
                </div>
              </>
            ) : (
              <><p className="mt-4 text-sm text-slate-500">Create any missing standard terms for the academic years already in the system.</p><button type="button" onClick={() => void prepareTerms()} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Create missing Term 1, 2 and 3</button></>
            )}
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
              <select value={form.className} onChange={(event) => setForm((current) => ({ ...current, className: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select a class</option>
                <option value="Senior 1">Senior 1</option>
                <option value="Senior 2">Senior 2</option>
                <option value="Senior 3">Senior 3</option>
                <option value="Senior 4">Senior 4</option>
                <option value="Senior 5">Senior 5</option>
                <option value="Senior 6">Senior 6</option>
              </select>
            </label>
            <button type="button" onClick={handleCreateClass} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Class</button>
          </div>
        </div>
      ) : null}

      {!loading && activeTab === "subjects" ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Subjects</h2>
            <p className="mt-2 text-sm text-slate-500">Create the school subject catalogue once. Teachers are assigned subjects, then may choose any active class when taking attendance.</p>
            <div className="mt-4 space-y-3">
              {subjects.length ? subjects.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><div><p className="font-medium text-slate-900">{item.name}</p>{item.code && <p className="text-sm text-slate-500">{item.code}</p>}</div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{item.isActive ? "Active" : "Inactive"}</span></div>) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">No subjects created yet.</div>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add Subject</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">Subject Name<input value={form.subjectName} onChange={(event) => setForm((current) => ({ ...current, subjectName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. Mathematics" /></label>
            <label className="mt-4 block text-sm font-medium text-slate-700">Code (optional)<input value={form.subjectCode} onChange={(event) => setForm((current) => ({ ...current, subjectCode: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. MTC" /></label>
            <button type="button" onClick={handleCreateSubject} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Save Subject</button>
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
              <select value={form.studentCategoryName} onChange={(event) => setForm((current) => ({ ...current, studentCategoryName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select a category</option>
                <option value="Boarding">Boarding</option>
                <option value="Day">Day</option>
              </select>
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
              <input value={form.feeTypeName} onChange={(event) => setForm((current) => ({ ...current, feeTypeName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="e.g. Registration, Tuition, Reams, Development" />
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
              <select value={form.financeTermId} disabled={!form.financeAcademicYearId} onChange={(event) => setForm((current) => ({ ...current, financeTermId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 disabled:bg-slate-100">
                <option value="">{form.financeAcademicYearId ? "Select term" : "Select academic year first"}</option>
                {terms.filter((term) => term.academicYearId === form.financeAcademicYearId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Class
              <select value={form.financeClassId} onChange={(event) => setForm((current) => ({ ...current, financeClassId: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Select class</option>
                {classes.filter((c) => ["Senior 1", "Senior 2", "Senior 3", "Senior 4", "Senior 5", "Senior 6"].includes(c.name)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
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
