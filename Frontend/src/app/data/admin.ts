// ── Verification requests ─────────────────────────────────────────────────────

export type VerificationStatus = "pending" | "approved" | "rejected";

export interface VerificationRequest {
  id: string;
  name: string;
  initials: string;
  email: string;
  university: string;
  studentId: string;
  submittedAt: string;
  status: VerificationStatus;
  major: string;
  year: string;
}

export const VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: "v1",
    name: "Ramit Sharma",
    initials: "RS",
    email: "ramit.sharma@ku.edu.np",
    university: "Kathmandu University",
    studentId: "KU-2021-0342",
    submittedAt: "13 Jun 2026",
    status: "pending",
    major: "Computer Science",
    year: "3rd Year",
  },
  {
    id: "v2",
    name: "Sita Adhikari",
    initials: "SA",
    email: "sita.adhikari@tu.edu.np",
    university: "Tribhuvan University",
    studentId: "TU-2022-1187",
    submittedAt: "12 Jun 2026",
    status: "pending",
    major: "Business Studies",
    year: "2nd Year",
  },
  {
    id: "v3",
    name: "Bikash Rai",
    initials: "BR",
    email: "bikash.rai@pokhara.edu.np",
    university: "Pokhara University",
    studentId: "PU-2020-0891",
    submittedAt: "11 Jun 2026",
    status: "pending",
    major: "Information Tech",
    year: "4th Year",
  },
  {
    id: "v4",
    name: "Priya Sharma",
    initials: "PS",
    email: "priya.sharma@ku.edu.np",
    university: "Kathmandu University",
    studentId: "KU-2022-0188",
    submittedAt: "10 Jun 2026",
    status: "approved",
    major: "Design",
    year: "3rd Year",
  },
  {
    id: "v5",
    name: "Aakash Thapa",
    initials: "AT",
    email: "aakash.thapa@tu.edu.np",
    university: "Tribhuvan University",
    studentId: "TU-2021-0564",
    submittedAt: "9 Jun 2026",
    status: "approved",
    major: "Graphic Design",
    year: "Final Year",
  },
  {
    id: "v6",
    name: "Roshan Bhandari",
    initials: "RB",
    email: "roshan.bhandari@ncit.edu.np",
    university: "NCIT",
    studentId: "NCIT-2022-211",
    submittedAt: "8 Jun 2026",
    status: "rejected",
    major: "Software Eng.",
    year: "3rd Year",
  },
  {
    id: "v7",
    name: "Manisha Poudel",
    initials: "MP",
    email: "manisha.poudel@bu.edu.np",
    university: "Butwal University",
    studentId: "BU-2023-0045",
    submittedAt: "7 Jun 2026",
    status: "pending",
    major: "Mass Communication",
    year: "2nd Year",
  },
];

// ── Client KYC requests ───────────────────────────────────────────────────────

export interface ClientKycRequest {
  id: string;
  name: string;
  initials: string;
  email: string;
  legalName: string;
  phone: string;
  companyName?: string;
  submittedAt: string;
  status: VerificationStatus;
}

export const CLIENT_KYC_REQUESTS: ClientKycRequest[] = [
  {
    id: "ck1",
    name: "Dikshya Khanal",
    initials: "DK",
    email: "dikshya@techventures.com",
    legalName: "Dikshya Khanal",
    phone: "9841234567",
    companyName: "TechNova Pvt. Ltd.",
    submittedAt: "12 Jun 2026",
    status: "pending",
  },
  {
    id: "ck2",
    name: "Sneha Rao",
    initials: "SR",
    email: "sneha.rao@designco.com",
    legalName: "Sneha Rao",
    phone: "9851234568",
    submittedAt: "10 Jun 2026",
    status: "pending",
  },
  {
    id: "ck3",
    name: "Vikram Nair",
    initials: "VN",
    email: "vikram@startuphub.io",
    legalName: "Vikram Nair",
    phone: "9861234569",
    companyName: "StartupHub Pvt. Ltd.",
    submittedAt: "8 Jun 2026",
    status: "approved",
  },
  {
    id: "ck4",
    name: "Meera Joshi",
    initials: "MJ",
    email: "meera.joshi@brandworks.com",
    legalName: "Meera Joshi",
    phone: "9871234560",
    submittedAt: "5 Jun 2026",
    status: "rejected",
  },
];

// ── Users ─────────────────────────────────────────────────────────────────────

export type UserRole = "student" | "client";
export type UserStatus = "active" | "suspended";

export interface PlatformUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  projectCount: number;
}

export const PLATFORM_USERS: PlatformUser[] = [
  {
    id: "u1",
    name: "Priya Sharma",
    initials: "PS",
    email: "priya.sharma@ku.edu.np",
    role: "student",
    status: "active",
    joinedAt: "1 Mar 2026",
    projectCount: 5,
  },
  {
    id: "u2",
    name: "Aakash Thapa",
    initials: "AT",
    email: "aakash.thapa@tu.edu.np",
    role: "student",
    status: "active",
    joinedAt: "5 Mar 2026",
    projectCount: 4,
  },
  {
    id: "u3",
    name: "Roshan Bhandari",
    initials: "RB",
    email: "roshan.bhandari@ncit.edu.np",
    role: "student",
    status: "active",
    joinedAt: "10 Mar 2026",
    projectCount: 2,
  },
  {
    id: "u4",
    name: "Manisha Poudel",
    initials: "MP",
    email: "manisha.poudel@bu.edu.np",
    role: "student",
    status: "suspended",
    joinedAt: "12 Mar 2026",
    projectCount: 1,
  },
  {
    id: "u5",
    name: "Ramit Sharma",
    initials: "RS",
    email: "ramit.sharma@ku.edu.np",
    role: "student",
    status: "active",
    joinedAt: "15 Mar 2026",
    projectCount: 0,
  },
  {
    id: "u6",
    name: "Anil Chakraborty",
    initials: "AC",
    email: "anil.c@techventures.com",
    role: "client",
    status: "active",
    joinedAt: "2 Feb 2026",
    projectCount: 8,
  },
  {
    id: "u7",
    name: "Sneha Rao",
    initials: "SR",
    email: "sneha.rao@designco.com",
    role: "client",
    status: "active",
    joinedAt: "14 Feb 2026",
    projectCount: 3,
  },
  {
    id: "u8",
    name: "Vikram Nair",
    initials: "VN",
    email: "vikram@startuphub.io",
    role: "client",
    status: "active",
    joinedAt: "20 Feb 2026",
    projectCount: 2,
  },
  {
    id: "u9",
    name: "Meera Joshi",
    initials: "MJ",
    email: "meera.joshi@brandworks.com",
    role: "client",
    status: "suspended",
    joinedAt: "1 Mar 2026",
    projectCount: 1,
  },
];
