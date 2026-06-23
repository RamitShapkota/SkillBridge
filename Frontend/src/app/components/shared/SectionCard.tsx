import { type ReactNode, type ElementType } from "react";

// Base card used for all content sections (activity, guides, tasks, etc.)
interface SectionCardProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  trailing,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-black/[0.05] shadow-sm p-6 ${className}`}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-slate-900" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.78rem" }}>
              {subtitle}
            </p>
          )}
        </div>
        {trailing}
      </div>
      {children}
    </div>
  );
}

// Activity row used inside SectionCard for recent-activity lists
interface ActivityRowProps {
  icon: ElementType;
  color: string;
  bg: string;
  action: string;
  context: string;
  time: string;
  isLast?: boolean;
}

export function ActivityRow({
  icon: Icon,
  color,
  bg,
  action,
  context,
  time,
  isLast,
}: ActivityRowProps) {
  return (
    <div className={`flex items-start gap-3 py-3 ${!isLast ? "border-b border-black/[0.04]" : ""}`}>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: bg }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-900 font-semibold leading-snug" style={{ fontSize: "0.82rem" }}>
          {action}
        </p>
        <p className="text-slate-500 truncate" style={{ fontSize: "0.74rem" }}>
          {context}
        </p>
      </div>
      <span className="text-slate-300 shrink-0 whitespace-nowrap" style={{ fontSize: "0.68rem" }}>
        {time}
      </span>
    </div>
  );
}
