import type { ElementType, FormEventHandler, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export type SettingsLayoutItem<T extends string> = {
  id: T;
  label: string;
  icon: ElementType;
};

type SettingsLayoutProps<T extends string> = {
  navTitle: string;
  items: SettingsLayoutItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  children: ReactNode;
  topContent?: ReactNode;
  contentKey?: string;
  contentMinHeightClassName?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
};

export function SettingsLayout<T extends string>({
  navTitle,
  items,
  activeId,
  onSelect,
  children,
  topContent,
  contentKey = activeId,
  contentMinHeightClassName = "min-h-[420px]",
  onSubmit,
}: SettingsLayoutProps<T>) {
  const layout = (
    <div className="grid lg:grid-cols-[220px_1fr] gap-5 items-start">
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b border-black/[0.05]">
          <p className="text-slate-900 font-bold" style={{ fontSize: "0.82rem" }}>
            {navTitle}
          </p>
        </div>
        <nav className="py-2 px-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-medium" style={{ fontSize: "0.82rem" }}>
                  {item.label}
                </span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div
        className={`bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 ${contentMinHeightClassName}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={contentKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-5"
    >
      {topContent}
      {onSubmit ? <form onSubmit={onSubmit}>{layout}</form> : layout}
    </motion.div>
  );
}
