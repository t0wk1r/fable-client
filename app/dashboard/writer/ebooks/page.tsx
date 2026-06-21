"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import api from "../../../../services/api";

export default function WriterEbooksPage() {
    const [ebooks, setEbooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEbooks = async () => {
        const token = localStorage.getItem("fable-token");

        try {
            const res = await api.get("/my-ebooks", {
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;

        const token = localStorage.getItem("fable-token");

        try {
            await api.delete(`/ebooks/${id}`, {
                headers: { authorization: token },
            });

            toast.success("Ebook deleted");
            fetchEbooks();
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleToggleStatus = async (id: string, status: string) => {
        const token = localStorage.getItem("fable-token");

        try {
            await api.patch(
                `/ebooks/${id}/status`,
                { status: status === "published" ? "unpublished" : "published" },
                { headers: { authorization: token } }
            );

            toast.success("Status updated");
            fetchEbooks();
        } catch {
            toast.error("Status update failed");
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        Manage Ebooks
                    </h1>
                    <p className="text-slate-500">Manage your own ebooks.</p>
                </div>

                <Link
                    href="/dashboard/writer/add-ebook"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-bold text-white"
                >
                    <FiPlus /> Add Ebook
                </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                        ))}
                    </div>
                ) : ebooks.length === 0 ? (
                    <p className="rounded-2xl border border-dashed p-8 text-center text-slate-500">
                        No ebooks found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left">
                            <thead>
                                <tr className="border-b text-sm text-slate-500 dark:border-slate-800">
                                    <th className="py-3">Title</th>
                                    <th>Genre</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Sales</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {ebooks.map((ebook) => (
                                    <tr key={ebook._id} className="border-b dark:border-slate-800">
                                        <td className="py-4 font-bold text-slate-900 dark:text-white">
                                            {ebook.title}
                                        </td>
                                        <td>{ebook.genre}</td>
                                        <td>${ebook.price}</td>
                                        <td>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${ebook.status === "published"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {ebook.status}
                                            </span>
                                        </td>
                                        <td>{ebook.totalSales || 0}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/dashboard/writer/edit-ebook/${ebook._id}`}
                                                    className="rounded-lg bg-blue-100 p-2 text-blue-700"
                                                >
                                                    <FiEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ebook._id)}
                                                    className="rounded-lg bg-red-100 p-2 text-red-700"
                                                >
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
        </div>
    );
}