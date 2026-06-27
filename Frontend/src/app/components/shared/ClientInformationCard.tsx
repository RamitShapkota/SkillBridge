import { useEffect, useState } from "react";
import { CheckCircle, MapPin, Briefcase, FolderCheck, CalendarDays } from "lucide-react";
import { useDashboardCurrentUser } from "../layout/DashboardLayout";
import { getClientProfile, type ClientProfileData } from "../../../services/clientProfileService";

export interface ClientCardData {
  name: string;
  initials?: string;
  location?: string;
  about?: string;
  avatar?: string;
  jobsPosted?: number;
  projectsCompleted?: number;
  joinedDate?: string;
}

export function ClientInformationCard({ client }: { client: ClientCardData }) {
  const currentUser = useDashboardCurrentUser();
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const displayClient = {
    ...client,
    location: profile?.location ?? client.location,
    about: profile?.bio ?? client.about,
    avatar: client.avatar ?? (currentUser?.role === "client" ? currentUser.avatar : undefined),
  };
  const initials = displayClient.initials ?? displayClient.name.slice(0, 2).toUpperCase();
  const hasStats =
    displayClient.jobsPosted != null ||
    displayClient.projectsCompleted != null ||
    displayClient.joinedDate;

  useEffect(() => {
    let mounted = true;

    const loadClientProfile = async () => {
      try {
        const response = await getClientProfile();

        if (mounted) {
          setProfile(response.data);
        }
      } catch {
        if (mounted) {
          setProfile(null);
        }
      }
    };

    loadClientProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-4">
      <p className="text-slate-900 font-bold" style={{ fontSize: "0.82rem" }}>
        About the Client
      </p>

      {/* Avatar + name + badge */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden"
          style={{ fontSize: "0.65rem" }}
        >
          {displayClient.avatar ? (
            <img src={displayClient.avatar} alt={displayClient.name} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-slate-900 font-bold leading-tight" style={{ fontSize: "0.88rem" }}>
            {displayClient.name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-600 font-semibold" style={{ fontSize: "0.62rem" }}>
              Verified Client
            </span>
          </div>
          {displayClient.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-slate-500" style={{ fontSize: "0.72rem" }}>
                {displayClient.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      {displayClient.about && (
        <p className="text-slate-500 leading-relaxed" style={{ fontSize: "0.75rem" }}>
          {displayClient.about}
        </p>
      )}

      {/* Stats */}
      {hasStats && (
        <>
          <div className="h-px bg-slate-200" />
          <div className="flex flex-wrap gap-3">
            {displayClient.jobsPosted != null && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Briefcase className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-slate-900 font-semibold" style={{ fontSize: "0.72rem" }}>
                  {displayClient.jobsPosted} Jobs Posted
                </span>
              </div>
            )}
            {displayClient.projectsCompleted != null && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <FolderCheck className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-slate-900 font-semibold" style={{ fontSize: "0.72rem" }}>
                  {displayClient.projectsCompleted} Projects Completed
                </span>
              </div>
            )}
            {displayClient.joinedDate && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center">
                  <CalendarDays className="w-3 h-3 text-violet-600" />
                </div>
                <span className="text-slate-900 font-semibold" style={{ fontSize: "0.72rem" }}>
                  Joined {displayClient.joinedDate}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
