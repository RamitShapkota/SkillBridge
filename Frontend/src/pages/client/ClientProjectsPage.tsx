import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../../app/components/layout/DashboardLayout";
import { FilterChipGroup, SearchInput } from "../../app/components/shared/ui";
import { PROJECTS, type ProjectStatus } from "../../app/data/projects";
import { Folder, Calendar, Tag, ChevronRight, Users } from "lucide-react";

const STATUS_CFG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  active: {
    label: "Active",
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  submitted: {
    label: "Submitted",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  completed: {
    label: "Completed",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#6EE7B7",
  },
};

const FILTERS: { label: string; value: ProjectStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Submitted", value: "submitted" },
  { label: "Completed", value: "completed" },
];

function ProjectCard({ project }: { project: (typeof PROJECTS)[0] }) {
  const navigate = useNavigate();
  const cfg = STATUS_CFG[project.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-5 flex flex-col gap-4 transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full"
          style={{ fontSize: "0.62rem" }}
        >
          {project.category}
        </span>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold"
          style={{
            background: cfg.bg,
            color: cfg.color,
            borderColor: cfg.border,
            fontSize: "0.62rem",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
          {cfg.label}
        </span>
      </div>
      <h3 className="text-slate-900 leading-snug" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
        {project.title}
      </h3>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold"
          style={{ fontSize: "0.48rem" }}
        >
          {project.student.initials}
        </div>
        <span className="text-slate-500" style={{ fontSize: "0.72rem" }}>
          {project.student.name}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500" style={{ fontSize: "0.72rem" }}>
            Due {project.deadline}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold" style={{ fontSize: "0.72rem" }}>
            Rs. {project.budget}
          </span>
        </div>
      </div>
      <button
        onClick={() => navigate(`/dashboard/client/projects/${project.id}`)}
        className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-blue-50 text-blue-600 font-semibold py-2.5 rounded-xl border border-slate-200 hover:border-blue-200 transition-all duration-200"
        style={{ fontSize: "0.78rem" }}
      >
        View Project <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function ClientProjectsPage() {
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [search, setSearch] = useState("");

  const projects = PROJECTS;
  const counts: Record<string, number> = { all: projects.length };
  projects.forEach((p) => {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  });

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        p.title.toLowerCase().includes(q) ||
        p.student.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)) &&
      (filter === "all" || p.status === filter)
    );
  });

  return (
    <DashboardLayout role="client" title="Projects" activeNav="projects">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-slate-900" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
              Projects
            </h2>
            <p className="text-slate-500 mt-0.5" style={{ fontSize: "0.78rem" }}>
              Monitor and review all your active student projects.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-600 font-semibold" style={{ fontSize: "0.78rem" }}>
              {projects.length} projects
            </span>
          </div>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by project title, student, or category..."
        />

        <FilterChipGroup
          items={FILTERS.map((f) => ({
            ...f,
            count: counts[f.value] ?? 0,
            config: f.value !== "all" ? STATUS_CFG[f.value] : undefined,
          }))}
          activeValue={filter}
          onChange={setFilter}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
              <Folder className="w-9 h-9 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold" style={{ fontSize: "1rem" }}>
              No Projects Found
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
