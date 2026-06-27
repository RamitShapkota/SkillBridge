import { useEffect, useState } from "react";

import { Navbar } from "../../app/components/Navbar";
import { Hero } from "../../app/components/Hero";
import { Features } from "../../app/components/Features";
import { HowItWorks } from "../../app/components/HowItWorks";
import { WhyChoose } from "../../app/components/WhyChoose";
import { CTA } from "../../app/components/CTA";
import { Footer } from "../../app/components/Footer";
import { getCurrentUser, type AuthUser } from "../../services/authService";

export default function Landing() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();
        setCurrentUser(response.data);
      } catch {
        setCurrentUser(null);
      }
    };

    checkUser();
  }, []);

  const getStartedPath = currentUser?.role === "admin" ? "/admin/dashboard" : "/register";

  const loginPath = currentUser?.role === "admin" ? "/admin/login" : "/login";

  const exploreJobsPath =
    currentUser?.role === "student" ? "/dashboard/student/browse-jobs" : "/browse";

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar getStartedPath={getStartedPath} loginPath={loginPath} />
      <main>
        <Hero getStartedPath={getStartedPath} exploreJobsPath={exploreJobsPath} />
        <Features />
        <HowItWorks />
        <WhyChoose getStartedPath={getStartedPath} />
        <CTA getStartedPath={getStartedPath} />
      </main>
      <Footer />
    </div>
  );
}
