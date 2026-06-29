import { useState } from "react";
import { type ElementType } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../../app/components/layout/DashboardLayout";
import { FilterChipGroup, StatusBadge } from "../../app/components/shared/ui";
import {
  Clock,
  Tag,
  ChevronRight,
  X,
  FileText,
  AlertTriangle,
  Search,
  FolderOpen,
  Calendar,
  MessageSquare,
  Timer,
  User,
} from "lucide-react";
import {
  SharedJobDetailsContent,
  type JobDetailData,
} from "../../app/components/shared/SharedJobDetailsContent";

// Types

type AppStatus = "pending" | "accepted" | "rejected";

interface Application {
  id: string;
  jobTitle: string;
  category: string;
  status: AppStatus;
  appliedAt: string;
  estimatedTime: string;
  budget: string;
  coverSnippet: string;
  coverMessage: string;
  whySuitable: string;
  job: JobDetailData;
}

// Dummy data

const DUMMY_APPS: Application[] = [
  {
    id: "a1",
    jobTitle: "Design a Landing Page for EdTech Startup",
    category: "UI/UX Design",
    status: "pending",
    appliedAt: "10 Jun 2026",
    estimatedTime: "7 Days",
    budget: "8,000",
    coverSnippet:
      "I have designed multiple landing pages for SaaS and EdTech clients using Figma...",
    coverMessage:
      "I have designed multiple landing pages for SaaS and EdTech clients using Figma and TailwindCSS. I understand user psychology and conversion-focused design principles, which I will apply to make this landing page both visually impressive and highly effective.",
    whySuitable:
      "I have 2+ years of UI/UX experience with a focus on EdTech products. My portfolio includes 5 similar landing page projects with measurable conversion improvements. I am also proficient in Figma, Adobe XD, and front-end implementation.",
    job: {
      title: "Design a Landing Page for EdTech Startup",
      category: "ui-ux",
      description:
        "We need a modern, conversion-focused landing page for our EdTech platform targeting college students. The design should be clean, engaging, and clearly communicate our value proposition.",
      requirements:
        "Must have experience with SaaS or EdTech product design. Portfolio required. Figma source files to be delivered.",
      skills: ["Figma", "UI Design", "Landing Page", "EdTech", "Conversion Design"],
      budget: "8,000",
      duration: "7d",
      deadline: "2026-06-30",
      complexity: "medium",
      postedAt: "8 Jun 2026",
      clientName: "Anil Chakraborty",
      clientInitials: "AC",
      clientLocation: "Kathmandu, Nepal",
      clientAbout:
        "Founder of LearnSphere, an EdTech startup focused on skill development for college students.",
      clientJobsPosted: 4,
      clientProjectsCompleted: 3,
      clientJoinedDate: "May 2026",
    },
  },
  {
    id: "a2",
    jobTitle: "Build a React Portfolio Website",
    category: "Web Development",
    status: "accepted",
    appliedAt: "8 Jun 2026",
    estimatedTime: "5 Days",
    budget: "6,500",
    coverSnippet:
      "I specialize in React and TailwindCSS and have built several portfolio websites...",
    coverMessage:
      "I specialize in React and TailwindCSS and have built several portfolio websites for designers, photographers, and developers. I focus on clean code, fast performance, and pixel-perfect implementation from Figma designs.",
    whySuitable:
      "I have built 10+ portfolio websites using React and TailwindCSS. I am comfortable with animations using Framer Motion, responsive layouts, and SEO best practices. I can deliver within 5 days with full source code.",
    job: {
      title: "Build a React Portfolio Website",
      category: "web-dev",
      description:
        "Looking for a developer to build a personal portfolio website using React and TailwindCSS. The design will be provided in Figma. The site should be fully responsive and optimized for performance.",
      requirements:
        "Strong React skills required. Must be comfortable with Figma handoff. Clean and commented code expected.",
      skills: ["React", "TailwindCSS", "Figma", "JavaScript", "Responsive Design"],
      budget: "6,500",
      duration: "5d",
      deadline: "2026-06-28",
      complexity: "small",
      postedAt: "6 Jun 2026",
      clientName: "Sneha Rao",
      clientInitials: "SR",
      clientLocation: "Lalitpur, Nepal",
      clientAbout:
        "Product designer and content creator. Looking for a reliable developer to bring my Figma designs to life.",
      clientJobsPosted: 2,
      clientProjectsCompleted: 2,
      clientJoinedDate: "Jun 2026",
    },
  },
  {
    id: "a4",
    jobTitle: "Create Social Media Post Templates",
    category: "Graphic Design",
    status: "rejected",
    appliedAt: "4 Jun 2026",
    estimatedTime: "3 Days",
    budget: "3,500",
    coverSnippet:
      "I am proficient in Canva and have created branded social media kits for local businesses...",
    coverMessage:
      "I am proficient in Canva and Adobe Illustrator and have created branded social media kits for local businesses and NGOs. I understand brand consistency and can create templates that are easy to edit and maintain.",
    whySuitable:
      "I have designed social media kits for 8+ clients across Instagram, Facebook, and LinkedIn. I deliver editable Canva and AI files with a style guide. My designs are clean, modern, and aligned with brand identity.",
    job: {
      title: "Create Social Media Post Templates",
      category: "graphic",
      description:
        "We need 20 editable social media post templates for Instagram and LinkedIn. Templates should reflect our brand colors, typography, and tone. Both feed posts and story sizes required.",
      requirements:
        "Proficiency in Canva or Adobe Illustrator. Must deliver editable files. Brand guidelines will be shared.",
      skills: ["Canva", "Graphic Design", "Social Media", "Brand Design", "Adobe Illustrator"],
      budget: "3,500",
      duration: "3d",
      deadline: "2026-06-27",
      complexity: "small",
      postedAt: "2 Jun 2026",
      clientName: "Meera Joshi",
      clientInitials: "MJ",
      clientLocation: "Kathmandu, Nepal",
      clientAbout:
        "Marketing manager at a local retail brand. Looking for fresh social media creative.",
      clientJobsPosted: 5,
      clientProjectsCompleted: 4,
      clientJoinedDate: "Mar 2026",
    },
  },
];

