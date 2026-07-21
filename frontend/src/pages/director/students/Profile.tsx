export default function StudentProfile() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Student Profile</h1>
      <p className="mt-2 text-slate-500">View individual student details and profile information.</p>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Student</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Alice Nsubuga</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Admission number</p>
            <p className="mt-2 text-slate-900">STU-0001</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Status</p>
            <p className="mt-2 text-slate-900">Active</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Date of birth</p>
            <p className="mt-2 text-slate-900">2009-05-14</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Parents</p>
            <p className="mt-2 text-slate-900">Susan Nsubuga, Father</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Balance</p>
            <p className="mt-2 text-slate-900">UGX 150,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
