"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiBookOpen,
  FiBookmark,
  FiDollarSign,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import api from "../../../services/api";

type User = {
  name: string;
  email: string;
  role: string;
  photoURL?: string;
};

type Purchase = {
  _id: string;
  ebookId: string;
  ebookTitle: string;
  writerName: string;
  amount: number;
  status: string;
  purchaseDate: string;
  coverImage?: string;
};

const actions = [
  {
    title: "Browse Ebooks",
    href: "/ebooks",
    icon: FiBookOpen,
    style: "bg-violet-700 text-white",
  },
  {
    title: "My Purchases",
    href: "/dashboard/user/purchases",
    icon: FiShoppingBag,
    style:
      "border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white",
  },
  {
    title: "Bookmarks",
    href: "/dashboard/user/bookmarks",
    icon: FiBookmark,
    style:
      "border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white",
  },
  {
    title: "Profile",
    href: "/dashboard/user/profile",
    icon: FiUser,
    style:
      "border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white",
  },
];

export default function UserDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("fable-user");
    const token = localStorage.getItem("fable-token");

    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchPurchases = async () => {
      try {
        const res = await api.get("/my-purchases", {
          headers: { authorization: token },
        });

        setPurchases(res.data.data || []);
      } catch {
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPurchases();
  }, []);

  const totalSpent = purchases.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-100">
              User Dashboard
            </p>
            <h1 className="text-3xl font-black md:text-5xl">
              Welcome, {user?.name || "Reader"}
            </h1>
            <p className="mt-3 max-w-2xl text-violet-100">
              Manage your purchase history, purchased ebooks, bookmarks and
              profile from one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ebooks"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-violet-700"
              >
                Browse Ebooks
                <FiArrowRight />
              </Link>

              <Link
                href="/dashboard/user/purchases"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 font-bold text-white backdrop-blur hover:bg-white/20"
              >
                Purchase History
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl bg-white/15 p-4 backdrop-blur">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white/20 text-4xl">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser />
              )}
            </div>

            <div>
              <h3 className="text-xl font-black">{user?.name || "Reader"}</h3>
              <p className="text-sm text-violet-100">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold capitalize">
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            <FiShoppingBag />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Purchases
          </p>
          <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            {purchases.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <FiDollarSign />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Spent
          </p>
          <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            ${totalSpent}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            <FiBookOpen />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Purchased Ebooks
          </p>
          <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            {purchases.length}
          </h3>
        </div>

        <Link
          href="/dashboard/user/bookmarks"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <FiBookmark />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bookmarks
          </p>
          <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            View
          </h3>
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group rounded-3xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${action.style}`}
            >
              <Icon className="mb-4 text-3xl" />
              <div className="flex items-center justify-between">
                <h3 className="font-black">{action.title}</h3>
                <FiArrowRight className="transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6 xl:col-span-2">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Recent Purchase History
            </h2>

            <Link
              href="/dashboard/user/purchases"
              className="text-sm font-bold text-violet-700 dark:text-violet-400"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <FiBookOpen className="mx-auto mb-3 text-4xl text-violet-700" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                No purchases yet
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Browse ebooks and purchase your first book.
              </p>
              <Link
                href="/ebooks"
                className="mt-4 inline-block rounded-full bg-violet-700 px-5 py-2 font-bold text-white"
              >
                Browse Ebooks
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500 dark:border-slate-800">
                    <th className="py-3">Ebook</th>
                    <th className="py-3">Writer</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {purchases.slice(0, 5).map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="py-4 font-semibold text-slate-900 dark:text-white">
                        {purchase.ebookTitle}
                      </td>
                      <td className="py-4 text-slate-500">
                        {purchase.writerName}
                      </td>
                      <td className="py-4 font-bold">${purchase.amount}</td>
                      <td className="py-4 text-slate-500">
                        {purchase.purchaseDate
                          ? new Date(purchase.purchaseDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-2xl font-black text-slate-900 dark:text-white">
            Profile
          </h2>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-4xl text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser />
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {user?.name}
            </h3>

            <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>

            <span className="mt-4 inline-block rounded-full bg-violet-100 px-4 py-2 text-sm font-bold capitalize text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              {user?.role}
            </span>
          </div>

          <Link
            href="/dashboard/user/profile"
            className="mt-6 block rounded-xl bg-violet-700 py-3 text-center font-bold text-white hover:bg-violet-800"
          >
            View Profile
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Purchased Ebooks
            </h2>

            <Link
              href="/dashboard/user/ebooks"
              className="text-sm font-bold text-violet-700 dark:text-violet-400"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
              No purchased ebooks yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {purchases.slice(0, 4).map((item) => (
                <Link
                  href={`/ebooks/${item.ebookId}`}
                  key={item._id}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800"
                >
                  <div className="flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-4xl text-violet-700 dark:from-slate-800 dark:to-slate-950">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.ebookTitle}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <FiBookOpen />
                    )}
                  </div>

                  <h3 className="mt-4 line-clamp-1 font-black text-slate-900 dark:text-white">
                    {item.ebookTitle}
                  </h3>
                  <p className="text-sm text-slate-500">{item.writerName}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Bookmark Center
            </h2>

            <Link
              href="/dashboard/user/bookmarks"
              className="text-sm font-bold text-violet-700 dark:text-violet-400"
            >
              Manage
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-50 p-8 text-center dark:bg-slate-950">
            <FiBookmark className="mx-auto mb-4 text-5xl text-amber-600" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Save ebooks for later
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Bookmark ebooks you want to read or purchase later.
            </p>

            <Link
              href="/dashboard/user/bookmarks"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-700 px-5 py-3 font-bold text-white"
            >
              Open Bookmarks
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}