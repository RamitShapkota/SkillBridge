import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  X,
  CheckCircle,
  Github,
  Linkedin,
  Globe,
  Clock,
  Tag,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { JOB_CATEGORY_LABELS, JOB_DURATION_LABELS, JOB_SKILL_COLORS } from "../../constants/job.constants";
import type { BrowseJob } from "../../types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApplyModalProps {
  job: BrowseJob;
  onClose: () => void;
}

// ── Config ────────────────────────────────────────────────────────────────────

const TIME_OPTIONS = [
  { value: "1d", label: "1 Day" },
  { value: "3d", label: "3 Days" },
  { value: "5d", label: "5 Days" },
  { value: "7d", label: "7 Days" },
  { value: "custom", label: "Custom" },
];

// Dummy student profile — replace with auth context later
const STUDENT_PROFILE = {
  name: "Ramit Sonar",
  initials: "RS",
  university: "Tribhuvan University",
  skills: ["React", "JavaScript", "Figma", "HTML", "CSS", "TailwindCSS"],
  completedProjects: 5,
  github: "#",
  linkedin: "#",
  portfolio: "#",
  verificationStatus: "pending" as const,
};

// ── Chip selector ─────────────────────────────────────────────────────────────

function TimeChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      transition={{ duration: 0.12 }}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-semibold transition-all duration-200"
      style={{
        background: active ? "#EFF6FF" : "#F8FAFC",
        color: active ? "#2563EB" : "#64748B",
        borderColor: active ? "#2563EB" : "#E2E8F0",
        boxShadow: active ? "0 0 0 2px rgba(37,99,235,0.12)" : "none",
        fontSize: "0.8rem",
      }}
    >
      {active && <CheckCircle className="w-3 h-3 text-blue-600" />}
      {label}
    </motion.button>
  );
}

// ── Profile preview ───────────────────────────────────────────────────────────

function SkillChip({
  skill,
  index,
  fontSize = "0.65rem",
}: {
  skill: string;
  index: number;
  fontSize?: string;
}) {
  const color = JOB_SKILL_COLORS[index % JOB_SKILL_COLORS.length];

  return (
    <span
      className="px-2 py-0.5 rounded-lg font-semibold"
      style={{ background: color.bg, color: color.color, fontSize }}
    >
      {skill}
    </span>
  );
}

