import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Academics from "../pages/public/Academics";
import Admissions from "../pages/public/Admissions";
import News from "../pages/public/News";
import Gallery from "../pages/public/Gallery";
import Contact from "../pages/public/Contact";

import DirectorDashboard from "../pages/director/Dashboard";
import DirectorOverview from "../pages/director/Overview";
import StudentRegister from "../pages/director/students/RegistrationWizard";
import StudentList from "../pages/director/students/List";
import StudentStatus from "../pages/director/students/Status";
import StudentProfile from "../pages/director/students/Profile";
import FinanceOverview from "../pages/director/finance/FinanceOverview";
import PaymentHistory from "../pages/director/finance/History";
import DirectorReports from "../pages/director/reports/Reports";
import AcademicSetupPage from "../pages/director/setup/AcademicSetupPage";
import AccountManagement from "../pages/director/AccountManagement";

// Director — Teacher management
import TeacherListPage from "../pages/director/teachers/List";
import CreateTeacherWizard from "../pages/director/teachers/CreateWizard";
import TeacherProfileDirector from "../pages/director/teachers/Profile";
import TeacherAssignmentsPage from "../pages/director/teachers/Assignments";
import EditTeacherPage from "../pages/director/teachers/EditTeacher";
import TeacherContactsPage from "../pages/director/teachers/Contacts";
import TeacherMedicalPage from "../pages/director/teachers/Medical";
import TeacherDocumentsPage from "../pages/director/teachers/Documents";

// Teacher portal
import TeacherLayout from "../pages/teacher/TeacherLayout";
import TeacherOverview from "../pages/teacher/Overview";
import MyClasses from "../pages/teacher/MyClasses";
import MySubjects from "../pages/teacher/MySubjects";
import TakeAttendance from "../pages/teacher/TakeAttendance";
import AttendanceHistory from "../pages/teacher/AttendanceHistory";
import TeacherProfilePage from "../pages/teacher/TeacherProfilePage";
import MyDocuments from "../pages/teacher/MyDocuments";
import MyMedical from "../pages/teacher/MyMedical";
import ChangePassword from "../pages/teacher/ChangePassword";

import ParentLayout from "../pages/parent/ParentLayout";
import ParentChildren from "../pages/parent/Children";
import ParentAttendance from "../pages/parent/Attendance";
import ParentFinance from "../pages/parent/Finance";
import ParentSettings from "../pages/parent/Settings";
import StudentDashboard from "../pages/student/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/news" element={<News />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* DIRECTOR DASHBOARD */}
      <Route
        path="/director"
        element={
          <ProtectedRoute roles={["SUPER_ADMIN"]}>
            <DirectorDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DirectorOverview />} />
        <Route path="students/register" element={<StudentRegister />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/status" element={<StudentStatus />} />
        <Route path="students/profile" element={<StudentProfile />} />
        <Route path="finance" element={<FinanceOverview />} />
        <Route path="finance/history" element={<PaymentHistory />} />
        <Route path="academic-setup" element={<AcademicSetupPage />} />
        <Route path="account-management" element={<AccountManagement />} />
        <Route path="reports" element={<DirectorReports />} />
        {/* Teacher management */}
        <Route path="teachers" element={<TeacherListPage />} />
        <Route path="teachers/create" element={<CreateTeacherWizard />} />
        <Route path="teachers/:id" element={<TeacherProfileDirector />} />
        <Route path="teachers/:id/edit" element={<EditTeacherPage />} />
        <Route
          path="teachers/:id/assignments"
          element={<TeacherAssignmentsPage />}
        />
        <Route path="teachers/:id/contacts" element={<TeacherContactsPage />} />
        <Route path="teachers/:id/medical" element={<TeacherMedicalPage />} />
        <Route
          path="teachers/:id/documents"
          element={<TeacherDocumentsPage />}
        />
      </Route>

      {/* TEACHER PORTAL */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute roles={["TEACHER"]}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherOverview />} />
        <Route path="overview" element={<TeacherOverview />} />
        <Route path="classes" element={<MyClasses />} />
        <Route path="subjects" element={<MySubjects />} />
        <Route path="attendance/take" element={<TakeAttendance />} />
        <Route path="attendance/history" element={<AttendanceHistory />} />
        <Route path="profile" element={<TeacherProfilePage />} />
        <Route path="documents" element={<MyDocuments />} />
        <Route path="medical" element={<MyMedical />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      <Route
        path="/parent"
        element={
          <ProtectedRoute roles={["PARENT"]}>
            <ParentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ParentChildren />} />
        <Route path="children" element={<ParentChildren />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="finance" element={<ParentFinance />} />
        <Route path="settings" element={<ParentSettings />} />
      </Route>
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
