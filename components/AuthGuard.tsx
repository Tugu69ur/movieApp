import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Wait for the navigation to be ready
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 500); // Increased delay to ensure router is fully mounted

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isNavigationReady || !segments || !segments[0]) return;

    const inAuthGroup = segments[0] === "(tabs)" || segments[0] === "movies";

    if (!isAuthenticated && inAuthGroup) {
      // User is not authenticated but trying to access protected routes
      router.replace("/login" as any);
    } else if (isAuthenticated && segments[0] === "login" as any) {
      // User is authenticated but on login page
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, router, isNavigationReady]);

  return <>{children}</>;
}
