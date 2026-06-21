"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../../services/api";

export default function PurchasedEbooksPage() {
  const [ebooks, setEbooks] = useState<any[]>([]);
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
        setEbooks(res.data.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black">
          Purchased Ebooks
        </h1>

        <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-700">
          {ebooks.length} Books
        </span>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm"
            >
              <div className="h-64 animate-pulse bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-5 animate-pulse rounded bg-slate-200" />
                <div className="h-4 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-12 text-center">
          <h3 className="text-xl font-bold">
            No Purchased Ebooks
          </h3>

          <p className="mt-2 text-slate-500">
            You haven't purchased any ebooks yet.
          </p>

          <Link
            href="/ebooks"
            className="mt-5 inline-block rounded-xl bg-violet-700 px-6 py-3 font-bold text-white"
          >
            Browse Ebooks
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {ebooks.map((ebook: any) => (
            <Link
              href={`/ebooks/${ebook.ebookId}`}
              key={ebook._id}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900"
            >
              <img
                src={ebook.coverImage}
                alt={ebook.ebookTitle}
                className="h-64 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="line-clamp-2 text-lg font-black">
                  {ebook.ebookTitle}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {ebook.writerName}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-violet-700">
                    ${ebook.amount}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Purchased
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}