import { useNavigate } from "react-router";
import { DashboardLayout } from "../../app/components/layout/DashboardLayout";
import {
  PlusCircle,
  Briefcase,
  FolderOpen,
  CheckCircle,
  FileText,
  ChevronRight,
} from "lucide-react";
import { WelcomeCard } from "../../app/components/shared/WelcomeCard";
import { StatGrid } from "../../app/components/shared/StatCard";
import { QuickActionsGrid } from "../../app/components/shared/QuickActionCard";
import { SectionCard } from "../../app/components/shared/SectionCard";
import { VerificationReminderCard } from "../../app/components/shared/VerificationReminderCard";

const clientStats = [
  { value: 8, label: "Jobs Posted", icon: Briefcase, color: "#2563EB", bg: "#EFF6FF" },
  { value: 3, label: "Open Jobs", icon: FolderOpen, color: "#14B8A6", bg: "#F0FDFA" },
  { value: 24, label: "Applications Received", icon: FileText, color: "#F59E0B", bg: "#FFFBEB" },
  { value: 3, label: "Active Projects", icon: CheckCircle, color: "#7C3AED", bg: "#F5F3FF" },
];

const PENDING_ACTIONS = [
  {
    title: "5 New Applications",
    desc: "Landing Page Design has 5 unreviewed applications.",
    path: "/dashboard/client/manage-jobs",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    title: "1 Submission Waiting",
    desc: "Priya Sharma submitted work on EdTech Landing Page.",
    path: "/dashboard/client/projects",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const RECENT_JOBS = [
  {
    title: "Landing Page Design",
    apps: 5,
    status: "Open",
    statusColor: "#059669",
    statusBg: "#ECFDF5",
    posted: "2 days ago",
  },
  {
    title: "React Portfolio Site",
    apps: 2,
    status: "Open",
    statusColor: "#059669",
    statusBg: "#ECFDF5",
    posted: "4 days ago",
  },
  {
    title: "Social Media Kit",
    apps: 1,
    status: "Closed",
    statusColor: "#64748B",
    statusBg: "#F8FAFC",
    posted: "14 days ago",
  },
];

export default function ClientDashboard() {
  const navigate = useNavigate();
  return (
    <DashboardLayout role="client" title="Dashboard" activeNav="dashboard">
      <div className="flex flex-col gap-5">
        <VerificationReminderCard
          description="Complete KYC verification to start posting jobs and build trust with students."
          settingsPath="/dashboard/client/settings"
        />
        <WelcomeCard
          name="Dikshya Khanal"
          subtitle="Manage your jobs, review applications, and collaborate with talented students."
          actions={[
            {
              label: "Post a Job",
              onClick: () => navigate("/dashboard/client/post-job"),
              primary: true,
            },
          ]}
        />
        <StatGrid stats={clientStats} columns="grid-cols-2 sm:grid-cols-4" />
        <QuickActionsGrid
          actions={[
            {
              icon: PlusCircle,
              title: "Post a Job",
              description: "Publish a new project brief.",
              color: "#2563EB",
              bg: "#EFF6FF",
              onClick: () => navigate("/dashboard/client/post-job"),
            },
            {
              icon: Briefcase,
              title: "Manage Jobs",
              description: "View and manage your jobs.",
              color: "#14B8A6",
              bg: "#F0FDFA",
              onClick: () => navigate("/dashboard/client/manage-jobs"),
            },
            {
              icon: FolderOpen,
              title: "Projects",
              description: "Monitor active projects.",
              color: "#F59E0B",
              bg: "#FFFBEB",
              onClick: () => navigate("/dashboard/client/projects"),
            },
          ]}
          columns="sm:grid-cols-3"
        />
        <div className="grid lg:grid-cols-2 gap-5">
          <SectionCard title="Pending Actions" subtitle="Items requiring your attention.">
            <div className="flex flex-col gap-0">
              {PENDING_ACTIONS.map((a, i) => (
                <div
                  key={a.title}
                  className={`flex items-start justify-between gap-3 py-3.5 ${i < PENDING_ACTIONS.length - 1 ? "border-b border-black/[0.04]" : ""}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: a.bg }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-900 font-semibold" style={{ fontSize: "0.82rem" }}>
                        {a.title}
                      </p>
                      <p
                        className="text-slate-500 mt-0.5 leading-snug"
                        style={{ fontSize: "0.72rem" }}
                      >
                        {a.desc}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(a.path)}
                    className="text-blue-600 hover:text-blue-700 transition-colors shrink-0 mt-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Recent Jobs" subtitle="Your recently posted job listings.">
            <div className="flex flex-col gap-0">
              {RECENT_JOBS.map((j, i) => (
                <div
                  key={j.title}
                  className={`flex items-center justify-between gap-3 py-3 ${i < RECENT_JOBS.length - 1 ? "border-b border-black/[0.04]" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-slate-900 font-semibold truncate"
                      style={{ fontSize: "0.82rem" }}
                    >
                      {j.title}
                    </p>
                    <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.68rem" }}>
                      {j.apps} applications · {j.posted}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: j.statusBg, color: j.statusColor, fontSize: "0.62rem" }}
                    >
                      {j.status}
                    </span>
                    <button
                      onClick={() => navigate("/dashboard/client/manage-jobs")}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
