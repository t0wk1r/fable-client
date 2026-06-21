import Link from "next/link";
import { FiArrowLeft, FiBookOpen, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 dark:bg-slate-950">
      <div className="max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-violet-100 text-6xl text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          <FiBookOpen />
        </div>

        <h1 className="text-8xl font-black text-violet-700 dark:text-violet-400">
          404
        </h1>

        <h2 className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist, was moved, or the link is incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-700 px-6 py-3 font-bold text-white transition hover:bg-violet-800"
          >
            <FiHome />
            Go Home
          </Link>

          <Link
            href="/ebooks"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:border-violet-700 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <FiArrowLeft />
            Browse Ebooks
          </Link>
        </div>
      </div>
    </section>
  );
}