// Status configs

const APP_STATUS_CFG: Record<
  AppStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    dot: "#F59E0B",
  },
  accepted: {
    label: "Accepted",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#6EE7B7",
    dot: "#10B981",
  },
  rejected: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    dot: "#EF4444",
  },
};

const APP_FILTERS: { label: string; value: AppStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

// Confirm modal

function ConfirmModal({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  body,
  confirmLabel,
  confirmColor,
  onConfirm,
  onClose,
}: {
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl shadow-2xl p-7 flex flex-col items-center text-center gap-5 w-full max-w-sm"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon className="w-7 h-7" style={{ color: iconColor }} />
        </div>
        <div>
          <h3 className="text-slate-900" style={{ fontSize: "1rem", fontWeight: 800 }}>
            {title}
          </h3>
          <div className="text-slate-500 mt-2 leading-relaxed" style={{ fontSize: "0.82rem" }}>
            {body}
          </div>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold hover:text-slate-900 hover:border-slate-300 transition-all"
            style={{ fontSize: "0.875rem" }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setBusy(true);
              setTimeout(onConfirm, 900);
            }}
            disabled={busy}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: confirmColor, fontSize: "0.875rem" }}
          >
            {busy ? (
              <motion.span
                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// View Details slide panel

type DetailTab = "job" | "application";

function ViewDetailsPanel({
  app,
  onClose,
  onWithdraw,
}: {
  app: Application;
  onClose: () => void;
  onWithdraw: (id: string) => void;
}) {
  const [tab, setTab] = useState<DetailTab>("job");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const navigate = useNavigate();
  const cfg = APP_STATUS_CFG[app.status];

  const tabs: { label: string; value: DetailTab }[] = [
    { label: "Job Details", value: "job" },
    { label: "My Application", value: "application" },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-end"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg bg-slate-50 flex flex-col h-full shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white border-b border-black/[0.05] px-5 py-4 flex items-start justify-between gap-3 shrink-0">
            <div>
              <p className="text-slate-900 font-bold" style={{ fontSize: "0.95rem" }}>
                Application Details
              </p>
              <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.72rem" }}>
                Applied {app.appliedAt}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="bg-white border-b border-black/[0.05] px-5 py-3 flex gap-2 shrink-0">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className="px-4 py-1.5 rounded-full border font-semibold transition-all duration-200"
                style={{
                  background: tab === t.value ? "#EFF6FF" : "#F8FAFC",
                  color: tab === t.value ? "#2563EB" : "#64748B",
                  borderColor: tab === t.value ? "#BFDBFE" : "#E2E8F0",
                  fontSize: "0.78rem",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content — single scroll area per tab */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {tab === "job" ? (
                <motion.div
                  key="job"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SharedJobDetailsContent job={app.job} />
                </motion.div>
              ) : (
                <motion.div
                  key="application"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="p-5 flex flex-col gap-4"
                >
                  {/* Status row */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-2 text-slate-500"
                        style={{ fontSize: "0.78rem" }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Application Date</span>
                      </div>
                      <span
                        className="text-slate-900 font-semibold"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {app.appliedAt}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-2 text-slate-500"
                        style={{ fontSize: "0.78rem" }}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Status</span>
                      </div>
                      <StatusBadge
                        config={cfg}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold"
                        style={{ fontSize: "0.65rem" }}
                      />
                    </div>
                  </div>

                  {/* Cover Message */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-slate-900 font-bold" style={{ fontSize: "0.8rem" }}>
                        Cover Message
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed" style={{ fontSize: "0.8rem" }}>
                      {app.coverMessage}
                    </p>
                  </div>

                  {/* Estimated Completion Time */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-900 font-bold" style={{ fontSize: "0.8rem" }}>
                        Estimated Completion Time
                      </span>
                    </div>
                    <span
                      className="bg-emerald-50 text-emerald-600 font-semibold px-3 py-1 rounded-full border border-emerald-300"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {app.estimatedTime}
                    </span>
                  </div>

                  {/* Why Are You Suitable */}
                  <div className="bg-white rounded-2xl border border-black/[0.06] p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-violet-600" />
                      <span className="text-slate-900 font-bold" style={{ fontSize: "0.8rem" }}>
                        Why Are You Suitable?
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed" style={{ fontSize: "0.8rem" }}>
                      {app.whySuitable}
                    </p>
                  </div>

                  {/* Status actions */}
                  {app.status === "pending" && (
                    <button
                      onClick={() => setShowWithdraw(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition-colors"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <X className="w-4 h-4" /> Withdraw Application
                    </button>
                  )}
                  {app.status === "accepted" && (
                    <button
                      onClick={() => navigate("/dashboard/student/projects")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <FolderOpen className="w-4 h-4" /> Go To Project
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showWithdraw && (
          <ConfirmModal
            icon={AlertTriangle}
            iconBg="#FEF2F2"
            iconColor="#EF4444"
            title="Withdraw Application?"
            body={
              <>
                Are you sure you want to withdraw your application for{" "}
                <span className="font-semibold text-slate-900">"{app.jobTitle}"</span>? This action
                cannot be undone.
              </>
            }
            confirmLabel="Withdraw Application"
            confirmColor="#EF4444"
            onConfirm={() => {
              onWithdraw(app.id);
              setShowWithdraw(false);
              onClose();
            }}
            onClose={() => setShowWithdraw(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Application card

function AppCard({
  app,
  onWithdraw,
  onViewDetails,
}: {
  app: Application;
  onWithdraw: (id: string) => void;
  onViewDetails: (app: Application) => void;
}) {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const navigate = useNavigate();
  const cfg = APP_STATUS_CFG[app.status];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="group bg-white rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-5 flex flex-col sm:flex-row sm:items-start gap-4"
      >
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="flex items-start gap-3 flex-wrap">
            <StatusBadge
              config={cfg}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold"
              style={{ fontSize: "0.65rem" }}
            />
            <span className="text-slate-400" style={{ fontSize: "0.65rem" }}>
              Applied {app.appliedAt}
            </span>
          </div>
          <h3
            className="text-slate-900 leading-snug"
            style={{ fontSize: "0.95rem", fontWeight: 700 }}
          >
            {app.jobTitle}
          </h3>
          <p
            className="text-slate-500 leading-relaxed line-clamp-1"
            style={{ fontSize: "0.78rem" }}
          >
            {app.coverSnippet}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full"
              style={{ fontSize: "0.62rem" }}
            >
              {app.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-slate-500" style={{ fontSize: "0.72rem" }}>
                {app.estimatedTime}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-semibold" style={{ fontSize: "0.72rem" }}>
                Rs. {app.budget}
              </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
          {/* View Details — always shown */}
          <button
            onClick={() => onViewDetails(app)}
            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-200 transition-all duration-200"
            style={{ fontSize: "0.75rem" }}
          >
            View Details <ChevronRight className="w-3 h-3" />
          </button>

          {/* Pending: Withdraw */}
          {app.status === "pending" && (
            <button
              onClick={() => setShowWithdraw(true)}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 font-semibold px-4 py-2 rounded-xl border border-transparent hover:border-red-100 transition-all duration-200"
              style={{ fontSize: "0.75rem" }}
            >
              <X className="w-3 h-3" /> Withdraw
            </button>
          )}

          {/* Accepted: Go To Project */}
          {app.status === "accepted" && (
            <button
              onClick={() => navigate("/dashboard/student/projects")}
              className="inline-flex items-center gap-1.5 text-emerald-600 hover:bg-emerald-50 font-semibold px-4 py-2 rounded-xl border border-transparent hover:border-emerald-300 transition-all duration-200"
              style={{ fontSize: "0.75rem" }}
            >
              <FolderOpen className="w-3 h-3" /> Go To Project
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showWithdraw && (
          <ConfirmModal
            icon={AlertTriangle}
            iconBg="#FEF2F2"
            iconColor="#EF4444"
            title="Withdraw Application?"
            body={
              <>
                Are you sure you want to withdraw your application for{" "}
                <span className="font-semibold text-slate-900">"{app.jobTitle}"</span>? This action
                cannot be undone.
              </>
            }
            confirmLabel="Withdraw Application"
            confirmColor="#EF4444"
            onConfirm={() => {
              onWithdraw(app.id);
              setShowWithdraw(false);
            }}
            onClose={() => setShowWithdraw(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Empty state

function AppliedEmpty() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
        <FileText className="w-9 h-9 text-slate-300" />
      </div>
      <div>
        <p className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
          No Applications Yet
        </p>
        <p className="text-slate-500 mt-1 max-w-xs leading-relaxed" style={{ fontSize: "0.85rem" }}>
          You haven't applied for any jobs yet. Browse available opportunities to get started.
        </p>
      </div>
      <button
        onClick={() => navigate("/dashboard/student/browse-jobs")}
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
        style={{ fontSize: "0.875rem" }}
      >
        <Search className="w-4 h-4" /> Browse Jobs
      </button>
    </motion.div>
  );
}

// Main page

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<Application[]>(DUMMY_APPS);
  const [appFilter, setAppFilter] = useState<AppStatus | "all">("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApps = appFilter === "all" ? apps : apps.filter((a) => a.status === appFilter);

  const appCounts: Record<string, number> = { all: apps.length };
  apps.forEach((a) => {
    appCounts[a.status] = (appCounts[a.status] ?? 0) + 1;
  });

  const handleWithdraw = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    if (selectedApp?.id === id) setSelectedApp(null);
  };

  return (
    <DashboardLayout role="student" title="My Applications" activeNav="applications">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-slate-900" style={{ fontSize: "1.1rem", fontWeight: 800 }}>
              My Applications
            </h2>
            <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.82rem" }}>
              Track all your submitted job applications.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <span className="text-slate-900 font-bold" style={{ fontSize: "0.85rem" }}>
              {apps.length}
            </span>
            <span className="text-slate-500" style={{ fontSize: "0.82rem" }}>
              applications
            </span>
          </div>
        </div>

        {/* Filter chips */}
        <FilterChipGroup
          items={APP_FILTERS.map((opt) => ({
            ...opt,
            count: appCounts[opt.value] ?? 0,
            config: opt.value !== "all" ? APP_STATUS_CFG[opt.value] : undefined,
          }))}
          activeValue={appFilter}
          onChange={setAppFilter}
        />

        {/* Applications list */}
        {filteredApps.length === 0 ? (
          <AppliedEmpty />
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filteredApps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <AppCard app={app} onWithdraw={handleWithdraw} onViewDetails={setSelectedApp} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* View Details panel */}
      <AnimatePresence>
        {selectedApp && (
          <ViewDetailsPanel
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onWithdraw={handleWithdraw}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
