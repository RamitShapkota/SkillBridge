import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { DashboardLayout, type DashboardRole } from "../../app/components/layout/DashboardLayout";
import { PROJECTS, type ProjectStatus, type ProjectFile } from "../../app/data/projects";
import { ReviewModal } from "../../app/components/ReviewModal";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Upload,
  X,
  FileText,
  Award,
  Link,
  Circle,
  Download,
} from "lucide-react";

// Status config

const STATUS_CFG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  active: {
    label: "Active",
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  submitted: {
    label: "Submitted",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  completed: {
    label: "Completed",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#6EE7B7",
  },
};

const STEPS: { key: ProjectStatus; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "submitted", label: "Submitted" },
  { key: "completed", label: "Completed" },
];

// Helpers

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(type: string) {
  if (type.includes("zip")) return { label: "ZIP", color: "#D97706", bg: "#FFFBEB" };
  if (type.includes("pdf")) return { label: "PDF", color: "#DC2626", bg: "#FEF2F2" };
  if (type.includes("image")) return { label: "IMG", color: "#7C3AED", bg: "#F5F3FF" };
  if (type.includes("presentation")) return { label: "PPT", color: "#059669", bg: "#ECFDF5" };
  return { label: "DOC", color: "#2563EB", bg: "#EFF6FF" };
}

// Progress tracker

