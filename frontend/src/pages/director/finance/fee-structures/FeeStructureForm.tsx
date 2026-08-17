import type {
  AcademicYear,
  AcademicYearClass,
  FeeType,
  StudentCategory,
  Term,
} from "../../../../services/setupService";
import { Link } from "react-router-dom";

export type FeeStructureFormValues = {
  academicYearId: string;
  termId: string;
  classId: string;
  studentCategoryId: string;
  feeTypeId: string;
  expectedAmount: string;
  isActive: boolean;
};

type Props = {
  mode: "create" | "edit";
  value: FeeStructureFormValues;
  academicYears: AcademicYear[];
  terms: Term[];
  academicYearClasses: AcademicYearClass[];
  studentCategories: StudentCategory[];
  feeTypes: FeeType[];
  loading: boolean;
  canManage: boolean;
  onChange: (value: FeeStructureFormValues) => void;
  onSubmit: (value: FeeStructureFormValues) => Promise<void>;
  onCancel: () => void;
};

const selectClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400";

export default function FeeStructureForm({
  mode,
  value,
  academicYears,
  terms,
  academicYearClasses,
  studentCategories,
  feeTypes,
  loading,
  canManage,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  const offeredClasses = value.academicYearId
    ? academicYearClasses
        .filter(
          (offering) =>
            offering.academicYearId === value.academicYearId &&
            offering.isActive,
        )
        .map((offering) => offering.schoolClass)
        .filter(Boolean)
    : [];
  const classesForYear = offeredClasses;
  const hasNoClassesForYear =
    Boolean(value.academicYearId) && classesForYear.length === 0;

  const submit = async () => {
    if (!canManage) return;
    await onSubmit(value);
  };

  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === "edit" ? "Edit Fee Structure" : "Create Fee Structure"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Connect the academic year, term, class, category, and fee type to
            one expected amount.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="block text-sm font-medium text-slate-700">
          Academic year
          <select
            value={value.academicYearId}
            onChange={(event) =>
              onChange({ ...value, academicYearId: event.target.value, termId: "", classId: "" })
            }
            className={selectClassName}
            disabled={!canManage}
          >
            <option value="">Select academic year</option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Term
          <select
            value={value.termId}
            onChange={(event) =>
              onChange({ ...value, termId: event.target.value })
            }
            className={selectClassName}
            disabled={!canManage || !value.academicYearId}
          >
            <option value="">Select term</option>
            {terms
              .filter(
                (term) =>
                  !value.academicYearId ||
                  term.academicYearId === value.academicYearId,
              )
              .map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Class
          <select
            value={value.classId}
            onChange={(event) =>
              onChange({ ...value, classId: event.target.value })
            }
            className={selectClassName}
            disabled={!canManage || !value.academicYearId || hasNoClassesForYear}
          >
            <option value="">{value.academicYearId ? "Select class" : "Select academic year first"}</option>
            {classesForYear.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
          {hasNoClassesForYear ? (
            <span className="mt-2 block text-xs font-normal text-amber-700">
              No classes are attached to this academic year.{" "}
              <Link
                to="/director/academic-setup?tab=classes"
                className="font-semibold underline underline-offset-2"
              >
                Open Academic Setup
              </Link>{" "}
              and attach its classes before creating a fee structure.
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Student category
          <select
            value={value.studentCategoryId}
            onChange={(event) =>
              onChange({ ...value, studentCategoryId: event.target.value })
            }
            className={selectClassName}
            disabled={!canManage}
          >
            <option value="">Select category</option>
            {studentCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Fee type
          <select
            value={value.feeTypeId}
            onChange={(event) =>
              onChange({ ...value, feeTypeId: event.target.value })
            }
            className={selectClassName}
            disabled={!canManage}
          >
            <option value="">Select fee type</option>
            {feeTypes.map((feeType) => (
              <option key={feeType.id} value={feeType.id}>
                {feeType.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Expected amount
          <input
            type="number"
            value={value.expectedAmount}
            onChange={(event) =>
              onChange({ ...value, expectedAmount: event.target.value })
            }
            className={selectClassName}
            min="0"
            placeholder="500000"
            disabled={!canManage}
          />
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={value.isActive}
            onChange={(event) =>
              onChange({ ...value, isActive: event.target.checked })
            }
            disabled={!canManage}
          />
          Active structure
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          {canManage ? (
            <button
              type="button"
              onClick={submit}
              disabled={loading || hasNoClassesForYear}
              className="w-full flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
            >
              {loading
                ? "Saving..."
                : mode === "edit"
                  ? "Update structure"
                  : "Create structure"}
            </button>
          ) : (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              You can view fee structures, but this account cannot change them.
            </div>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
