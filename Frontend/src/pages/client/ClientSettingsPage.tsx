import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DashboardLayout,
  useDashboardCurrentUser,
} from "../../app/components/layout/DashboardLayout";
import { SettingsLayout } from "../../app/components/layout/SettingsLayout";
import { getProfile, setProfile } from "../../app/data/profileStore";
import { updateAccountDetails, uploadAvatar } from "../../services/authService";
import { getClientProfile, updateClientProfile } from "../../services/clientProfileService";
import { VerificationReminderCard } from "../../app/components/shared/VerificationReminderCard";
import {
  FileUpload,
  VerificationSubmittedState,
  type UploadedFile,
} from "../../app/components/shared/VerificationForm";
import {
  getVerificationDisplayStatus,
  VerificationDocumentsSection,
  VerificationHelpMessage,
  VerificationStatusCard,
  type VerificationDisplayStatus,
  type VerificationStatusValue,
} from "../../app/components/shared/VerificationStatusCard";
import { PasswordChangeForm } from "../../app/components/shared/PasswordChangeForm";
import {
  ConfirmDialog,
  Notification,
  type NotificationMessage,
} from "../../app/components/shared/ui";
import { submitClientVerification } from "../../services/verificationService";
import { User, ShieldCheck, Lock, Check, Upload, Trash2, AlertCircle } from "lucide-react";

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

// Profile Information

function ProfileSection({ onNotify }: { onNotify: (message: NotificationMessage) => void }) {
  const currentUser = useDashboardCurrentUser();
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
    let mounted = true;
    const p = getProfile();
    setDisplayName(currentUser?.fullName || p.name);
    setAvatarUrl(currentUser?.avatar ?? "");

    const loadClientProfile = async () => {
      try {
        const response = await getClientProfile();

        if (!mounted || !response.data) return;

        setAbout(response.data.bio ?? "");
        setLocation(response.data.location ?? "");
        setCompany(response.data.companyName ?? "");
        setWebsite(response.data.website ?? "");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Client profile could not be loaded.";
        if (mounted) {
          onNotify({ type: "error", text: message });
        }
      }
    };

    loadClientProfile();

    return () => {
      mounted = false;
    };
  }, [currentUser, onNotify]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    try {
      const response = await uploadAvatar(file);
      setAvatarUrl(response.data.avatar ?? "");
      window.dispatchEvent(new Event("skillbridge:user-updated"));
      onNotify({ type: "success", text: "Profile picture updated successfully." });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Profile picture could not be updated.";
      onNotify({ type: "error", text: message });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!displayName.trim()) e.displayName = "Client name is required.";
    if (!about.trim()) e.about = "About section is required.";
    if (!location.trim()) e.location = "Location is required.";
    return e;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!currentUser?.email) {
      setErrors({ displayName: "Current user could not be loaded." });
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      await updateAccountDetails({
        fullName: displayName,
        email: currentUser.email,
      });

      const response = await updateClientProfile({
        bio: about,
        location,
        companyName: company,
        website,
      });

      const updatedProfile = response.data;

      setProfile({
        name: displayName,
        bio: updatedProfile.bio ?? about,
        portfolio: updatedProfile.website ?? website,
      });
      setSaving(false);
      setSaved(true);
      window.dispatchEvent(new Event("skillbridge:user-updated"));
      onNotify({ type: "success", text: "Profile updated successfully." });
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Account could not be updated.";
      setSaving(false);
      onNotify({ type: "error", text: message });
      setErrors({ displayName: message });
    }
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

