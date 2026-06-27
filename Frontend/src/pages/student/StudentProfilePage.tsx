import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Copy, Check, ExternalLink, X } from "lucide-react";

const PUBLIC_URL = "https://skillbridge.app/p/ramit-sonar";

function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
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
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-900 font-bold" style={{ fontSize: "0.95rem" }}>
              Share Profile
            </p>
            <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.72rem" }}>
              Share your professional profile with recruiters, clients, and employers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>
          <p className="text-slate-500 font-semibold mb-2" style={{ fontSize: "0.72rem" }}>
            Public Profile URL
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-w-0">
              <p className="text-slate-500 truncate" style={{ fontSize: "0.72rem" }}>
                {PUBLIC_URL}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                navigator.clipboard.writeText(PUBLIC_URL).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold transition-all shrink-0"
              style={{
                background: copied ? "#ECFDF5" : "#F8FAFC",
                color: copied ? "#059669" : "#64748B",
                borderColor: copied ? "#6EE7B7" : "#E2E8F0",
                fontSize: "0.72rem",
              }}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </motion.button>
          </div>
        </div>
        <a
          href="/p/ramit-sonar"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          style={{ fontSize: "0.875rem" }}
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open Profile
        </a>
      </motion.div>
    </motion.div>
  );
}
import {
  DashboardLayout,
  useDashboardCurrentUser,
} from "../../app/components/layout/DashboardLayout";
import { StudentProfileView } from "../../app/components/shared/StudentProfileView";
import { getProfile, subscribeProfile } from "../../app/data/profileStore";
import { PROJECTS } from "../../app/data/projects";

// Default static data shown when the store is empty (new user hasn't saved settings yet)
const DEFAULTS = {
  headline: "Computer Engineering Student",
  bio: "Computer Engineering student passionate about web development, React, UI design, and building modern digital products.",
  verified: true,
  skills: [
    { name: "React", verified: true },
    { name: "Figma", verified: true },
    { name: "UI Design", verified: true },
    { name: "TailwindCSS", verified: true },
    { name: "JavaScript", verified: false },
    { name: "TypeScript", verified: false },
    { name: "Node.js", verified: false },
    { name: "Framer", verified: false },
  ],
  rating: 4.8,
  reviewCount: 12,
  github: "github.com/ramitsharma",
  linkedin: "linkedin.com/in/ramitsharma",
  portfolio: "ramitsharma.com",
};

function StudentProfileContent() {
  const currentUser = useDashboardCurrentUser();
  const [shareOpen, setShareOpen] = useState(false);
  const [profile, setProfileState] = useState(getProfile());

  // Re-render whenever Settings saves to the store
  useEffect(() => subscribeProfile(() => setProfileState(getProfile())), []);

  // Merge store data with defaults: if the store field is non-empty, prefer it
  const p = profile;
  const name = p.name || currentUser?.fullName || "";
  const bio = p.bio || DEFAULTS.bio;
  const github = p.github || DEFAULTS.github;
  const linkedin = p.linkedin || DEFAULTS.linkedin;
  const portfolio = p.portfolio || DEFAULTS.portfolio;
  const initials = name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const skills =
    p.skills.length > 0
      ? p.skills.map((s) => ({
          name: s,
          verified: DEFAULTS.skills.some((d) => d.verified && d.name === s),
        }))
      : DEFAULTS.skills;

  const completedProjectsCount = PROJECTS.filter((pr) => pr.status === "completed").length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* Share button */}
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            style={{ fontSize: "0.78rem" }}
          >
            <Share2 className="w-3.5 h-3.5" /> Share Profile
          </motion.button>
        </div>

        <StudentProfileView
          profile={{
            name,
            initials,
            headline: p.bio
              ? p.education
                ? `${p.education} Student`
                : DEFAULTS.headline
              : DEFAULTS.headline,
            bio,
            verified: DEFAULTS.verified,
            skills,
            rating: DEFAULTS.rating,
            reviewCount: DEFAULTS.reviewCount,
            completedProjectsCount,
            github: github || undefined,
            linkedin: linkedin || undefined,
            portfolio: portfolio || undefined,
          }}
        />
      </motion.div>

      <AnimatePresence>
        {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function StudentProfilePage() {
  return (
    <DashboardLayout role="student" title="My Profile" activeNav="profile">
      <StudentProfileContent />
    </DashboardLayout>
  );
}
