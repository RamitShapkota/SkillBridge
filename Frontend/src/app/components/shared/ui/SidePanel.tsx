import { type ReactNode } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

type SidePanelProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  maxWidthClassName?: string;
  zIndexClassName?: string;
  headerExtra?: ReactNode;
  bodyClassName?: string;
};

export function SidePanel({
  title,
  subtitle,
  children,
  onClose,
  footer,
  maxWidthClassName = "max-w-md",
  zIndexClassName = "z-40",
  headerExtra,
  bodyClassName = "flex-1 overflow-y-auto",
}: SidePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/30 backdrop-blur-sm ${zIndexClassName} flex justify-end`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full ${maxWidthClassName} bg-slate-50 flex flex-col h-full shadow-2xl overflow-hidden`}
      >
        <div className="bg-white border-b border-black/[0.05] px-5 py-4 flex items-start justify-between gap-3 shrink-0">
          <div>
            <p className="text-slate-900 font-bold" style={{ fontSize: "0.95rem" }}>
              {title}
            </p>
            {subtitle && (
              <p className="text-slate-400 mt-0.5" style={{ fontSize: "0.72rem" }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerExtra}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className={bodyClassName}>{children}</div>
        {footer && (
          <div className="p-4 border-t border-black/[0.05] flex gap-3 shrink-0">{footer}</div>
        )}
      </motion.div>
    </motion.div>
  );
}
