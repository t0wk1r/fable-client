"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiDollarSign,
  FiShoppingBag,
} from "react-icons/fi";
import api from "../../../../services/api";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fable-token");

    api
      .get("/my-purchases", {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setPurchases(res.data.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalSpent = useMemo(() => {
    return purchases.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [purchases]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-black md:text-4xl">
          Purchase History
        </h1>

        <p className="mt-2 text-violet-100">
          View all purchased ebooks and transaction details.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
            <FiShoppingBag />
          </div>

          <p className="text-sm text-slate-500">
            Total Purchases
          </p>

          <h3 className="mt-2 text-3xl font-black">
            {purchases.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
            <FiDollarSign />
          </div>

          <p className="text-sm text-slate-500">
            Total Spent
          </p>

          <h3 className="mt-2 text-3xl font-black">
            ${totalSpent}
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-2xl font-black">
            Purchased Ebooks
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-16 text-center">
            <FiBookOpen className="mx-auto mb-4 text-6xl text-violet-600" />

            <h3 className="text-2xl font-bold">
              No Purchases Yet
            </h3>

            <p className="mt-2 text-slate-500">
              Purchase an ebook to see it here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                  <th className="px-6 py-4 font-bold">
                    Ebook
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Writer
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Price
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Purchase Date
                  </th>

                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold">
                          {item.ebookTitle}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.writerName || "Unknown Writer"}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ${item.amount}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(
                        item.purchaseDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
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