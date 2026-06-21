"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiBook, FiSearch, FiTrash2 } from "react-icons/fi";
import api from "../../../../services/api";

type Ebook = {
  _id: string;
  title: string;
  writerName: string;
  coverImage?: string;
  genre: string;
  price: number;
  status: "published" | "unpublished";
  totalSales?: number;
  createdAt?: string;
};

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEbooks = async () => {
    const token = localStorage.getItem("fable-token");

    try {
      const res = await api.get("/admin/ebooks", {
        headers: { authorization: token },
      });

      setEbooks(res.data.data || []);
    } catch {
      toast.error("Failed to load ebooks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  const filteredEbooks = useMemo(() => {
    return ebooks.filter((ebook) => {
      const keyword = search.toLowerCase();

      return (
        ebook.title?.toLowerCase().includes(keyword) ||
        ebook.writerName?.toLowerCase().includes(keyword) ||
        ebook.genre?.toLowerCase().includes(keyword)
      );
    });
  }, [ebooks, search]);

  const handleStatusChange = async (id: string, status: string) => {
    const token = localStorage.getItem("fable-token");

    try {
      await api.patch(
        `/admin/ebooks/status/${id}`,
        { status },
        { headers: { authorization: token } }
      );

      toast.success("Ebook status updated");
      fetchEbooks();
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ebook?")) return;

    const token = localStorage.getItem("fable-token");

    try {
      await api.delete(`/admin/ebooks/${id}`, {
        headers: { authorization: token },
      });

      toast.success("Ebook deleted");
      fetchEbooks();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 p-8 text-white shadow-xl">
        <FiBook className="mb-4 text-5xl" />
        <h1 className="text-4xl font-black">Manage All Ebooks</h1>
        <p className="mt-2 text-violet-100">
          Publish, unpublish or delete ebooks from one place.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Ebooks
          </p>
          <h3 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
            {ebooks.length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Published
          </p>
          <h3 className="mt-1 text-3xl font-black text-emerald-600">
            {ebooks.filter((item) => item.status === "published").length}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Unpublished
          </p>
          <h3 className="mt-1 text-3xl font-black text-amber-600">
            {ebooks.filter((item) => item.status === "unpublished").length}
          </h3>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Ebook List
          </h2>

          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, writer or genre..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
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
        ) : filteredEbooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white">
              No ebooks found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search keyword.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500 dark:border-slate-800">
                  <th className="py-3">Ebook</th>
                  <th>Writer</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEbooks.map((ebook) => (
                  <tr
                    key={ebook._id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-11 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          {ebook.coverImage ? (
                            <img
                              src={ebook.coverImage}
                              alt={ebook.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-violet-700">
                              <FiBook />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="line-clamp-1 max-w-[220px] font-bold text-slate-900 dark:text-white">
                            {ebook.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {ebook.createdAt
                              ? new Date(ebook.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-slate-500">{ebook.writerName}</td>
                    <td className="text-slate-500">{ebook.genre}</td>
                    <td className="font-bold">${ebook.price}</td>
                    <td>{ebook.totalSales || 0}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          ebook.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {ebook.status}
                      </span>
                    </td>

                    <td>
                      <select
                        value={ebook.status}
                        onChange={(e) =>
                          handleStatusChange(ebook._id, e.target.value)
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                      >
                        <option value="published">Published</option>
                        <option value="unpublished">Unpublished</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => handleDelete(ebook._id)}
                        className="rounded-xl bg-red-100 p-3 text-red-700 hover:bg-red-200"
                      >
                        <FiTrash2 />
                      </button>
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