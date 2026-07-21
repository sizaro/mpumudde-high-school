import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentService from "../../../services/studentService";

export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ admissionNumber: "", firstName: "", lastName: "", dateOfBirth: "", gender: "", isActive: true });
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.admissionNumber || !form.firstName || !form.lastName) {
      setStatus("Admission number, first name, and last name are required.");
      return;
    }

    setStatus(null);
    setIsSubmitting(true);

    try {
      await StudentService.createStudent(form);
      navigate("/director/students");
    } catch (error) {
      setStatus("Unable to create student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Register Student</h1>
      <p className="mt-2 text-slate-500">Create a new student record for the school.</p>

      <form className="mt-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Admission number</span>
            <input
              value={form.admissionNumber}
              onChange={(event) => setForm({ ...form, admissionNumber: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="e.g. STU-0001"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">First name</span>
            <input
              value={form.firstName}
              onChange={(event) => setForm({ ...form, firstName: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="First name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Last name</span>
            <input
              value={form.lastName}
              onChange={(event) => setForm({ ...form, lastName: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Last name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Date of birth</span>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Gender</span>
            <select
              value={form.gender}
              onChange={(event) => setForm({ ...form, gender: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={form.isActive ? "active" : "inactive"}
              onChange={(event) => setForm({ ...form, isActive: event.target.value === "active" })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create student"}
          </button>
          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
        </div>
      </form>
    </div>
  );
}
