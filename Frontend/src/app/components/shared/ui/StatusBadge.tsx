import type { CSSProperties, ReactNode } from "react";

export type StatusBadgeConfig = {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot?: string;
};

type StatusBadgeProps = {
  config: StatusBadgeConfig;
  children?: ReactNode;
  className?: string;
  dotClassName?: string;
  style?: CSSProperties;
};

export function StatusBadge({
  config,
  children,
  className = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold",
  dotClassName = "w-1.5 h-1.5 rounded-full",
  style,
}: StatusBadgeProps) {
  return (
    <span
      className={className}
      style={{
        background: config.bg,
        color: config.color,
        borderColor: config.border,
        fontSize: "0.62rem",
        ...style,
      }}
    >
      <span className={dotClassName} style={{ background: config.dot ?? config.color }} />
      {children ?? config.label}
    </span>
  );
}
