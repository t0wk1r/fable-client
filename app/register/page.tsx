"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBookOpen, FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";
import api from "../../services/api";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "../../lib/auth-client";

export default function RegisterPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("fable-token");

        if (token) {
            router.push("/");
        }
    }, [router]);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget;

        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
        const photoURL = (form.elements.namedItem("photoURL") as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
        const role = (form.elements.namedItem("role") as HTMLSelectElement).value;

        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            await api.post("/users", {
                name,
                email,
                photoURL,
                password,
                role,
            });

            const loginRes = await api.post("/login", {
                email,
                password,
            });

            localStorage.setItem("fable-token", loginRes.data.token);
            localStorage.setItem("fable-user", JSON.stringify(loginRes.data.user));

            window.dispatchEvent(new Event("fable-auth-change"));

            toast.success("Registration successful!");

            router.push("/");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/auth/google-callback`,
            });
        } catch {
            toast.error("Google registration failed");
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
                        Create Account
                    </h1>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Join Fable as a reader or writer.
                    </p>
                </div>

                <form
                    onSubmit={handleRegister}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className="mb-4">
                        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                            Full Name
                        </label>
                        <input
                            name="name"
                            required
                            type="text"
                            placeholder="Enter full name"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                            Email
                        </label>
                        <input
                            name="email"
                            required
                            type="email"
                            placeholder="Enter email"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                            Photo URL
                        </label>
                        <input
                            name="photoURL"
                            type="url"
                            placeholder="https://example.com/photo.jpg"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Optional. This photo will appear in the navbar after login.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                            Role
                        </label>
                        <select
                            name="role"
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
                        >
                            <option value="user">User / Reader</option>
                            <option value="writer">Writer</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                name="password"
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
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

                    <div className="mb-6">
                        <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                            Confirm Password
                        </label>

                        <input
                            name="confirmPassword"
                            required
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 py-3 font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FiUserPlus />
                        {loading ? "Creating Account..." : "Register"}
                    </button>
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

                    <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-violet-700 dark:text-violet-400">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}