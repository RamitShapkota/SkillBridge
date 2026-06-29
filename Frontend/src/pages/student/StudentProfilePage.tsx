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
import { getProfile, setProfile, subscribeProfile } from "../../app/data/profileStore";
import { getStudentProfile } from "../../services/studentProfileService";

const DEFAULT_RATING = 0;
const DEFAULT_REVIEW_COUNT = 0;

function StudentProfileContent() {
  const currentUser = useDashboardCurrentUser();
  const [shareOpen, setShareOpen] = useState(false);
  const [profile, setProfileState] = useState(getProfile());

  useEffect(() => {
    let mounted = true;

    const loadStudentProfile = async () => {
      try {
        const response = await getStudentProfile();

        if (!mounted || !response.data) return;

        setProfile({
          bio: response.data.bio ?? "",
          education: response.data.education ?? "",
          university: response.data.university ?? "",
          skills: response.data.skills ?? [],
          github: response.data.github ?? "",
          linkedin: response.data.linkedin ?? "",
          portfolio: response.data.portfolio ?? "",
        });
      } catch (error) {
        // A new student may not have saved profile details yet.
      }
    };

    loadStudentProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // Re-render whenever Settings saves to the store
  useEffect(() => subscribeProfile(() => setProfileState(getProfile())), []);

  // User owns the name; StudentProfile owns the profile details.
  const p = profile;
  const name = currentUser?.fullName || "";
  const bio = p.bio;
  const initials = name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const skills = p.skills.map((s) => ({
    name: s,
    verified: false,
  }));

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
            headline: p.education ? `${p.education} Student` : "",
            education: p.education,
            university: p.university,
            bio,
            verified: false,
            skills,
            rating: DEFAULT_RATING,
            reviewCount: DEFAULT_REVIEW_COUNT,
            completedProjectsCount: 0,
            github: p.github || undefined,
            linkedin: p.linkedin || undefined,
            portfolio: p.portfolio || undefined,
            avatarUrl: currentUser?.avatar,
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
