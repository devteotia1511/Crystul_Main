"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/auth/login", "/auth/register"];

  useEffect(() => {
    // While loading, do nothing
    if (status === "loading") return;

    // If the user is not authenticated and not on a public route
    if (!session && !publicRoutes.includes(pathname)) {
      router.replace("/auth/login");
    }

    // If user is already logged in and tries to visit login/register, redirect to dashboard
    if (session && publicRoutes.includes(pathname)) {
      router.replace("/dashboard");
    }
  }, [session, status, pathname, router]);

  if (
    status === "loading" ||
    (!session && !publicRoutes.includes(pathname)) ||
    (session && publicRoutes.includes(pathname))
  ) {
    return null; // Avoid rendering during redirect
  }

  return <>{children}</>;
};