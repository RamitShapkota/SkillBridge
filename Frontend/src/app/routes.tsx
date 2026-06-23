import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Landing from "../pages/public/Landing";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboardPage";
import AdminVerificationPage from "../pages/admin/AdminVerificationPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import Register from "../pages/auth/Register";
import PublicProfilePage from "../pages/public/PublicProfilePage";
import PublicBrowseJobsPage from "../pages/public/PublicBrowseJobsPage";
import AdminJobsPage from "../pages/admin/AdminJobsPage";
import Login from "../pages/auth/Login";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import StudentDashboard from "../pages/student/StudentDashboardPage";
import ClientDashboard from "../pages/client/ClientDashboardPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import PostJobPage from "../pages/client/PostJobPage";
import BrowseJobsPage from "../pages/student/BrowseJobsPage";
import MyApplicationsPage from "../pages/student/MyApplicationsPage";
import StudentProjectsPage from "../pages/student/StudentProjectsPage";
import ClientProjectsPage from "../pages/client/ClientProjectsPage";
import ProjectWorkspacePage from "../pages/client/ProjectWorkspacePage";
import ManageJobsPage from "../pages/client/ManageJobsPage";
import StudentSettingsPage from "../pages/student/StudentSettingsPage";
import ClientSettingsPage from "../pages/client/ClientSettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "p/:username", Component: PublicProfilePage },
      { path: "browse", Component: PublicBrowseJobsPage },
      { path: "forgot-password", Component: ForgotPasswordPage },
      { path: "register", Component: Register },
      { path: "login", Component: Login },
      { path: "dashboard/student", Component: StudentDashboard },
      { path: "dashboard/client", Component: ClientDashboard },
      { path: "dashboard/student/profile", Component: StudentProfilePage },
      { path: "dashboard/client/post-job", Component: PostJobPage },
      { path: "dashboard/student/browse-jobs", Component: BrowseJobsPage },
      { path: "dashboard/student/applications", Component: MyApplicationsPage },
      { path: "dashboard/client/manage-jobs", Component: ManageJobsPage },
      { path: "dashboard/student/projects", Component: StudentProjectsPage },
      { path: "dashboard/client/projects", Component: ClientProjectsPage },
      { path: "dashboard/student/settings", Component: StudentSettingsPage },
      { path: "dashboard/client/settings", Component: ClientSettingsPage },
      { path: "dashboard/student/projects/:id", Component: ProjectWorkspacePage },
      { path: "dashboard/client/projects/:id", Component: ProjectWorkspacePage },
    ],
  },
  { path: "admin/login", Component: AdminLoginPage },
  { path: "admin/dashboard", Component: AdminDashboard },
  { path: "admin/students", Component: AdminVerificationPage },
  { path: "admin/users", Component: AdminUsersPage },
  { path: "admin/jobs", Component: AdminJobsPage },
  { path: "admin/settings", Component: AdminSettingsPage },
]);
