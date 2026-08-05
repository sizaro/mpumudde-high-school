import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherService from "../../services/teacherService";

export default function MyClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    TeacherService.getMyClasses()
      .then(setClasses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-w-0 px-1 py-4 text-sm text-slate-500 sm:px-4 sm:py-6 md:p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 overflow-hidden px-1 py-3 sm:px-4 sm:py-6 md:p-8">
      <header className="w-full min-w-0">
        <h1 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
          My Classes
        </h1>

        <p className="mt-2 break-words text-sm text-slate-500 sm:text-base">
          Select a class to view it and take attendance.
        </p>
      </header>

      {classes.length === 0 ? (
        <div className="w-full min-w-0 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-6">
          <p className="break-words text-sm leading-6 text-slate-500">
            No classes assigned yet. Contact your director.
          </p>
        </div>
      ) : (
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {classes.map((schoolClass) => (
            <button
              key={schoolClass.id}
              type="button"
              onClick={() =>
                navigate(`/teacher/attendance/take?classId=${schoolClass.id}`)
              }
              className="group flex w-full min-w-0 flex-col items-start overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:p-5"
            >
              <h2 className="max-w-full break-words text-base font-semibold text-slate-900 sm:text-lg">
                {schoolClass.name}
              </h2>

              <span className="mt-3 max-w-full break-words text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
                Take attendance →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
