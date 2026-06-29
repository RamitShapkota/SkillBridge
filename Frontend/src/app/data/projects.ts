// Shared project data — replace with API calls when backend is ready

export type ProjectStatus = "active" | "submitted" | "completed";

export interface ProjectFile {
  name: string;
  size: number;
  type: string;
}

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  category: string;
  student: { name: string; initials: string };
  client: { name: string; initials: string };
  startDate: string;
  deadline: string;
  budget: string;
  description: string;
  requirements: string;
  skills: string[];
  submissionFiles?: ProjectFile[];
  submissionNotes?: string;
  submittedAt?: string;
  demoLink?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "EdTech Landing Page Design",
    status: "submitted",
    category: "UI/UX Design",
    student: { name: "Priya Sharma", initials: "PS" },
    client: { name: "Dikshya Khanal", initials: "AC" },
    startDate: "8 Jun 2026",
    deadline: "15 Jun 2026",
    budget: "8,000",
    description:
      "Design a modern, conversion-focused landing page for our online learning platform. The design must be clean, professional, and mobile-responsive with strong CTAs.",
    requirements:
      "Use our brand colors (blue and white). Include hero, features, testimonials, and CTA sections. Deliverable: Full Figma prototype + exported assets.",
    skills: ["Figma", "UI/UX", "Prototyping", "Mobile Design"],
    submissionFiles: [
      { name: "landing-page-v1.fig", size: 4200000, type: "application/figma" },
      { name: "exported-assets.zip", size: 8100000, type: "application/zip" },
    ],
    submissionNotes:
      "Completed all responsive screens and exported all assets. Hero, features (6 items), testimonials (3 cards), and CTA sections are done. Please review and let me know if any changes are needed.",
    submittedAt: "11 Jun 2026 at 3:42 PM",
    demoLink: "https://edtech-landing.vercel.app",
  },
  {
    id: "p2",
    title: "React Portfolio Website",
    status: "active",
    category: "Web Development",
    student: { name: "Roshan Bhandari", initials: "RB" },
    client: { name: "Dikshya Khanal", initials: "AC" },
    startDate: "10 Jun 2026",
    deadline: "20 Jun 2026",
    budget: "6,500",
    description:
      "Build a personal portfolio website using React and TailwindCSS based on the provided Figma design. Must be deployed to Vercel and fully responsive.",
    requirements:
      "Implement pixel-perfect from Figma design. All animations must be subtle and professional. Include contact form with validation. Deploy to Vercel before submission.",
    skills: ["React", "TailwindCSS", "JavaScript", "Vercel"],
  },
  {
    id: "p4",
    title: "Social Media Design Kit",
    status: "completed",
    category: "Graphic Design",
    student: { name: "Aakash Thapa", initials: "AT" },
    client: { name: "Dikshya Khanal", initials: "AC" },
    startDate: "1 Jun 2026",
    deadline: "5 Jun 2026",
    budget: "3,500",
    description:
      "Create a set of 20 branded social media post templates for Instagram, Facebook, and LinkedIn in Canva.",
    requirements:
      "Templates must cover: announcements, quotes, product features. All editable in Canva. Export as PNG and Canva share links.",
    skills: ["Canva", "Graphic Design", "Social Media"],
    submissionFiles: [{ name: "social-media-kit.zip", size: 15200000, type: "application/zip" }],
    submissionNotes:
      "Delivered all 20 templates. Canva share links are included in the ZIP readme file.",
    submittedAt: "5 Jun 2026 at 9:00 AM",
  },
];