function ProgressTracker({ status }: { status: ProjectStatus }) {
  const stepIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="bg-white rounded-2xl border border-black/[0.05] shadow-sm p-5">
      <p className="text-slate-900 font-bold mb-5" style={{ fontSize: "0.9rem" }}>
        Project Progress
      </p>
      <div className="flex flex-col gap-0">
        {STEPS.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          const pending = i > stepIndex;
          const isLast = i === STEPS.length - 1;
          const color = active ? STATUS_CFG[step.key].color : done ? "#059669" : "#CBD5E1";

          return (
            <div key={step.key} className="flex gap-4">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    background: pending ? "#F1F5F9" : done ? "#ECFDF5" : STATUS_CFG[step.key].bg,
                  }}
                >
                  {done ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : active ? (
                    <Circle className="w-3.5 h-3.5" fill={color} color={color} />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </motion.div>
                {!isLast && (
                  <div
                    className="w-px flex-1 my-1.5"
                    style={{
                      background: done ? "#6EE7B7" : "#E2E8F0",
                      minHeight: "1.5rem",
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="pb-5 flex items-center gap-2 mt-1.5">
                <p
                  className="font-semibold leading-tight"
                  style={{
                    fontSize: "0.82rem",
                    color: pending ? "#CBD5E1" : active ? color : "#059669",
                  }}
                >
                  {step.label}
                </p>
                {active && (
                  <span
                    className="text-white font-bold px-2 py-0.5 rounded-full"
                    style={{ background: color, fontSize: "0.55rem" }}
                  >
                    CURRENT
                  </span>
                )}
                {done && (
                  <span className="text-emerald-600 font-semibold" style={{ fontSize: "0.62rem" }}>
                    ✓ Done
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Confirm modal

function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onClose,
  children,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
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
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm flex flex-col gap-5"
      >
        <div>
          <h3 className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
            {title}
          </h3>
          <p className="text-slate-500 mt-1.5 leading-relaxed" style={{ fontSize: "0.82rem" }}>
            {message}
          </p>
        </div>
        {children}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold hover:text-slate-900 transition-all"
            style={{ fontSize: "0.875rem" }}
          >
            Cancel
          </button>
          <motion.button
            whileHover={!busy ? { scale: 1.02 } : {}}
            whileTap={!busy ? { scale: 0.97 } : {}}
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
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// File upload area

function FileUploadArea({
  files,
  onAdd,
  onRemove,
}: {
  files: ProjectFile[];
  onAdd: (f: ProjectFile) => void;
  onRemove: (name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = useCallback(
    (raw: File) => {
      if (!files.find((f) => f.name === raw.name))
        onAdd({ name: raw.name, size: raw.size, type: raw.type });
    },
    [files, onAdd]
  );

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        animate={dragging ? { scale: 1.01 } : { scale: 1 }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          Array.from(e.dataTransfer.files).forEach(handle);
        }}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center gap-2.5 rounded-2xl py-7 px-4 cursor-pointer transition-all duration-200"
        style={{
          border: `2px dashed ${dragging ? "#2563EB" : "#E2E8F0"}`,
          background: dragging ? "#EFF6FF" : "#F8FAFC",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: dragging ? "#BFDBFE" : "#E2E8F0" }}
        >
          <Upload className="w-4 h-4" style={{ color: dragging ? "#2563EB" : "#94A3B8" }} />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-semibold" style={{ fontSize: "0.82rem" }}>
            Drag and drop files here
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            style={{ fontSize: "0.75rem" }}
          >
            Browse Files
          </button>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {["ZIP", "PDF", "DOCX", "PNG", "JPG"].map((ext) => (
            <span
              key={ext}
              className="bg-white border border-slate-200 text-slate-500 font-semibold px-2 py-0.5 rounded-md"
              style={{ fontSize: "0.58rem" }}
            >
              {ext}
            </span>
          ))}
        </div>
      </motion.div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.png,.jpg,.jpeg,.zip"
        className="hidden"
        onChange={(e) => {
          Array.from(e.target.files ?? []).forEach(handle);
          e.target.value = "";
        }}
      />
      <AnimatePresence>
        {files.map((f) => {
          const ic = fileIcon(f.type);
          return (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: ic.bg }}
              >
                <span
                  style={{
                    fontSize: "0.5rem",
                    fontWeight: 800,
                    color: ic.color,
                  }}
                >
                  {ic.label}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-medium truncate" style={{ fontSize: "0.78rem" }}>
                  {f.name}
                </p>
                <p className="text-slate-400" style={{ fontSize: "0.65rem" }}>
                  {formatSize(f.size)}
                </p>
              </div>
              <button
                onClick={() => onRemove(f.name)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Submitted files (read-only)

function SubmittedFiles({ files }: { files: ProjectFile[] }) {
  return (
    <div className="flex flex-col gap-2">
      {files.map((f) => {
        const ic = fileIcon(f.type);
        return (
          <div
            key={f.name}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: ic.bg }}
            >
              <span style={{ fontSize: "0.5rem", fontWeight: 800, color: ic.color }}>
                {ic.label}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 font-medium truncate" style={{ fontSize: "0.78rem" }}>
                {f.name}
              </p>
              <p className="text-slate-400" style={{ fontSize: "0.65rem" }}>
                {formatSize(f.size)}
              </p>
            </div>
            <button
              className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Section label

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-300 outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10";

// Main workspace

export default function ProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const role: DashboardRole = location.pathname.includes("/student/") ? "student" : "client";

  const projectData = PROJECTS.find((p) => p.id === id);

  const [status, setStatus] = useState<ProjectStatus>(projectData?.status ?? "active");
  const [submissionFiles, setSubmissionFiles] = useState<ProjectFile[]>(
    projectData?.submissionFiles ?? []
  );
  const [submissionNotes, setSubmissionNotes] = useState(projectData?.submissionNotes ?? "");
  const [demoLink, setDemoLink] = useState(projectData?.demoLink ?? "");
  const [submittedAt, setSubmittedAt] = useState(projectData?.submittedAt ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [, setSubmitted] = useState(!!projectData?.submittedAt);
  const [showApprove, setShowApprove] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!projectData) {
    return (
      <DashboardLayout role={role} title="Project" activeNav="projects">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
            Project not found
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 font-semibold hover:text-blue-700"
            style={{ fontSize: "0.875rem" }}
          >
            ← Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const cfg = STATUS_CFG[status];

  const canSubmit = submissionFiles.length > 0 && submissionNotes.trim().length > 0 && !submitting;

  const handleSubmitWork = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setStatus("submitted");
      setSubmittedAt(
        new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1400);
  };

  const handleApprove = () => {
    setStatus("completed");
    setShowApprove(false);
    setShowReview(true);
  };

  return (
    <DashboardLayout role={role} title={projectData.title} activeNav="projects">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-5"
      >
        {/* Back */}
        <button
          onClick={() => navigate(`/dashboard/${role}/projects`)}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-semibold transition-colors w-fit"
          style={{ fontSize: "0.8rem" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </button>

        {/* Card 1 — Project Header */}
        <div className="bg-white rounded-2xl border border-black/[0.05] shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <h1
                className="text-slate-900 tracking-tight"
                style={{
                  fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {projectData.title}
              </h1>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold w-fit"
                style={{
                  background: cfg.bg,
                  color: cfg.color,
                  borderColor: cfg.border,
                  fontSize: "0.62rem",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: cfg.color }}
                />
                {cfg.label}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-black/[0.05]">
            {[
              {
                label: "Student",
                value: projectData.student.name,
                initials: projectData.student.initials,
                accent: "#2563EB",
              },
              {
                label: "Client",
                value: projectData.client.name,
                initials: projectData.client.initials,
                accent: "#D97706",
              },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ background: p.accent, fontSize: "0.48rem" }}
                >
                  {p.initials}
                </div>
                <span className="text-slate-500" style={{ fontSize: "0.75rem" }}>
                  {p.label}: <span className="font-semibold text-slate-900">{p.value}</span>
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500" style={{ fontSize: "0.75rem" }}>
                Due <span className="font-semibold text-slate-900">{projectData.deadline}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold" style={{ fontSize: "0.75rem" }}>
                Rs. {projectData.budget}
              </span>
            </div>
          </div>
        </div>

        {/* Cards 2+3 side-by-side on desktop */}
        <div className="grid lg:grid-cols-3 gap-5 items-start">
          {/* Card 2 — Progress (left, 1/3) */}
          <ProgressTracker status={status} />

          {/* Card 3 — Requirements (right, 2/3) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-black/[0.05] shadow-sm p-5 flex flex-col gap-4">
            <p className="text-slate-900 font-bold" style={{ fontSize: "0.9rem" }}>
              Project Requirements
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <p
                  className="text-slate-400 font-semibold mb-1.5"
                  style={{
                    fontSize: "0.62rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Description
                </p>
                <p className="text-slate-600 leading-relaxed" style={{ fontSize: "0.82rem" }}>
                  {projectData.description}
                </p>
              </div>
              <div>
                <p
                  className="text-slate-400 font-semibold mb-1.5"
                  style={{
                    fontSize: "0.62rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Client Requirements
                </p>
                <p className="text-slate-600 leading-relaxed" style={{ fontSize: "0.82rem" }}>
                  {projectData.requirements}
                </p>
              </div>
              {projectData.skills.length > 0 && (
                <div>
                  <p
                    className="text-slate-400 font-semibold mb-1.5"
                    style={{
                      fontSize: "0.62rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {projectData.skills.map((s) => (
                      <span
                        key={s}
                        className="bg-slate-50 border border-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-lg"
                        style={{ fontSize: "0.72rem" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 4 — Submission / Review */}

        {/* Student View */}
        {role === "student" && (
          <div className="bg-white rounded-2xl border border-black/[0.05] shadow-sm p-5 flex flex-col gap-5">
            <p className="text-slate-900 font-bold" style={{ fontSize: "0.9rem" }}>
              Submit Your Work
            </p>

            {status === "active" && (
              <>
                {/* Files */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 font-semibold" style={{ fontSize: "0.82rem" }}>
                    Submission Files <span className="text-red-400">*</span>
                  </label>
                  <FileUploadArea
                    files={submissionFiles}
                    onAdd={(f) => setSubmissionFiles((p) => [...p, f])}
                    onRemove={(name) => setSubmissionFiles((p) => p.filter((f) => f.name !== name))}
                  />
                </div>

                {/* Live Demo Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 font-semibold" style={{ fontSize: "0.82rem" }}>
                    Live Demo Link <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={demoLink}
                      onChange={(e) => setDemoLink(e.target.value)}
                      placeholder="https://your-project.vercel.app"
                      className={`${inputCls} pl-10`}
                      style={{ fontSize: "0.875rem" }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 font-semibold" style={{ fontSize: "0.82rem" }}>
                    Submission Notes <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Describe what you have completed and any important details for the client."
                    className={`${inputCls} resize-none`}
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>

                <motion.button
                  onClick={handleSubmitWork}
                  disabled={!canSubmit}
                  whileHover={
                    canSubmit
                      ? {
                          scale: 1.02,
                          boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
                        }
                      : {}
                  }
                  whileTap={canSubmit ? { scale: 0.97 } : {}}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-colors ${canSubmit ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
                  style={{ fontSize: "0.9rem" }}
                >
                  {submitting ? (
                    <>
                      <motion.span
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Submit Work
                    </>
                  )}
                </motion.button>
              </>
            )}

            {(status === "submitted" || status === "completed") && (
              <div className="flex flex-col gap-4">
                {submittedAt && (
                  <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5">
                    <CheckCircle className="w-4 h-4 text-violet-600" />
                    <p className="text-violet-600 font-semibold" style={{ fontSize: "0.78rem" }}>
                      Submitted on {submittedAt}
                    </p>
                  </div>
                )}
                {submissionFiles.length > 0 && (
                  <div>
                    <p
                      className="text-slate-400 font-semibold mb-2"
                      style={{
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Submitted Files
                    </p>
                    <SubmittedFiles files={submissionFiles} />
                  </div>
                )}
                {demoLink && (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                    <Link className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <a
                      href={demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline truncate"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {demoLink}
                    </a>
                  </div>
                )}
                {submissionNotes && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p
                      className="text-slate-400 font-semibold mb-1"
                      style={{
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Your Notes
                    </p>
                    <p className="text-slate-600 leading-relaxed" style={{ fontSize: "0.8rem" }}>
                      {submissionNotes}
                    </p>
                  </div>
                )}
                {status === "completed" && (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <Award className="w-7 h-7 text-emerald-600" />
                    </div>
                    <p className="text-emerald-600 font-bold" style={{ fontSize: "0.95rem" }}>
                      Project Completed!
                    </p>
                    <p
                      className="text-slate-500 text-center leading-relaxed"
                      style={{ fontSize: "0.82rem" }}
                    >
                      The client approved your work. Great job!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Client View */}
        {role === "client" && (
          <div className="bg-white rounded-2xl border border-black/[0.05] shadow-sm p-5 flex flex-col gap-5">
            <p className="text-slate-900 font-bold" style={{ fontSize: "0.9rem" }}>
              Review Submission
            </p>

            {status === "active" && (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-400" style={{ fontSize: "0.85rem" }}>
                  Waiting for student to submit work.
                </p>
              </div>
            )}

            {(status === "submitted" || status === "completed") && (
              <div className="flex flex-col gap-4">
                {submittedAt && (
                  <p
                    className="text-slate-400 font-semibold"
                    style={{
                      fontSize: "0.62rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Submitted On: {submittedAt}
                  </p>
                )}
                {submissionFiles.length > 0 && (
                  <div>
                    <p
                      className="text-slate-400 font-semibold mb-2"
                      style={{
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Submitted Files
                    </p>
                    <SubmittedFiles files={submissionFiles} />
                  </div>
                )}
                {demoLink && (
                  <div>
                    <p
                      className="text-slate-400 font-semibold mb-1.5"
                      style={{
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Live Demo
                    </p>
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                      <Link className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a
                        href={demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline truncate"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {demoLink}
                      </a>
                    </div>
                  </div>
                )}
                {submissionNotes && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p
                      className="text-slate-400 font-semibold mb-1"
                      style={{
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Student Notes
                    </p>
                    <p className="text-slate-600 leading-relaxed" style={{ fontSize: "0.8rem" }}>
                      {submissionNotes}
                    </p>
                  </div>
                )}

                {status === "submitted" && (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowApprove(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Work
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setStatus("active");
                        setSubmitted(false);
                        setSubmittedAt("");
                        setSubmissionFiles([]);
                        setSubmissionNotes("");
                        setDemoLink("");
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-3 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <XCircle className="w-4 h-4" /> Reject Work
                    </motion.button>
                  </div>
                )}

                {status === "completed" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-300 rounded-2xl p-4">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-emerald-600 font-bold" style={{ fontSize: "0.875rem" }}>
                          Work Approved
                        </p>
                        <p className="text-emerald-300" style={{ fontSize: "0.72rem" }}>
                          This project has been completed successfully.
                        </p>
                      </div>
                    </div>
                    {!reviewSubmitted ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowReview(true)}
                        className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-600 font-semibold py-2.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
                        style={{ fontSize: "0.875rem" }}
                      >
                        ⭐ Leave a Review
                      </motion.button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 py-2.5 rounded-xl">
                        <span style={{ fontSize: "0.82rem" }}>⭐ Review Submitted</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showApprove && (
          <ConfirmModal
            title="Approve Work"
            message={`Are you sure you want to approve the submission for "${projectData.title}"?`}
            confirmLabel="Approve Work"
            confirmColor="#059669"
            onConfirm={handleApprove}
            onClose={() => setShowApprove(false)}
          />
        )}
        {showReview && (
          <ReviewModal
            studentName={projectData.student.name}
            studentInitials={projectData.student.initials}
            projectName={projectData.title}
            completedAt={projectData.deadline}
            onClose={() => setShowReview(false)}
            onSubmit={() => {
              setReviewSubmitted(true);
              setShowReview(false);
            }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
