import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import FeeStructureService, {
  type FinanceStructure,
} from "../../../../services/feeStructureService";
import SetupService, {
  type AcademicYear,
  type FeeType,
  type SchoolClass,
  type StudentCategory,
  type Term,
} from "../../../../services/setupService";
import FeeStructureDetails from "./FeeStructureDetails";
import FeeStructureFilters, {
  type FeeStructureFilterState,
} from "./FeeStructureFilters";
import FeeStructureForm, {
  type FeeStructureFormValues,
} from "./FeeStructureForm";
import FeeStructureTable from "./FeeStructureTable";

const emptyFilters = (): FeeStructureFilterState => ({
  search: "",
  academicYearId: "",
  termId: "",
  classId: "",
  studentCategoryId: "",
  feeTypeId: "",
  isActive: "",
});
const emptyForm = (): FeeStructureFormValues => ({
  academicYearId: "",
  termId: "",
  classId: "",
  studentCategoryId: "",
  feeTypeId: "",
  expectedAmount: "",
  isActive: true,
});

export default function FeeStructures() {
  const { hasPermission, hasRole } = useAuth();
  const canManage =
    hasRole("SUPER_ADMIN") || hasPermission("finance.fee-structures.manage");
  const [structures, setStructures] = useState<FinanceStructure[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [studentCategories, setStudentCategories] = useState<StudentCategory[]>(
    [],
  );
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [filters, setFilters] =
    useState<FeeStructureFilterState>(emptyFilters());
  const [form, setForm] = useState<FeeStructureFormValues>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<FinanceStructure | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadStructures = async () => {
    setStructures(await FeeStructureService.list());
  };
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [years, termList, classList, categories, types] =
          await Promise.all([
            SetupService.getAcademicYears(),
            SetupService.getTerms(),
            SetupService.getClasses(),
            SetupService.getStudentCategories(),
            SetupService.getFeeTypes(),
          ]);
        setAcademicYears(years);
        setTerms(termList);
        setClasses(classList);
        setStudentCategories(categories);
        setFeeTypes(types);
        await loadStructures();
      } catch {
        setError(
          "Unable to load fee structures. Refresh the page and try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);
  const filteredStructures = useMemo(
    () =>
      structures.filter((structure) => {
        const query = filters.search.trim().toLowerCase();
        const searchable = [
          structure.academicYear?.name,
          structure.term?.name,
          structure.schoolClass?.name,
          structure.studentCategory?.name,
          structure.feeType?.name,
          structure.expectedAmount,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return (
          (!query || searchable.includes(query)) &&
          (!filters.academicYearId ||
            structure.academicYearId === filters.academicYearId) &&
          (!filters.termId || structure.termId === filters.termId) &&
          (!filters.classId || structure.classId === filters.classId) &&
          (!filters.studentCategoryId ||
            structure.studentCategoryId === filters.studentCategoryId) &&
          (!filters.feeTypeId || structure.feeTypeId === filters.feeTypeId) &&
          (!filters.isActive || String(structure.isActive) === filters.isActive)
        );
      }),
    [filters, structures],
  );
  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(false);
  };
  const startEdit = (structure: FinanceStructure) => {
    setSelected(structure);
    setEditingId(structure.id);
    setShowForm(true);
    setForm({
      academicYearId: structure.academicYearId,
      termId: structure.termId,
      classId: structure.classId,
      studentCategoryId: structure.studentCategoryId,
      feeTypeId: structure.feeTypeId,
      expectedAmount: String(structure.expectedAmount),
      isActive: structure.isActive,
    });
  };
  const save = async (values: FeeStructureFormValues) => {
    if (
      !values.academicYearId ||
      !values.termId ||
      !values.classId ||
      !values.studentCategoryId ||
      !values.feeTypeId ||
      !values.expectedAmount
    ) {
      setError(
        "Complete the academic year, term, class, category, fee type, and expected amount.",
      );
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const payload = {
        ...values,
        expectedAmount: Number(values.expectedAmount),
      };
      const saved = editingId
        ? await FeeStructureService.update(editingId, payload)
        : await FeeStructureService.create(payload);
      setStructures((current) =>
        editingId
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current],
      );
      setSelected(saved);
      resetForm();
      setNotice(
        editingId ? "Fee structure updated." : "Fee structure created.",
      );
    } catch {
      setError(
        "Unable to save the fee structure. The combination may already exist or your account may not have permission.",
      );
    } finally {
      setSaving(false);
    }
  };
  const changeStatus = async (
    structure: FinanceStructure,
    isActive: boolean,
  ) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await FeeStructureService.setStatus(structure.id, isActive);
      setStructures((current) =>
        current.map((item) => (item.id === saved.id ? saved : item)),
      );
      setSelected(saved);
      setNotice(
        isActive ? "Fee structure activated." : "Fee structure deactivated.",
      );
    } catch {
      setError("Unable to change the fee structure status.");
    } finally {
      setSaving(false);
    }
  };
  const applyStructure = async (structure: FinanceStructure) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const result = await FeeStructureService.applyToStudents(structure.id);
      setNotice(
        `Applied to ${result.applied} student${result.applied === 1 ? "" : "s"}. ${result.skipped} existing charge${result.skipped === 1 ? " was" : "s were"} left unchanged.`,
      );
    } catch {
      setError("Unable to apply this structure to students.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Fee Structures
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Set the expected amount for each academic year, term, class,
                student category, and fee type.
              </p>
            </div>
            {canManage && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm());
                  setShowForm(true);
                }}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Add Fee Structure
              </button>
            )}
          </div>
        </div>
        {notice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <FeeStructureFilters
          value={filters}
          academicYears={academicYears}
          terms={terms}
          classes={classes}
          studentCategories={studentCategories}
          feeTypes={feeTypes}
          onChange={setFilters}
        />
        <FeeStructureTable
          feeStructures={filteredStructures}
          loading={loading}
          canManage={canManage}
          onView={setSelected}
          onEdit={startEdit}
          onToggleStatus={changeStatus}
          onReload={loadStructures}
          onApply={applyStructure}
        />
      </div>
      <div className="space-y-6">
        {showForm && <FeeStructureForm
          mode={editingId ? "edit" : "create"}
          value={form}
          academicYears={academicYears}
          terms={terms}
          classes={classes}
          studentCategories={studentCategories}
          feeTypes={feeTypes}
          loading={saving}
          canManage={canManage}
          onChange={setForm}
          onSubmit={save}
          onCancel={resetForm}
        />}
        <FeeStructureDetails structure={selected} />
      </div>
    </div>
  );
}
