import Link from "next/link";
import { FiBookOpen, FiEye, FiShoppingBag } from "react-icons/fi";

type Ebook = {
  _id: string;
  title: string;
  writerName: string;
  coverImage: string;
  genre: string;
  price: number;
  totalSales?: number;
};

export default function EbookCard({ ebook }: { ebook: Ebook }) {
  const sold = (ebook.totalSales || 0) > 0;

  return (
    <Link
      href={`/ebooks/${ebook._id}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative">
        {sold && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            <FiShoppingBag />
            Sold
          </span>
        )}

        <div className="h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
          {ebook.coverImage ? (
            <img
              src={ebook.coverImage}
              alt={ebook.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FiBookOpen className="text-6xl text-violet-700 dark:text-violet-400" />
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <p className="mb-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          {ebook.genre}
        </p>

        <h3 className="line-clamp-1 text-lg font-black text-slate-900 dark:text-white">
          {ebook.title}
        </h3>

        <p className="mt-2 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
          By {ebook.writerName}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-black text-slate-900 dark:text-white">
            ${ebook.price}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
            <FiEye />
            Details
          </span>
        </div>
      </div>
    </Link>
  );
}