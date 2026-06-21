"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../../../../services/api";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fable-token");

    api
      .get("/bookmarks", {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setBookmarks(res.data.data || []);
      })
      .catch(() => {
        toast.error("Failed to load bookmarks");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRemoveBookmark = async (ebookId: string) => {
    try {
      const token = localStorage.getItem("fable-token");

      await api.delete(`/bookmarks/${ebookId}`, {
        headers: {
          authorization: token,
        },
      });

      setBookmarks((prev) =>
        prev.filter((item) => item.ebookId !== ebookId)
      );

      toast.success("Bookmark removed");
    } catch {
      toast.error("Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-black">My Bookmarks</h1>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-slate-900"
            >
              <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-3 p-4">
                <div className="h-5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black">
          My Bookmarks
        </h1>

        <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-700">
          {bookmarks.length} Books
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-12 text-center">
          <h3 className="text-xl font-bold">
            No bookmarks found
          </h3>

          <p className="mt-2 text-slate-500">
            Save your favorite ebooks to access them quickly.
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
          {bookmarks.map((item: any) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900"
            >
              <Link href={`/ebooks/${item.ebookId}`}>
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-64 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="line-clamp-2 text-lg font-black">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.writerName}
                  </p>

                  {item.genre && (
                    <span className="mt-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      {item.genre}
                    </span>
                  )}
                </div>
              </Link>

              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveBookmark(item.ebookId)
                  }
                  className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700"
                >
                  Remove Bookmark
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}