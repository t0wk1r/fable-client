"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "./components/DashboardSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";

type User = {
  name: string;
  email: string;
  role: string;
  photoURL?: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fable-token");
    const savedUser = localStorage.getItem("fable-user");

    if (!token || !savedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (pathname.startsWith("/dashboard/admin") && parsedUser.role !== "admin") {
      router.push(`/dashboard/${parsedUser.role}`);
      return;
    }

    if (pathname.startsWith("/dashboard/writer") && parsedUser.role !== "writer") {
      router.push(`/dashboard/${parsedUser.role}`);
      return;
    }

    if (pathname.startsWith("/dashboard/user") && parsedUser.role !== "user") {
      router.push(`/dashboard/${parsedUser.role}`);
      return;
    }

    setUser(parsedUser);
    setChecking(false);
  }, [router, pathname]);

  if (checking) return <LoadingSpinner />;

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex">
        <DashboardSidebar user={user} />

        <main className="min-h-screen flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </section>
  );
}