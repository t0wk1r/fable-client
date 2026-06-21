"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiBook,
  FiDollarSign,
  FiEdit,
  FiPlusCircle,
  FiShoppingBag,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import api from "../../../services/api";

type User = {
  name: string;
  email: string;
  role: string;
  photoURL?: string;
};

type Ebook = {
  _id: string;
  title: string;
  price: number;
  status: string;
  genre: string;
  totalSales?: number;
  createdAt?: string;
};

type Sale = {
  _id: string;
  ebookTitle: string;
  buyerEmail: string;
  amount: number;
  purchaseDate?: string;
  createdAt?: string;
};

export default function WriterDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("fable-user");
    const token = localStorage.getItem("fable-token");

    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchData = async () => {
      try {
        const [ebooksRes, salesRes] = await Promise.all([
          api.get("/my-ebooks", { headers: { authorization: token } }),
          api.get("/writer-sales", { headers: { authorization: token } }),
        ]);

        setEbooks(ebooksRes.data.data || []);
        setSales(salesRes.data.data || []);
      } catch {
        setEbooks([]);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, []);

  const totalRevenue = sales.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-violet-100">Writer Dashboard</p>
            <h1 className="text-4xl font-black">
              Welcome, {user?.name || "Writer"}
            </h1>
            <p className="mt-2 text-violet-100">
              Manage your ebooks, sales, and publishing status.
            </p>
          </div>

          <Link
            href="/dashboard/writer/add-ebook"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-violet-700"
          >
            <FiPlusCircle />
            Add Ebook
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FiBook className="mb-4 text-4xl text-violet-700" />
          <p className="text-sm text-slate-500">My Ebooks</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">
            {ebooks.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FiShoppingBag className="mb-4 text-4xl text-emerald-600" />
          <p className="text-sm text-slate-500">Total Sales</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">
            {sales.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FiDollarSign className="mb-4 text-4xl text-amber-600" />
          <p className="text-sm text-slate-500">Revenue</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">
            ${totalRevenue}
          </h3>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Manage Ebooks
            </h2>
            <Link
              href="/dashboard/writer/ebooks"
              className="text-sm font-bold text-violet-700"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : ebooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <FiBook className="mx-auto mb-3 text-4xl text-violet-700" />
              <p className="font-bold text-slate-900 dark:text-white">
                No ebooks added yet
              </p>
              <Link
                href="/dashboard/writer/add-ebook"
                className="mt-4 inline-block rounded-full bg-violet-700 px-5 py-2 font-bold text-white"
              >
                Add Ebook
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500 dark:border-slate-800">
                    <th className="py-3">Title</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Sales</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ebooks.slice(0, 5).map((ebook) => (
                    <tr key={ebook._id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 font-semibold text-slate-900 dark:text-white">
                        {ebook.title}
                      </td>
                      <td className="py-4 font-bold">${ebook.price}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                          {ebook.status}
                        </span>
                      </td>
                      <td className="py-4">{ebook.totalSales || 0}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/writer/edit-ebook/${ebook._id}`}
                            className="rounded-lg bg-blue-100 p-2 text-blue-700"
                          >
                            <FiEdit />
                          </Link>
                          <button className="rounded-lg bg-red-100 p-2 text-red-700">
                            <FiTrash2 />
                          </button>
                        </div>
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
            Sales History
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <FiShoppingBag className="mx-auto mb-3 text-4xl text-violet-700" />
              <p className="font-bold text-slate-900 dark:text-white">
                No sales yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 6).map((sale) => (
                <div
                  key={sale._id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {sale.ebookTitle}
                    </h3>
                    <p className="text-sm text-slate-500">{sale.buyerEmail}</p>
                  </div>
                  <p className="font-black text-emerald-600">${sale.amount}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-5 text-2xl font-black text-slate-900 dark:text-white">
          Writer Profile
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-3xl text-violet-700">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <FiUser />
            )}
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-slate-500">{user?.email}</p>
            <span className="mt-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-sm font-bold capitalize text-violet-700">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}