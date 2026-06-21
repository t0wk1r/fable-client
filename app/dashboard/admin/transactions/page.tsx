"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiCreditCard, FiSearch } from "react-icons/fi";
import api from "../../../../services/api";

type Transaction = {
  _id: string;
  type: string;
  ebookId?: string;
  ebookTitle?: string;
  buyerEmail?: string;
  buyerName?: string;
  writerEmail?: string;
  writerName?: string;
  userEmail?: string;
  amount: number;
  status: string;
  createdAt: string;
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTransactions = async () => {
    const token = localStorage.getItem("fable-token");

    try {
      const res = await api.get("/admin/transactions", {
        headers: { authorization: token },
      });

      setTransactions(res.data.data || []);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        item._id?.toLowerCase().includes(keyword) ||
        item.type?.toLowerCase().includes(keyword) ||
        item.ebookTitle?.toLowerCase().includes(keyword) ||
        item.buyerEmail?.toLowerCase().includes(keyword) ||
        item.buyerName?.toLowerCase().includes(keyword) ||
        item.writerName?.toLowerCase().includes(keyword) ||
        item.writerEmail?.toLowerCase().includes(keyword) ||
        item.userEmail?.toLowerCase().includes(keyword);

      const matchesType = typeFilter ? item.type === typeFilter : true;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  const totalAmount = filteredTransactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const transactionTypes = Array.from(
    new Set(transactions.map((item) => item.type).filter(Boolean))
  );

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-xl">
        <FiCreditCard className="mb-4 text-5xl" />
        <h1 className="text-4xl font-black">All Transactions</h1>
        <p className="mt-2 text-violet-100">
          View ebook purchases, publishing fees and platform payment records.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Transactions
          </p>
          <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            {filteredTransactions.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Amount
          </p>
          <h3 className="mt-1 text-3xl font-black text-emerald-600">
            ${totalAmount}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Payment Types
          </p>
          <h3 className="mt-1 text-3xl font-black text-violet-700">
            {transactionTypes.length}
          </h3>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <div className="relative lg:col-span-2">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transaction, ebook, user, writer..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All Types</option>
            {transactionTypes.map((type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white">
              No transactions found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500 dark:border-slate-800">
                  <th className="py-3">Transaction ID</th>
                  <th>Type</th>
                  <th>Ebook / Item</th>
                  <th>User / Buyer</th>
                  <th>Writer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item._id.slice(-8)}
                      </span>
                    </td>

                    <td className="capitalize text-slate-500">
                      {item.type?.replaceAll("_", " ")}
                    </td>

                    <td className="font-semibold text-slate-900 dark:text-white">
                      {item.ebookTitle || "Publishing Fee"}
                    </td>

                    <td className="text-slate-500">
                      {item.buyerName ||
                        item.buyerEmail ||
                        item.userEmail ||
                        "N/A"}
                    </td>

                    <td className="text-slate-500">
                      {item.writerName || item.writerEmail || "N/A"}
                    </td>

                    <td className="font-bold text-emerald-600">
                      ${item.amount || 0}
                    </td>

                    <td className="text-slate-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          item.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
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