"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("fable-user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role === "admin") router.push("/dashboard/admin");
    else if (user.role === "writer") router.push("/dashboard/writer");
    else router.push("/dashboard/user");
  }, [router]);

  return null;
}