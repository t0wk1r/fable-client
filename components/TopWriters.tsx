"use client";

import { useEffect, useState } from "react";
import { FiAward, FiUser } from "react-icons/fi";
import api from "../services/api";

type Writer = {
  _id: string;
  writerName: string;
  totalSales: number;
};

export default function TopWriters() {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/top-writers")
      .then((res) => {
        setWriters(res.data.data || []);
      })
      .catch(() => {
        setWriters([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-2 font-semibold text-violet-700 dark:text-violet-400">
            Popular Creators
          </p>

          <h2 className="text-4xl font-black text-slate-900 dark:text-white">
            Top Writers
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />

                <div className="mx-auto mt-5 h-6 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                <div className="mx-auto mt-4 h-7 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                <div className="mx-auto mt-3 h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : writers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No writers found
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Writer statistics are not available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {writers.map((writer, index) => (
              <div
                key={writer._id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-4xl text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <FiUser />
                </div>

                <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  <FiAward />
                  #{index + 1} Writer
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {writer.writerName}
                </h3>

                <p className="mt-4 font-bold text-violet-700 dark:text-violet-400">
                  {writer.totalSales} ebook sales
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}