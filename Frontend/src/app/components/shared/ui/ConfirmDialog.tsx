import { useState, type ElementType, type ReactNode } from "react";
import { motion } from "motion/react";

type ConfirmDialogProps = {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onClose: () => void;
  icon?: ElementType;
  iconBg?: string;
  iconColor?: string;
  align?: "left" | "center";
  maxWidthClassName?: string;
  busyDelayMs?: number;
};

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  confirmColor,
  onConfirm,
  onClose,
  icon: Icon,
  iconBg = "#F8FAFC",
  iconColor = "#64748B",
  align = "left",
  maxWidthClassName = "max-w-sm",
  busyDelayMs = 900,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidthClassName} p-6 flex flex-col gap-5 ${
          centered ? "items-center text-center" : ""
        }`}
      >
        {Icon && (
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: iconBg }}
          >
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
        )}
        <div>
          <p className="text-slate-900 font-bold" style={{ fontSize: "0.95rem" }}>
            {title}
          </p>
          <div className="text-slate-500 mt-1.5 leading-relaxed" style={{ fontSize: "0.82rem" }}>
            {body}
          </div>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold hover:text-slate-900 transition-all"
            style={{ fontSize: "0.875rem" }}
          >
            Cancel
          </button>
          <motion.button
            whileHover={!busy ? { scale: 1.02 } : {}}
            whileTap={!busy ? { scale: 0.97 } : {}}
            onClick={() => {
              setBusy(true);
              setTimeout(onConfirm, busyDelayMs);
            }}
            disabled={busy}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: confirmColor, fontSize: "0.875rem" }}
          >
            {busy ? (
              <motion.span
                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              confirmLabel
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
