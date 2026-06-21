"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiStar } from "react-icons/fi";

const ebookCovers = [
  {
    title: "Silent Pages",
    genre: "Mystery",
    gradient: "from-amber-300 to-orange-500",
  },
  {
    title: "Digital Forest",
    genre: "Fantasy",
    gradient: "from-emerald-300 to-teal-600",
  },
  {
    title: "Moonlit Code",
    genre: "Sci-Fi",
    gradient: "from-sky-300 to-indigo-600",
  },
  {
    title: "Love Letters",
    genre: "Romance",
    gradient: "from-pink-300 to-rose-600",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-slate-900 dark:from-violet-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.20),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%)]" />

      <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 dark:bg-white/15 dark:text-violet-100">
            <FiBookOpen />
            Read. Share. Discover.
          </p>

          <h1 className="mb-6 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">
            Discover & Read Original Ebooks
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600 dark:text-violet-100">
            Fable connects passionate readers with talented writers. Explore
            unique stories, purchase ebooks, and build your own digital library.
          </p>

          <Link
            href="/ebooks"
            className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-7 py-3 font-bold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-1 hover:bg-violet-800 dark:bg-white dark:text-violet-700 dark:hover:bg-violet-50"
          >
            Browse Ebooks
            <FiArrowRight />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:block"
        >
          <div className="relative h-[430px]">
            {ebookCovers.map((book, index) => (
              <motion.div
                key={book.title}
                animate={{
                  y: [0, -18, 0],
                  rotate: index % 2 === 0 ? [0, 2, 0] : [0, -2, 0],
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute w-44 overflow-hidden rounded-3xl bg-gradient-to-br ${book.gradient} p-5 shadow-2xl shadow-violet-500/20`}
                style={{
                  left: `${index * 120}px`,
                  top: `${index % 2 === 0 ? 40 : 120}px`,
                  zIndex: 10 + index,
                }}
              >
                <div className="mb-20 flex justify-between text-white/90">
                  <FiBookOpen className="text-3xl" />
                  <FiStar />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                    {book.genre}
                  </p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-white">
                    {book.title}
                  </h3>
                </div>

                <div className="mt-8 h-2 w-20 rounded-full bg-white/70" />
                <div className="mt-3 h-2 w-28 rounded-full bg-white/40" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}