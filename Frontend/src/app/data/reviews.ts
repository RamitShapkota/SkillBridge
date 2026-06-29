export interface Review {
  id: string;
  clientName: string;
  clientInitials: string;
  studentName: string;
  studentInitials: string;
  projectId: string;
  projectName: string;
  rating: number;
  comment: string;
  recommended: boolean;
  completedAt: string;
  submittedAt: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    clientName: "Anil Chakraborty",
    clientInitials: "AC",
    studentName: "Priya Sharma",
    studentInitials: "PS",
    projectId: "p1",
    projectName: "EdTech Landing Page Design",
    rating: 5,
    comment:
      "Priya delivered outstanding work. The landing page exceeded expectations with a clean layout, strong mobile responsiveness, and careful brand consistency.",
    recommended: true,
    completedAt: "12 Jun 2026",
    submittedAt: "13 Jun 2026",
  },
];