function KycSection({
  onStatusChange,
  onNotify,
}: {
  onStatusChange?: (s: VerificationDisplayStatus) => void;
  onNotify: (message: NotificationMessage) => void;
}) {
  const [status, setStatus] = useState<VerificationDisplayStatus>(
    getVerificationDisplayStatus(null)
  );
  const updateStatus = (s: VerificationDisplayStatus) => {
    setStatus(s);
    onStatusChange?.(s);
  };
  const [legalName, setLegalName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyKyc, setCompanyKyc] = useState("");
  const [citizenshipFront, setCitizenshipFront] = useState<UploadedFile | null>(null);
  const [citizenshipSelfie, setCitizenshipSelfie] = useState<UploadedFile | null>(null);
  const [companyRegistration, setCompanyRegistration] = useState<UploadedFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<VerificationStatusValue>("pending");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canSubmit = status === "not-verified" || status === "rejected";
  const canSubmitDocuments =
    legalName.trim() !== "" &&
    phone.trim() !== "" &&
    citizenshipFront !== null &&
    citizenshipSelfie !== null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!legalName.trim()) e.legalName = "Full legal name is required.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    if (!citizenshipFront) e.citizenshipFront = "Citizenship front photo is required.";
    if (!citizenshipSelfie) e.citizenshipSelfie = "Citizenship selfie is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0 || submitting || !citizenshipFront || !citizenshipSelfie) {
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("legalName", legalName);
    formData.append("phone", phone);
    formData.append("companyKyc", companyKyc);
    formData.append("citizenshipFront", citizenshipFront.file);
    formData.append("citizenshipSelfie", citizenshipSelfie.file);

    if (companyRegistration) {
      formData.append("companyRegistration", companyRegistration.file);
    }

    try {
      const response = await submitClientVerification(formData);
      const status = response.data.status;

      setSubmitted(true);
      setSubmittedStatus(status);
      updateStatus(getVerificationDisplayStatus(status));
      onNotify({
        type: "success",
        text: "Verification submitted successfully. Your documents have been submitted for review.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification request could not be submitted.";
      onNotify({ type: "error", text: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
          KYC Verification
        </h2>
        <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.78rem" }}>
          Verify your identity through admin approval to build trust on the platform.
        </p>
      </div>

      <VerificationStatusCard status={status} />

      {submitted ? (
        <VerificationDocumentsSection>
          <VerificationSubmittedState status={submittedStatus} />
        </VerificationDocumentsSection>
      ) : canSubmit ? (
        <VerificationDocumentsSection>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel text="Legal Name" required />
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

            <FileUpload
              label="Citizenship Front"
              hint="Upload a clear photo of the front side of your citizenship document."
              file={citizenshipFront}
              onFile={setCitizenshipFront}
              onRemove={() => setCitizenshipFront(null)}
              disabled={submitting}
            />
            <ErrorMsg msg={errors.citizenshipFront ?? ""} />

            <FileUpload
              label="Citizenship Selfie"
              hint="Take a selfie clearly showing your face alongside your citizenship document."
              file={citizenshipSelfie}
              onFile={setCitizenshipSelfie}
              onRemove={() => setCitizenshipSelfie(null)}
              disabled={submitting}
            />
            <ErrorMsg msg={errors.citizenshipSelfie ?? ""} />

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

            <FileUpload
              label="Company Registration Document (if required)"
              hint="Upload your company registration document if you are posting as a company."
              file={companyRegistration}
              onFile={setCompanyRegistration}
              onRemove={() => setCompanyRegistration(null)}
              required={false}
              disabled={submitting}
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
              <button
                type="submit"
                disabled={!canSubmitDocuments || submitting}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all ${
                  canSubmitDocuments && !submitting
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
                style={{ fontSize: "0.9rem" }}
              >
                {submitting ? (
                  <>
                    <motion.span
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Submit Verification
                  </>
                )}
              </button>
            </div>
          </form>
        </VerificationDocumentsSection>
      ) : (
        <VerificationHelpMessage status={status} />
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
  const [notification, setNotification] = useState<NotificationMessage>(null);
  // Shared KYC status — drives the top-level reminder card visibility
  const [kycStatus, setKycStatus] = useState<VerificationDisplayStatus>(
    getVerificationDisplayStatus(null)
  );

  const CONTENT: Record<Section, React.ReactNode> = {
    profile: <ProfileSection onNotify={setNotification} />,
    kyc: <KycSection onStatusChange={setKycStatus} onNotify={setNotification} />,
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
      <Notification message={notification} onClose={() => setNotification(null)} />
    </DashboardLayout>
  );
}
