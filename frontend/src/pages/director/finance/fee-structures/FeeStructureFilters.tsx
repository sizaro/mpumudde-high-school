export type FeeStructureFilterState = {
  search: string;
  academicYearId: string;
  termId: string;
  classId: string;
  studentCategoryId: string;
  feeTypeId: string;
  isActive: string;
};

type Option = { id: string; name: string };

type Props = {
  value: FeeStructureFilterState;
  academicYears: Option[];
  terms: Array<Option & { academicYearId: string }>;
  classes: Option[];
  studentCategories: Option[];
  feeTypes: Option[];
  onChange: (value: FeeStructureFilterState) => void;
};

const selectClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400";

export default function FeeStructureFilters({
  value,
  academicYears,
  terms,
  classes,
  studentCategories,
  feeTypes,
  onChange,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Search
          <input
            value={value.search}
            onChange={(event) =>
              onChange({ ...value, search: event.target.value })
            }
            className={selectClassName}
            placeholder="Search by class, term, or amount"
            type="search"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Academic year
          <select
            value={value.academicYearId}
            onChange={(event) =>
              onChange({ ...value, academicYearId: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">All academic years</option>
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
          >
            <option value="">All terms</option>
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
          >
            <option value="">All classes</option>
            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Student category
          <select
            value={value.studentCategoryId}
            onChange={(event) =>
              onChange({ ...value, studentCategoryId: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">All categories</option>
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
          >
            <option value="">All fee types</option>
            {feeTypes.map((feeType) => (
              <option key={feeType.id} value={feeType.id}>
                {feeType.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            value={value.isActive}
            onChange={(event) =>
              onChange({ ...value, isActive: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
      </div>
    </div>
  );
}
