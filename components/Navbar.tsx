"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  FiBookOpen,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Ebooks", href: "/ebooks" },
  { name: "Dashboard", href: "/dashboard" },
];

type User = {
  name: string;
  email: string;
  role: string;
  photoURL?: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const loadUser = () => {
    const savedUser = localStorage.getItem("fable-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadUser();

    window.addEventListener("fable-auth-change", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("fable-auth-change", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("fable-token");
    localStorage.removeItem("fable-user");

    window.dispatchEvent(new Event("fable-auth-change"));

    setUser(null);
    setProfileOpen(false);
    setOpen(false);
    router.push("/");
  };

  const linkClass = (href: string) => {
    const isActive = pathname === href;

    return isActive
      ? "rounded-full bg-violet-100 px-4 py-2 font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
      : "rounded-full px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-violet-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-violet-300";
  };

  const userImage =
    user?.photoURL && user.photoURL.trim() !== "" ? user.photoURL : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-violet-700 dark:text-violet-300"
        >
          <span className="rounded-xl bg-violet-700 p-2 text-white shadow-md dark:bg-violet-500">
            <FiBookOpen />
          </span>
          Fable
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          ))}

          {mounted && (
            <button
              type="button"
              onClick={handleThemeToggle}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser />
                  )}
                </span>

                <div className="text-left">
                  <p className="max-w-28 truncate text-sm font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                    {user.role}
                  </p>
                </div>

                <FiChevronDown />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <p className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {user.email}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-violet-700 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-violet-800 dark:bg-violet-600 dark:hover:bg-violet-700"
            >
              Login
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <button
              type="button"
              onClick={handleThemeToggle}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-2xl text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-md dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={linkClass(link.href)}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser />
                    )}
                  </span>

                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm capitalize text-slate-500">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-full bg-red-600 px-5 py-2 text-center font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-full bg-violet-700 px-5 py-2 text-center font-semibold text-white dark:bg-violet-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}