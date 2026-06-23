import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardLayout } from "../../app/components/layout/DashboardLayout";
import { SettingsLayout } from "../../app/components/layout/SettingsLayout";
import { getProfile, setProfile } from "../../app/data/profileStore";
import { VerificationReminderCard } from "../../app/components/shared/VerificationReminderCard";
import { PasswordChangeForm } from "../../app/components/shared/PasswordChangeForm";
import { ConfirmDialog, StatusBadge } from "../../app/components/shared/ui";
import {
  User,
  ShieldCheck,
  Lock,
  Check,
  Upload,
  X,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

// Nav

type Section = "profile" | "kyc" | "account";

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile Information", icon: User },
  { id: "kyc", label: "KYC Verification", icon: ShieldCheck },
  { id: "account", label: "Account Settings", icon: Lock },
];

// Shared primitives

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-300 outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10";

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-slate-900 font-semibold" style={{ fontSize: "0.82rem" }}>
        {text}
      </span>
      {required && (
        <span className="text-red-400" style={{ fontSize: "0.75rem" }}>
          *
        </span>
      )}
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return msg ? (
    <p className="text-red-500 font-medium" style={{ fontSize: "0.72rem" }}>
      {msg}
    </p>
  ) : null;
}

function SaveButton({
  saving,
  saved,
  disabled: dis,
  label = "Save Changes",
}: {
  saving: boolean;
  saved: boolean;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <motion.button
      type="submit"
      disabled={dis || saving}
      whileHover={!dis && !saving ? { scale: 1.02 } : {}}
      whileTap={!dis && !saving ? { scale: 0.97 } : {}}
      className="flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-100"
      style={{
        background: saved ? "#059669" : dis ? "#E2E8F0" : "#2563EB",
        border: dis ? "1px solid #CBD5E1" : "1px solid transparent",
        color: dis ? "#64748B" : "white",
        fontSize: "0.875rem",
        cursor: dis ? "not-allowed" : "pointer",
      }}
    >
      {saving ? (
        <motion.span
          className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      ) : saved ? (
        <>
          <Check className="w-4 h-4" /> Saved!
        </>
      ) : (
        label
      )}
    </motion.button>
  );
}

// File upload row

function FileUploadRow({
  label,
  accept,
  required,
}: {
  label: string;
  accept: string;
  required?: boolean;
}) {
  const [fileName, setFileName] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel text={label} required={required} />
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 font-semibold px-3.5 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shrink-0"
          style={{ fontSize: "0.75rem" }}
        >
          <Upload className="w-3.5 h-3.5" /> Choose File
        </button>
        {fileName ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-900 font-medium truncate" style={{ fontSize: "0.75rem" }}>
              {fileName}
            </span>
            <button
              type="button"
              onClick={() => {
                setFileName("");
                if (ref.current) ref.current.value = "";
              }}
              className="text-slate-400 hover:text-red-400 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-slate-400" style={{ fontSize: "0.72rem" }}>
            No file chosen
          </span>
        )}
      </div>
    </div>
  );
}

// Profile Information

