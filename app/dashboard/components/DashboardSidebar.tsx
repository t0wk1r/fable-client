"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiBarChart2,
  FiBook,
  FiBookmark,
  FiHome,
  FiLogOut,
  FiShoppingBag,
  FiUser,
  FiUsers,
} from "react-icons/fi";

type User = {
  name: string;
  email: string;
  role: string;
  photoURL?: string;
};

export default function DashboardSidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const links =
    user?.role === "admin"
      ? [
          { name: "Overview", href: "/dashboard/admin", icon: FiBarChart2 },
          { name: "Users", href: "/dashboard/admin/users", icon: FiUsers },
          { name: "Ebooks", href: "/dashboard/admin/ebooks", icon: FiBook },
          {
            name: "Transactions",
            href: "/dashboard/admin/transactions",
            icon: FiShoppingBag,
          },
        ]
      : user?.role === "writer"
      ? [
          { name: "Overview", href: "/dashboard/writer", icon: FiBarChart2 },
          { name: "My Ebooks", href: "/dashboard/writer/ebooks", icon: FiBook },
          { name: "Add Ebook", href: "/dashboard/writer/add-ebook", icon: FiBook },
          { name: "Sales", href: "/dashboard/writer/sales", icon: FiShoppingBag },
          { name: "Bookmarks", href: "/dashboard/writer/bookmarks", icon: FiBookmark },
        ]
      : [
          { name: "Overview", href: "/dashboard/user", icon: FiBarChart2 },
          { name: "Purchases", href: "/dashboard/user/purchases", icon: FiShoppingBag },
          { name: "My Ebooks", href: "/dashboard/user/ebooks", icon: FiBook },
          { name: "Bookmarks", href: "/dashboard/user/bookmarks", icon: FiBookmark },
          { name: "Profile", href: "/dashboard/user/profile", icon: FiUser },
        ];

  const handleLogout = () => {
    localStorage.removeItem("fable-token");
    localStorage.removeItem("fable-user");
    window.dispatchEvent(new Event("fable-auth-change"));
    router.push("/");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-black text-violet-700">
        <span className="rounded-xl bg-violet-700 p-2 text-white">
          <FiBook />
        </span>
        Fable
      </Link>

      <div className="mb-6 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-violet-700">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <FiUser />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-sm capitalize text-slate-500">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                active
                  ? "bg-violet-700 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon />
              {link.name}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
      >
        <FiLogOut />
        Logout
      </button>

      <Link
        href="/"
        className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <FiHome />
        Back Home
      </Link>
    </aside>
  );
}