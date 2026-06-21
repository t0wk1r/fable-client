"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiBookmark,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiLock,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import api from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";

type Ebook = {
  _id: string;
  title: string;
  writerName: string;
  writerId?: string;
  coverImage: string;
  genre: string;
  description: string;
  content?: string;
  price: number;
  status: string;
  totalSales?: number;
  createdAt?: string;
};

type Purchase = {
  ebookId: string;
};

export default function EbookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarking, setBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("fable-token");
  };

  const getTokenPayload = () => {
    const token = getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const res = await api.get(`/ebooks/${id}`);
        setEbook(res.data.data);
      } catch {
        setEbook(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEbook();
  }, [id]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!ebook) return;

      const token = getToken();
      const payload = getTokenPayload();

      if (payload?.id === ebook.writerId) {
        setIsOwner(true);
      }

      if (!token) return;

      try {
        const res = await api.get("/my-purchases", {
          headers: {
            authorization: token,
          },
        });

        const purchases: Purchase[] = res.data.data || [];
        const found = purchases.some((item) => item.ebookId === ebook._id);

        setPurchased(found);
      } catch {
        setPurchased(false);
      }

      const bookmarkRes = await api.get(`/bookmarks/check/${ebook._id}`, {
        headers: {
          authorization: token,
        },
      });

      setBookmarked(bookmarkRes.data.bookmarked);
    };



    checkUserStatus();
  }, [ebook]);

  const handleBookmark = async () => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    setBookmarking(true);

    try {
      await api.post(
        "/bookmarks",
        { ebookId: id },
        {
          headers: {
            authorization: token,
          },
        }
      );

      alert("Ebook bookmarked successfully!");
      setBookmarked(true);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to bookmark.");
    } finally {
      setBookmarking(false);
    }
  };

  const handlePurchase = async () => {
  const token = getToken();

  if (!token) {
    router.push("/login");
    return;
  }

  if (isOwner) return;

  setPurchasing(true);

  try {
    const res = await api.post(
      "/create-ebook-checkout-session",
      {
        ebookId: id,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );

    window.location.href = res.data.url;
  } catch (error: any) {
    alert(
      error?.response?.data?.message ||
        "Failed to start payment"
    );
  } finally {
    setPurchasing(false);
  }
};

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 h-10 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="h-[520px] animate-pulse rounded-[1.5rem] bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex gap-3">
                <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-9 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="h-12 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-4 h-12 w-3/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

              <div className="mt-6 h-28 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="mt-8 space-y-3">
                <div className="h-7 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="mt-8 flex gap-4">
                <div className="h-14 w-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-14 w-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!ebook) {
    return (
      <section className="min-h-screen bg-slate-50 py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 dark:border-slate-700 dark:bg-slate-900">
            <FiBookOpen className="mx-auto mb-5 text-6xl text-violet-700" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Ebook not found
            </h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              The ebook you are looking for does not exist or may have been removed.
            </p>
            <Link
              href="/ebooks"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-700 px-6 py-3 font-bold text-white hover:bg-violet-800"
            >
              <FiArrowLeft />
              Back to Browse
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const uploadedDate = ebook.createdAt
    ? new Date(ebook.createdAt).toLocaleDateString()
    : "Not available";

  const isSold = (ebook.totalSales || 0) > 0;

  return (
    <section className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <Link
          href="/ebooks"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 font-semibold text-slate-700 shadow-sm hover:text-violet-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <FiArrowLeft />
          Back to Ebooks
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-800">
              {isSold && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  Sold
                </span>
              )}

              {ebook.coverImage ? (
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="h-[520px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[520px] items-center justify-center">
                  <FiBookOpen className="text-7xl text-violet-700" />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                {ebook.genre}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {ebook.status === "published" ? "Available" : "Unavailable"}
              </span>
            </div>

            <h1 className="text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
              {ebook.title}
            </h1>

            <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <FiUser />
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Writer
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {ebook.writerName}
                  </h3>
                  <Link
                    href={`/ebooks?writer=${ebook.writerName}`}
                    className="text-sm font-semibold text-violet-700 dark:text-violet-400"
                  >
                    View writer ebooks
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <FiDollarSign className="mb-2 text-2xl text-violet-700" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Price</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  ${ebook.price}
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <FiCheckCircle className="mb-2 text-2xl text-emerald-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  {isSold ? "Sold" : "Available"}
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <FiCalendar className="mb-2 text-2xl text-violet-700" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Uploaded</p>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {uploadedDate}
                </h4>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-3 text-2xl font-black text-slate-900 dark:text-white">
                Description
              </h3>
              <p className="leading-8 text-slate-600 dark:text-slate-300">
                {ebook.description}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {isOwner ? (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-400 px-8 py-4 font-bold text-white"
                >
                  <FiLock />
                  Your Own Ebook
                </button>
              ) : purchased ? (
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 font-bold text-white"
                >
                  <FiCheckCircle />
                  Already Purchased
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || ebook.status !== "published"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-8 py-4 font-bold text-white shadow-lg shadow-violet-500/25 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiShoppingCart />
                  {purchasing ? "Processing..." : "Buy Now"}
                </button>
              )}

              <button
                onClick={handleBookmark}
                disabled={bookmarking || bookmarked}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold transition disabled:cursor-not-allowed ${bookmarked
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-violet-700 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  }`}
              >
                <FiBookmark />
                {bookmarking ? "Saving..." : bookmarked ? "Already Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-2xl font-black text-slate-900 dark:text-white">
            Ebook Content
          </h3>

          {purchased ? (
            <p className="leading-8 text-slate-700 dark:text-slate-300">
              {ebook.content || "No content available."}
            </p>
          ) : (
            <div className="rounded-3xl border border-dashed border-violet-300 bg-violet-50 p-8 text-center dark:border-violet-700 dark:bg-violet-500/10">
              <FiLock className="mx-auto mb-4 text-5xl text-violet-700 dark:text-violet-300" />
              <h4 className="text-xl font-black text-violet-700 dark:text-violet-300">
                Purchase Required
              </h4>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Purchase this ebook to unlock and read the full content.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}