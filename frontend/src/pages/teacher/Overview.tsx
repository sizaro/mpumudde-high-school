import { BookOpen, ClipboardCheck, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherService from "../../services/teacherService";

export default function TeacherOverview() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    TeacherService.getMyProfile().then(setProfile).catch(() => undefined);
  }, []);

  const assignedSubjects = profile?.teachingAssignments
    ? new Set(profile.teachingAssignments.map((assignment: any) => assignment.subjectId)).size
    : "—";

  return (
    <div className="space-y-6">
      <section className="portal-hero p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">Teacher workspace</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Welcome, {profile?.firstName ?? "Teacher"}</h1>
        <p className="mt-2 max-w-xl text-sm text-white/65">
          Manage your teaching responsibilities and record accurate attendance for every lesson.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="portal-metric-card portal-tone-secondary p-5">
          <span className="portal-icon-tile"><BookOpen size={20} /></span>
          <p className="mt-5 text-2xl font-bold text-slate-950">{assignedSubjects}</p>
          <p className="mt-1 text-sm text-slate-500">Assigned subjects</p>
        </div>
        <div className="portal-metric-card portal-tone-highlight p-5">
          <span className="portal-icon-tile"><UsersRound size={20} /></span>
          <p className="mt-5 text-2xl font-bold text-slate-950">All active classes</p>
          <p className="mt-1 text-sm text-slate-500">Available for flexible lesson coverage</p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="portal-icon-tile portal-tone-accent"><ClipboardCheck size={20} /></span>
          <div>
            <h2 className="font-bold text-slate-900">Ready for your next lesson?</h2>
            <p className="text-sm text-slate-500">Select the class and subject, then record attendance.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/teacher/attendance/take" className="portal-action-button">Take attendance</Link>
          <Link to="/teacher/subjects" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-300">View subjects</Link>
        </div>
      </section>
    </div>
  );
}
