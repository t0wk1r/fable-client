"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiBook,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../../services/api";

type MonthlySale = {
  month: string;
  sales: number;
  revenue: number;
};

type GenreData = {
  genre: string;
  count: number;
};

type Analytics = {
  totalUsers: number;
  totalWriters: number;
  totalEbooks: number;
  totalSold: number;
  totalRevenue: number;
  monthlySales?: MonthlySale[];
  ebooksByGenre?: GenreData[];
};

type Transaction = {
  _id: string;
  type: string;
  ebookTitle?: string;
  buyerEmail?: string;
  writerName?: string;
  amount: number;
  status: string;
  createdAt: string;
};

const pieColors = ["#7c3aed", "#2563eb", "#059669", "#f59e0b", "#dc2626", "#9333ea"];

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalWriters: 0,
    totalEbooks: 0,
    totalSold: 0,
    totalRevenue: 0,
    monthlySales: [],
    ebooksByGenre: [],
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fable-token");

    const fetchData = async () => {
      try {
        const [analyticsRes, transactionRes] = await Promise.all([
          api.get("/admin/analytics", { headers: { authorization: token } }),
          api.get("/admin/transactions", { headers: { authorization: token } }),
        ]);

        setAnalytics(analyticsRes.data.data || {});
        setTransactions(transactionRes.data.data || []);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, []);

  const cards = [
    { title: "Total Users", value: analytics.totalUsers, icon: FiUsers, color: "text-violet-700" },
    { title: "Total Writers", value: analytics.totalWriters, icon: FiTrendingUp, color: "text-blue-700" },
    { title: "Total Ebooks", value: analytics.totalEbooks, icon: FiBook, color: "text-amber-700" },
    { title: "Total Sold", value: analytics.totalSold, icon: FiShoppingBag, color: "text-emerald-700" },
    { title: "Revenue", value: `$${analytics.totalRevenue || 0}`, icon: FiDollarSign, color: "text-rose-700" },
  ];

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-xl">
        <p className="mb-2 text-violet-100">Admin Dashboard</p>
        <h1 className="text-4xl font-black">Analytics Overview</h1>
        <p className="mt-2 text-violet-100">
          Manage users, ebooks, transactions and platform revenue.
        </p>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <Icon className={`mb-4 text-4xl ${card.color}`} />
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
              <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
                {card.value}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-2xl font-black text-slate-900 dark:text-white">
            Monthly Sales
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" name="Sales" fill="#7c3aed" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-2xl font-black text-slate-900 dark:text-white">
            Ebooks by Genre
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.ebooksByGenre || []}
                  dataKey="count"
                  nameKey="genre"
                  outerRadius={110}
                  label
                >
                  {(analytics.ebooksByGenre || []).map((_, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-3">
        <Link href="/dashboard/admin/users" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <FiUsers className="mb-4 text-4xl text-violet-700" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Manage Users</h3>
          <p className="mt-2 text-slate-500">Change user roles or delete accounts.</p>
        </Link>

        <Link href="/dashboard/admin/ebooks" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <FiBook className="mb-4 text-4xl text-violet-700" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Manage All Ebooks</h3>
          <p className="mt-2 text-slate-500">Publish, unpublish or delete ebooks.</p>
        </Link>

        <Link href="/dashboard/admin/transactions" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <FiShoppingBag className="mb-4 text-4xl text-violet-700" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Transactions</h3>
          <p className="mt-2 text-slate-500">View purchases and publishing fee history.</p>
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Recent Transactions
          </h2>

          <Link href="/dashboard/admin/transactions" className="text-sm font-bold text-violet-700">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <FiShoppingBag className="mx-auto mb-3 text-4xl text-violet-700" />
            <p className="font-bold text-slate-900 dark:text-white">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500 dark:border-slate-800">
                  <th className="py-3">Transaction</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">User/Writer</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.slice(0, 6).map((item) => (
                  <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-4 font-semibold text-slate-900 dark:text-white">
                      {item.ebookTitle || item._id}
                    </td>
                    <td className="py-4 capitalize text-slate-500">{item.type}</td>
                    <td className="py-4 text-slate-500">
                      {item.buyerEmail || item.writerName || "N/A"}
                    </td>
                    <td className="py-4 font-bold">${item.amount}</td>
                    <td className="py-4 text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}