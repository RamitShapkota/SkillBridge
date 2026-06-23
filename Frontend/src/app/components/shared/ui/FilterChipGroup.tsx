import { motion } from "motion/react";
import type { StatusBadgeConfig } from "./StatusBadge";

export type FilterChipItem<T extends string> = {
  label: string;
  value: T;
  count?: number;
  config?: StatusBadgeConfig;
};

type FilterChipGroupProps<T extends string> = {
  items: FilterChipItem<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  showZeroCounts?: boolean;
  defaultConfig?: Pick<StatusBadgeConfig, "color" | "bg" | "border">;
  className?: string;
};

export function FilterChipGroup<T extends string>({
  items,
  activeValue,
  onChange,
  showZeroCounts = false,
  defaultConfig = { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  className = "flex flex-wrap gap-2",
}: FilterChipGroupProps<T>) {
  return (
    <div className={className}>
      {items.map((item) => {
        const isActive = activeValue === item.value;
        const cfg = item.config;
        const activeBg = cfg?.bg ?? defaultConfig.bg;
        const activeColor = cfg?.color ?? defaultConfig.color;
        const activeBorder = cfg?.border ?? defaultConfig.border;
        const count = item.count ?? 0;
        const showCount = showZeroCounts || count > 0;

        return (
          <motion.button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-semibold transition-all duration-200"
            style={{
              background: isActive ? activeBg : "#F8FAFC",
              color: isActive ? activeColor : "#64748B",
              borderColor: isActive ? activeBorder : "#E2E8F0",
              fontSize: "0.75rem",
            }}
          >
            {item.label}
            {showCount && (
              <span
                className="px-1.5 py-px rounded-full font-bold"
                style={{
                  background: isActive ? activeColor : "#E2E8F0",
                  color: isActive ? "white" : "#64748B",
                  fontSize: "0.58rem",
                }}
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
