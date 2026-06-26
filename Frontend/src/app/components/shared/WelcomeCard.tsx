import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useDashboardCurrentUser } from "@/app/components/layout/DashboardLayout";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export interface WelcomeAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface WelcomeCardProps {
  name: string;
  subtitle: string;
  actions?: WelcomeAction[];
}

export function WelcomeCard({ name, subtitle, actions = [] }: WelcomeCardProps) {
  const currentUser = useDashboardCurrentUser();
  const displayName = currentUser?.fullName || name;

  return (
    <div
      className="relative rounded-3xl overflow-hidden p-8 lg:p-10"
      style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 55%, #134E4A 100%)" }}
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Glow orbs */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: "#14B8A6" }}
      />
      <div
        className="absolute -bottom-10 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10"
        style={{ background: "#2563EB" }}
      />
      {/* Decorative rings */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
        <div className="w-52 h-52 rounded-full border-2 border-white" />
        <div className="absolute inset-5 rounded-full border-2 border-white" />
        <div className="absolute inset-10 rounded-full border-2 border-white" />
      </div>

      <div className="relative z-10 max-w-xl">
        {/* Greeting */}
        <p className="text-white/60 font-medium mb-3" style={{ fontSize: "0.82rem" }}>
          {getGreeting()}
        </p>

        {/* Name */}
        <h2
          className="text-white tracking-tight mb-2"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, lineHeight: 1.2 }}
        >
          Welcome back, {displayName} 
        </h2>

        {/* Subtitle */}
        <p className="text-white/60 leading-relaxed mb-6 max-w-md" style={{ fontSize: "0.9rem" }}>
          {subtitle}
        </p>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <motion.button
                key={action.label}
                onClick={action.onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                  action.primary
                    ? "bg-white text-blue-700 shadow-md hover:bg-slate-50"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
                style={{ fontSize: "0.85rem" }}
              >
                {action.label}
                {action.primary && <ArrowRight className="w-3.5 h-3.5" />}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
