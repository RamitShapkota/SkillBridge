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
      "Priya delivered outstanding work. The landing page exceeded my expectations — clean layout, perfect mobile responsiveness, and all brand guidelines were followed precisely. Highly professional communication throughout.",
    recommended: true,
    completedAt: "12 Jun 2026",
    submittedAt: "13 Jun 2026",
  },
  {
    id: "r2",
    clientName: "Anil Chakraborty",
    clientInitials: "AC",
    studentName: "Aakash Thapa",
    studentInitials: "AT",
    projectId: "p4",
    projectName: "Social Media Design Kit",
    rating: 5,
    comment:
      "Aakash completed all 20 templates on time and they look amazing. Every template is consistent with the brand identity. Will definitely hire again.",
    recommended: true,
    completedAt: "5 Jun 2026",
    submittedAt: "5 Jun 2026",
  },
  {
    id: "r3",
    clientName: "Sneha Rao",
    clientInitials: "SR",
    studentName: "Priya Sharma",
    studentInitials: "PS",
    projectId: "p5",
    projectName: "Brand Identity Design",
    rating: 4,
    comment:
      "Great work overall. The logo concepts were creative and on-brand. Feedback was incorporated quickly. Solid professionalism for a student-level project.",
    recommended: true,
    completedAt: "3 Jun 2026",
    submittedAt: "4 Jun 2026",
  },
  {
    id: "r4",
    clientName: "Vikram Nair",
    clientInitials: "VN",
    studentName: "Priya Sharma",
    studentInitials: "PS",
    projectId: "p6",
    projectName: "E-commerce UI Design",
    rating: 5,
    comment:
      "Exceptional attention to detail. Priya clearly understands UX principles and delivered a polished, user-friendly interface. Communication was smooth and timely.",
    recommended: true,
    completedAt: "28 May 2026",
    submittedAt: "29 May 2026",
  },
  {
    id: "r5",
    clientName: "Meera Joshi",
    clientInitials: "MJ",
    studentName: "Priya Sharma",
    studentInitials: "PS",
    projectId: "p7",
    projectName: "Mobile App Prototype",
    rating: 4,
    comment:
      "Very good work on the prototype. The flows were well thought out. Would have liked more screen variations but overall quality was high.",
    recommended: true,
    completedAt: "20 May 2026",
    submittedAt: "21 May 2026",
  },
];
