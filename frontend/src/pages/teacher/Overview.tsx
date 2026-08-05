import { useEffect, useState } from "react";
import TeacherService from "../../services/teacherService";

export default function TeacherOverview() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    TeacherService.getMyProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const overviewCards = [
    {
      label: "Assigned Subjects",
      value: profile?.teachingAssignments
        ? new Set(
            profile.teachingAssignments.map(
              (assignment: any) => assignment.subjectId,
            ),
          ).size
        : "—",
    },
    {
      label: "Available Classes",
      value: "All active classes",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-5 overflow-hidden px-1 py-3 sm:px-3 sm:py-5 md:p-8">
      <header className="w-full min-w-0">
        <h1 className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
          Welcome, {profile?.firstName ?? "Teacher"}
        </h1>

        <p className="mt-2 break-words text-sm text-slate-500 sm:text-base">
          Here is your portal overview.
        </p>
      </header>

      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {overviewCards.map((card) => (
          <article
            key={card.label}
            className="flex w-full min-w-0 flex-col items-start gap-1 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className="max-w-full break-words text-xl font-bold leading-tight text-blue-600 sm:text-2xl md:text-3xl">
              {card.value}
            </p>

            <p className="mt-1 max-w-full break-words text-sm leading-5 text-slate-500">
              {card.label}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
