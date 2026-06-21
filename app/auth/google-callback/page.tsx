"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processGoogleLogin = async () => {
      try {
        const sessionRes = await fetch(
          "http://localhost:3000/api/auth/get-session",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const sessionData = await sessionRes.json();
        const googleUser = sessionData?.user;

        if (!googleUser?.email) {
          toast.error("Google user not found");
          router.push("/login");
          return;
        }

        const res = await api.post("/google-login", {
          name: googleUser.name,
          email: googleUser.email,
          photoURL: googleUser.image,
        });

        localStorage.setItem("fable-token", res.data.token);
        localStorage.setItem("fable-user", JSON.stringify(res.data.user));

        window.dispatchEvent(new Event("fable-auth-change"));

        toast.success("Google login successful");
        router.push("/");
      } catch {
        toast.error("Google login failed");
        router.push("/login");
      }
    };

    processGoogleLogin();
  }, [router]);

  return <LoadingSpinner />;
}