"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "../../lib/auth-client";
import {
  FiBookOpen,
  FiEye,
  FiEyeOff,
  FiLogIn,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import api from "../../services/api";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("fable-token");

    if (token) {
      router.push("/");
    }
  }, [router]);

  const redirectByRole = (role: string) => {
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "writer") {
      router.push("/dashboard/writer");
    } else {
      router.push("/");
    }
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();

    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("fable-token", token);
      localStorage.setItem("fable-user", JSON.stringify(user));

      window.dispatchEvent(new Event("fable-auth-change"));

      toast.success("Login successful");

      redirectByRole(user.role);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "https://fable-client-blond.vercel.app/auth/google-callback",
    });
  } catch {
    toast.error("Google login failed");
  }
};

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-700 text-3xl text-white shadow-lg shadow-violet-500/25">
            <FiBookOpen />
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Login to continue reading and publishing ebooks.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 py-3 font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiLogIn />

              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-violet-700 dark:text-violet-400"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}