function ProfilePreview() {
  const profile = STUDENT_PROFILE;
  return (
    <div className="bg-slate-50 rounded-2xl border border-black/[0.05] p-5 flex flex-col gap-4">
      <p className="text-slate-900 font-bold" style={{ fontSize: "0.82rem" }}>
        Your Profile
      </p>

      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-extrabold shrink-0"
          style={{ fontSize: "0.9rem" }}
        >
          {profile.initials}
        </div>
        <div className="min-w-0">
          <p className="text-slate-900 font-bold leading-snug" style={{ fontSize: "0.875rem" }}>
            {profile.name}
          </p>
          <p className="text-slate-500 truncate" style={{ fontSize: "0.68rem" }}>
            {profile.university}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-600 font-semibold" style={{ fontSize: "0.6rem" }}>
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <p
          className="text-slate-400 mb-2 font-semibold"
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((skill, index) => (
            <SkillChip key={skill} skill={skill} index={index} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-black/[0.05]">
        <div>
          <p className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
            {profile.completedProjects}
          </p>
          <p className="text-slate-400" style={{ fontSize: "0.65rem" }}>
            Projects done
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={profile.github}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
          <a
            href={profile.linkedin}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 shadow-sm"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href={profile.portfolio}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-teal-500 hover:border-teal-200 transition-all duration-200 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({
  onViewApplications,
  onClose,
}: {
  onViewApplications: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center py-12 px-8 gap-6"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center shadow-lg"
      >
        <CheckCircle className="w-10 h-10 text-emerald-600" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <h3
          className="text-slate-900 tracking-tight"
          style={{ fontSize: "1.3rem", fontWeight: 800 }}
        >
          Application Submitted!
        </h3>
        <p
          className="text-slate-500 mt-2 leading-relaxed max-w-sm"
          style={{ fontSize: "0.875rem" }}
        >
          Your application has been sent successfully. You can track the status from My
          Applications.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <button
          onClick={onViewApplications}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          style={{ fontSize: "0.875rem" }}
        >
          View My Applications
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 bg-white text-slate-500 font-semibold px-6 py-2.5 rounded-xl border border-slate-200 hover:text-slate-900 hover:border-slate-300 transition-all"
          style={{ fontSize: "0.875rem" }}
        >
          Browse More Jobs
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [coverMessage, setCoverMessage] = useState("");
  const [whySuitable, setWhySuitable] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const canSubmit =
    coverMessage.trim().length >= 20 && whySuitable.trim().length >= 10 && estimatedTime;

  const submitApplication = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitApplication();
  };

  const handleViewApplications = () => {
    onClose();
    navigate("/dashboard/student/applications");
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !submitted) onClose();
        }}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl shadow-2xl w-full overflow-hidden flex flex-col"
          style={{ maxWidth: 740, maxHeight: "92vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.05] shrink-0">
            <div>
              <h2 className="text-slate-900" style={{ fontSize: "1rem", fontWeight: 800 }}>
                {submitted ? "Application Sent" : "Apply for this Job"}
              </h2>
              {!submitted && (
                <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.72rem" }}>
                  Complete the form below to submit your application.
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SuccessScreen onViewApplications={handleViewApplications} onClose={onClose} />
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col lg:flex-row gap-0"
                >
                  {/* Left: form */}
                  <div className="flex-1 p-6 flex flex-col gap-5">
                    {/* Job summary card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                      <p
                        className="text-slate-400 font-semibold"
                        style={{
                          fontSize: "0.65rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        Applying for
                      </p>
                      <h3
                        className="text-slate-900 leading-snug"
                        style={{ fontSize: "0.9rem", fontWeight: 700 }}
                      >
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span
                            className="text-slate-900 font-semibold"
                            style={{ fontSize: "0.72rem" }}
                          >
                            Rs. {job.budget}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-500" style={{ fontSize: "0.72rem" }}>
                            {JOB_DURATION_LABELS[job.duration] ?? job.duration}
                          </span>
                        </div>
                        <span
                          className="bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full"
                          style={{ fontSize: "0.62rem" }}
                        >
                          {JOB_CATEGORY_LABELS[job.category] ?? job.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <SkillChip key={skill} skill={skill} index={index} fontSize="0.62rem" />
                        ))}
                      </div>
                    </div>

                    {/* Cover message */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          className="text-slate-900 font-semibold"
                          style={{ fontSize: "0.82rem" }}
                        >
                          Cover Message <span className="text-red-400">*</span>
                        </label>
                        <span className="text-slate-300" style={{ fontSize: "0.68rem" }}>
                          {coverMessage.length} chars{" "}
                          {coverMessage.length > 0 && coverMessage.length < 20 && (
                            <span className="text-red-300">(min 20)</span>
                          )}
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 outline-none transition-all duration-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 resize-none"
                        style={{ fontSize: "0.875rem" }}
                        placeholder="Briefly explain why you are a good fit for this project..."
                        value={coverMessage}
                        onChange={(e) => setCoverMessage(e.target.value)}
                      />
                    </div>

                    {/* Estimated completion time */}
                    <div className="flex flex-col gap-2">
                      <label
                        className="text-slate-900 font-semibold"
                        style={{ fontSize: "0.82rem" }}
                      >
                        Your Estimated Completion Time <span className="text-red-400">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TIME_OPTIONS.map((opt) => (
                          <TimeChip
                            key={opt.value}
                            label={opt.label}
                            active={estimatedTime === opt.value}
                            onClick={() =>
                              setEstimatedTime(estimatedTime === opt.value ? "" : opt.value)
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Why suitable */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-slate-900 font-semibold"
                        style={{ fontSize: "0.82rem" }}
                      >
                        Why Are You Suitable? <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 outline-none transition-all duration-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 resize-none"
                        style={{ fontSize: "0.875rem" }}
                        placeholder="Highlight your relevant skills and experience for this specific project..."
                        value={whySuitable}
                        onChange={(e) => setWhySuitable(e.target.value)}
                      />
                    </div>

                    {/* Validation hint */}
                    {!canSubmit && (coverMessage || whySuitable || estimatedTime) && (
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <p className="text-slate-400" style={{ fontSize: "0.75rem" }}>
                          Please complete all required fields to submit.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: profile preview */}
                  <div className="lg:w-64 p-6 lg:pt-6 lg:pl-0 flex flex-col gap-4">
                    <ProfilePreview />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="px-6 py-4 border-t border-black/[0.05] flex items-center gap-3 shrink-0 bg-white">
              <motion.button
                type="submit"
                form="apply-form"
                disabled={!canSubmit || submitting}
                whileHover={
                  canSubmit && !submitting
                    ? {
                        scale: 1.02,
                        boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
                      }
                    : {}
                }
                whileTap={canSubmit && !submitting ? { scale: 0.97 } : {}}
                transition={{ duration: 0.18 }}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-semibold px-7 py-3 rounded-xl transition-colors duration-200 ${
                  canSubmit && !submitting
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
                style={{ fontSize: "0.875rem" }}
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
                  "Submit Application"
                )}
              </motion.button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-white text-slate-500 font-semibold px-5 py-3 rounded-xl border border-slate-200 hover:text-slate-900 hover:border-slate-300 transition-all duration-200"
                style={{ fontSize: "0.875rem" }}
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