function ProfileSection() {
  const [displayName, setDisplayName] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = getProfile();
    setDisplayName(p.name);
    setAbout(p.bio);
    setAvatarUrl(p.avatarUrl);
    setWebsite(p.portfolio);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!displayName.trim()) e.displayName = "Client name is required.";
    if (!about.trim()) e.about = "About section is required.";
    if (!location.trim()) e.location = "Location is required.";
    return e;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    setTimeout(() => {
      setProfile({
        name: displayName,
        bio: about,
        avatarUrl,
        portfolio: website,
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 900);
  };

  const initials = displayName.trim()
    ? displayName
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DK";

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div>
        <h2 className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
          Profile Information
        </h2>
        <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.78rem" }}>
          Public client information displayed throughout the platform.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg,#D97706,#F59E0B)" }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold"
              style={{ fontSize: "1rem" }}
            >
              {initials}
            </div>
          )}
        </div>
        <div>
          <p className="text-slate-900 font-semibold" style={{ fontSize: "0.82rem" }}>
            Profile Picture
          </p>
          <p className="text-slate-400 mt-0.5 mb-2" style={{ fontSize: "0.72rem" }}>
            JPG or PNG · Max 2 MB
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 font-semibold px-3 py-1.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
            style={{ fontSize: "0.75rem" }}
          >
            <Upload className="w-3.5 h-3.5" /> Upload Photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel text="Client Name" required />
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
            className={inputCls}
            style={{ fontSize: "0.875rem" }}
          />
          <ErrorMsg msg={errors.displayName ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel text="About" required />
          <textarea
            rows={3}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell students about yourself and the opportunities you provide."
            className={`${inputCls} resize-none`}
            style={{ fontSize: "0.875rem" }}
          />
          <ErrorMsg msg={errors.about ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel text="Location" required />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location (e.g. Kathmandu, Nepal)"
            className={inputCls}
            style={{ fontSize: "0.875rem" }}
          />
          <ErrorMsg msg={errors.location ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel text="Company Name" />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter company name (optional)"
            className={inputCls}
            style={{ fontSize: "0.875rem" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel text="Website" />
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className={inputCls}
            style={{ fontSize: "0.875rem" }}
          />
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-red-600" style={{ fontSize: "0.78rem" }}>
            Please complete all required fields before saving.
          </p>
        </div>
      )}

      <div className="pt-1 border-t border-black/[0.05]">
        <SaveButton saving={saving} saved={saved} />
      </div>
    </form>
  );
}

// KYC Verification

type KycStatus = "not-submitted" | "pending" | "verified" | "rejected";

const KYC_STATUS_CFG: Record<
  KycStatus,
  {
    label: string;
    desc: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    badgeColor: string;
    badgeBg: string;
    badgeBorder: string;
  }
> = {
  "not-submitted": {
    label: "Not Verified",
    desc: "You have not submitted verification documents yet.",
    icon: ShieldCheck,
    iconColor: "#94A3B8",
    iconBg: "#F1F5F9",
    badgeColor: "#64748B",
    badgeBg: "#F8FAFC",
    badgeBorder: "#E2E8F0",
  },
  pending: {
    label: "Pending",
    desc: "Your verification request is currently under review.",
    icon: Clock,
    iconColor: "#D97706",
    iconBg: "#FFFBEB",
    badgeColor: "#D97706",
    badgeBg: "#FFFBEB",
    badgeBorder: "#FDE68A",
  },
  verified: {
    label: "Verified",
    desc: "Your account has been successfully verified.",
    icon: CheckCircle,
    iconColor: "#059669",
    iconBg: "#ECFDF5",
    badgeColor: "#059669",
    badgeBg: "#ECFDF5",
    badgeBorder: "#6EE7B7",
  },
  rejected: {
    label: "Rejected",
    desc: "Your verification request was rejected. Please resubmit.",
    icon: XCircle,
    iconColor: "#DC2626",
    iconBg: "#FEF2F2",
    badgeColor: "#DC2626",
    badgeBg: "#FEF2F2",
    badgeBorder: "#FECACA",
  },
};

function KycSection({ onStatusChange }: { onStatusChange?: (s: KycStatus) => void }) {
  const [status, setStatus] = useState<KycStatus>("not-submitted");
  const updateStatus = (s: KycStatus) => {
    setStatus(s);
    onStatusChange?.(s);
  };
  const [legalName, setLegalName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyKyc, setCompanyKyc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cfg = KYC_STATUS_CFG[status];
  const StatusIcon = cfg.icon;
  const canSubmit = status === "not-submitted" || status === "rejected";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!legalName.trim()) e.legalName = "Full legal name is required.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      updateStatus("pending");
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
          KYC Verification
        </h2>
        <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.78rem" }}>
          Verify your identity through Admin approval to build trust on the platform.
        </p>
      </div>

      {/* Status card */}
      <div className="flex items-start gap-4 bg-white border border-slate-200 rounded-2xl p-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: cfg.iconBg }}
        >
          <StatusIcon className="w-5 h-5" style={{ color: cfg.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-slate-900 font-semibold" style={{ fontSize: "0.875rem" }}>
              Verification Status
            </p>
            <StatusBadge
              config={{
                label: cfg.label,
                color: cfg.badgeColor,
                bg: cfg.badgeBg,
                border: cfg.badgeBorder,
              }}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border font-semibold"
            />
          </div>
          <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.75rem" }}>
            {cfg.desc}
          </p>
        </div>
      </div>

      {/* Demo status switcher (for preview) */}
      <div className="flex gap-2 flex-wrap">
        <p className="text-slate-400 self-center" style={{ fontSize: "0.68rem" }}>
          Preview status:
        </p>
        {(Object.keys(KYC_STATUS_CFG) as KycStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => updateStatus(s)}
            className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${status === s ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}
            style={{ fontSize: "0.62rem" }}
          >
            {KYC_STATUS_CFG[s].label}
          </button>
        ))}
      </div>

      {/* Verification form — shown when not submitted or rejected */}
      {canSubmit && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 pt-2 border-t border-black/[0.05]"
        >
          <p className="text-slate-900 font-semibold" style={{ fontSize: "0.875rem" }}>
            Verification Documents
          </p>
          <p className="text-slate-400" style={{ fontSize: "0.72rem" }}>
            Documents are visible only to Admin and are kept confidential.
          </p>

          <div className="flex flex-col gap-1.5">
            <FieldLabel text="Full Legal Name" required />
            <input
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="Enter your full legal name"
              className={inputCls}
              style={{ fontSize: "0.875rem" }}
            />
            <ErrorMsg msg={errors.legalName ?? ""} />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel text="Phone Number" required />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              className={inputCls}
              style={{ fontSize: "0.875rem" }}
            />
            <ErrorMsg msg={errors.phone ?? ""} />
          </div>

          <FileUploadRow
            label="Citizenship Front Photo"
            accept="image/png,image/jpg,image/jpeg"
            required
          />
          <FileUploadRow
            label="Selfie Holding Citizenship"
            accept="image/png,image/jpg,image/jpeg"
            required
          />

          <div className="flex flex-col gap-1.5">
            <FieldLabel text="Company Name" />
            <input
              value={companyKyc}
              onChange={(e) => setCompanyKyc(e.target.value)}
              placeholder="Company name (optional)"
              className={inputCls}
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          <FileUploadRow
            label="Company Registration Document"
            accept=".pdf,image/png,image/jpg,image/jpeg"
          />

          {Object.keys(errors).length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-600" style={{ fontSize: "0.78rem" }}>
                Please complete all required fields.
              </p>
            </div>
          )}

          <div className="pt-1 border-t border-black/[0.05]">
            <SaveButton saving={submitting} saved={false} label="Submit Verification" />
          </div>
        </form>
      )}

      {status === "pending" && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-amber-600" style={{ fontSize: "0.78rem" }}>
            Your verification documents are under review. The Admin team typically responds within
            1–2 business days.
          </p>
        </div>
      )}

      {status === "verified" && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-emerald-600" style={{ fontSize: "0.78rem" }}>
            Your account is verified. A <strong>✓ Verified Client</strong> badge is now visible on
            your profile and job listings.
          </p>
        </div>
      )}
    </div>
  );
}

