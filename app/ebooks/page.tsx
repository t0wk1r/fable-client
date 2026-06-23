"use client";

import { useEffect, useState } from "react";
import EbookCard from "../../components/EbookCard";
import api from "../../services/api";

type Ebook = {
  _id: string;
  title: string;
  writerName: string;
  coverImage: string;
  genre: string;
  price: number;
  status: string;
  totalSales?: number;
};

const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror"];

export default function BrowseEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const fetchEbooks = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (genre) params.append("genre", genre);
      if (sort) params.append("sort", sort);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await api.get(`/ebooks?${params.toString()}`);

      setEbooks(res.data.data || []);
      //setTotalPages(res.data.totalPages || 1);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch {
      setEbooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEbooks();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, genre, sort, minPrice, maxPrice, page]);

  const handleReset = () => {
    setSearch("");
    setGenre("");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-2 font-semibold text-violet-700 dark:text-violet-400">
            Explore Library
          </p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Browse Ebooks
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            Search, filter and sort available ebooks without login. Purchase
            action will require authentication.
          </p>
        </div>

        <div className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2 lg:grid-cols-6">
          <input
            type="text"
            placeholder="Search title or writer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950 lg:col-span-2"
          />

          <select
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All Genres</option>
            {genres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Newest</option>
            <option value="price-low-high">Price Low - High</option>
            <option value="price-high-low">Price High - Low</option>
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
          />

          <button
            onClick={handleReset}
            className="rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white hover:bg-violet-800 md:col-span-2 lg:col-span-6"
          >
            Reset Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-52 animate-pulse bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-8 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              No ebooks found
            </h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {ebooks.map((ebook) => (
                <EbookCard key={ebook._id} ebook={ebook} />
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`h-10 w-10 rounded-xl font-semibold ${
                    page === index + 1
                      ? "bg-violet-700 text-white"
                      : "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}