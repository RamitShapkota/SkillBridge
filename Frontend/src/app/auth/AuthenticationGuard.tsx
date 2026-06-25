import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";

import { getCurrentUser, type AuthUser } from "@/services/auth/authService";

type AuthenticationGuardProps = {
  allowedRole: AuthUser["role"];
  children: React.ReactNode;
};

const dashboardPaths = {
  student: "/dashboard/student",
  client: "/dashboard/client",
  admin: "/admin/dashboard",
};

export default function AuthenticationGuard({
  allowedRole,
  children,
}: AuthenticationGuardProps) {
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // This checks the existing login cookie after page refresh.
        const response = await getCurrentUser();
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== allowedRole) {
    // Logged-in users can only open their own dashboard area.
    return <Navigate to={dashboardPaths[user.role]} replace />;
  }

  return children;
}