// Account Settings

function AccountSection() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [, setDeleting] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
          Account Settings
        </h2>
        <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.78rem" }}>
          Manage your account security.
        </p>
      </div>

      <PasswordChangeForm />

      <div className="pt-4 border-t border-red-200">
        <p className="text-red-600 font-semibold mb-1" style={{ fontSize: "0.875rem" }}>
          Delete Account
        </p>
        <p className="text-slate-500 mb-3 leading-relaxed" style={{ fontSize: "0.78rem" }}>
          Deleting your account will permanently remove your jobs, projects, and account data. This
          cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setDeleteModal(true)}
          className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all"
          style={{ fontSize: "0.82rem" }}
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Account
        </button>
      </div>

      <AnimatePresence>
        {deleteModal && (
          <ConfirmDialog
            title="Delete Account"
            body="Are you sure you want to permanently delete your account? This action cannot be undone."
            confirmLabel="Delete Account"
            confirmColor="#DC2626"
            icon={Trash2}
            iconBg="#FEF2F2"
            iconColor="#DC2626"
            busyDelayMs={0}
            onClose={() => setDeleteModal(false)}
            onConfirm={() => {
              setDeleting(true);
              setTimeout(() => {
                setDeleting(false);
                setDeleteModal(false);
              }, 1200);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main page

export default function ClientSettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  // Shared KYC status — drives the top-level reminder card visibility
  const [kycStatus, setKycStatus] = useState<KycStatus>("not-submitted");

  const CONTENT: Record<Section, React.ReactNode> = {
    profile: <ProfileSection />,
    kyc: <KycSection onStatusChange={setKycStatus} />,
    account: <AccountSection />,
  };

  return (
    <DashboardLayout role="client" title="Settings" activeNav="settings">
      <SettingsLayout
        navTitle="Settings"
        items={NAV_ITEMS}
        activeId={active}
        onSelect={setActive}
        topContent={
          <VerificationReminderCard
            isVerified={kycStatus === "verified" || kycStatus === "pending"}
            description="Complete KYC verification to start posting jobs and build trust with students."
            settingsPath="/dashboard/client/settings"
          />
        }
      >
        {CONTENT[active]}
      </SettingsLayout>
    </DashboardLayout>
  );
}
