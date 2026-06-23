import { motion } from "motion/react";
import { DashboardLayout } from "../../app/components/layout/DashboardLayout";
import { useNavigate } from "react-router";
import { Search, Folder, CheckCircle, FileText, ChevronRight } from "lucide-react";
import { WelcomeCard } from "../../app/components/shared/WelcomeCard";
import { StatGrid } from "../../app/components/shared/StatCard";
import { QuickActionsGrid } from "../../app/components/shared/QuickActionCard";
import { SectionCard } from "../../app/components/shared/SectionCard";
import { VerificationReminderCard } from "../../app/components/shared/VerificationReminderCard";
import { PROJECTS } from "../../app/data/projects";

const IS_VERIFIED = false;

const studentStats = [
  { value: 12, label: "Total Applications", icon: FileText, color: "#2563EB", bg: "#EFF6FF" },
  { value: 2, label: "Active Projects", icon: Folder, color: "#14B8A6", bg: "#F0FDFA" },
  { value: 5, label: "Completed Projects", icon: CheckCircle, color: "#059669", bg: "#ECFDF5" },
];

const RECENT_APPS = [
  {
    title: "Landing Page Design for EdTech",
    status: "Pending",
    statusColor: "#D97706",
    statusBg: "#FFFBEB",
    applied: "10 Jun 2026",
  },
  {
    title: "React Portfolio Website",
    status: "Accepted",
    statusColor: "#059669",
    statusBg: "#ECFDF5",
    applied: "8 Jun 2026",
  },
  {
    title: "Investor Pitch Deck",
    status: "Pending",
    statusColor: "#D97706",
    statusBg: "#FFFBEB",
    applied: "6 Jun 2026",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const active = PROJECTS.filter((p) => p.status === "active" || p.status === "submitted").slice(
    0,
    3
  );

  return (
    <DashboardLayout role="student" title="Dashboard" activeNav="dashboard">
      <div className="flex flex-col gap-5">
        <VerificationReminderCard isVerified={IS_VERIFIED} />

        <WelcomeCard
          name="Ramit Sonar"
          subtitle="Build experience and grow your professional portfolio. Your next opportunity is waiting."
          actions={[
            {
              label: "Browse Jobs",
              onClick: () => navigate("/dashboard/student/browse-jobs"),
              primary: true,
            },
            ...(!IS_VERIFIED
              ? [
                  {
                    label: "Verify Account",
                    onClick: () => navigate("/dashboard/student/settings"),
                  },
                ]
              : []),
          ]}
        />

        <StatGrid stats={studentStats} />

        <QuickActionsGrid
          columns="sm:grid-cols-3"
          actions={[
            {
              icon: Search,
              title: "Browse Jobs",
              description: "Explore live project briefs.",
              color: "#14B8A6",
              bg: "#F0FDFA",
              onClick: () => navigate("/dashboard/student/browse-jobs"),
            },
            {
              icon: FileText,
              title: "My Applications",
              description: "Track all your applications.",
              color: "#F59E0B",
              bg: "#FFFBEB",
              onClick: () => navigate("/dashboard/student/applications"),
            },
            {
              icon: Folder,
              title: "My Projects",
              description: "View your active projects.",
              color: "#7C3AED",
              bg: "#F5F3FF",
              onClick: () => navigate("/dashboard/student/projects"),
            },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Applications */}
          <SectionCard title="Recent Applications" subtitle="Your latest job application activity.">
            <div className="flex flex-col gap-0">
              {RECENT_APPS.map((a, i) => (
                <div
                  key={a.title}
                  className={`flex items-center justify-between gap-3 py-3 ${i < RECENT_APPS.length - 1 ? "border-b border-black/[0.04]" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-slate-900 font-semibold truncate"
                      style={{ fontSize: "0.82rem" }}
                    >
                      {a.title}
                    </p>
                    <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.68rem" }}>
                      Applied {a.applied}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: a.statusBg, color: a.statusColor, fontSize: "0.62rem" }}
                    >
                      {a.status}
                    </span>
                    <button
                      onClick={() => navigate("/dashboard/student/applications")}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Active Projects */}
          <SectionCard title="Active Projects" subtitle="Your ongoing project work.">
            {active.length === 0 ? (
              <p className="text-slate-400 text-center py-6" style={{ fontSize: "0.82rem" }}>
                No active projects yet.
              </p>
            ) : (
              <div className="flex flex-col gap-0">
                {active.map((p, i) => {
                  const cfg =
                    p.status === "submitted"
                      ? { label: "Submitted", color: "#7C3AED", bg: "#F5F3FF" }
                      : { label: "Active", color: "#2563EB", bg: "#EFF6FF" };
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between gap-3 py-3 ${i < active.length - 1 ? "border-b border-black/[0.04]" : ""}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-slate-900 font-semibold truncate"
                          style={{ fontSize: "0.82rem" }}
                        >
                          {p.title}
                        </p>
                        <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.68rem" }}>
                          Due {p.deadline}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className="font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color, fontSize: "0.62rem" }}
                        >
                          {cfg.label}
                        </span>
                        <button
                          onClick={() => navigate(`/dashboard/student/projects/${p.id}`)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
