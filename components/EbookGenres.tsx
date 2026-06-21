import Link from "next/link";
import {
  FiBookOpen,
  FiHeart,
  FiSearch,
  FiZap,
  FiMoon,
  FiFeather,
} from "react-icons/fi";

const genres = [
  { name: "Fiction", icon: FiBookOpen },
  { name: "Mystery", icon: FiSearch },
  { name: "Romance", icon: FiHeart },
  { name: "Sci-Fi", icon: FiZap },
  { name: "Fantasy", icon: FiFeather },
  { name: "Horror", icon: FiMoon },
];

export default function EbookGenres() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-2 font-semibold text-violet-700 dark:text-violet-400">
            Explore Categories
          </p>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">
            Ebook Genres
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((genre) => {
            const Icon = genre.icon;

            return (
              <Link
                key={genre.name}
                href={`/ebooks?genre=${genre.name}`}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700 group-hover:bg-violet-700 group-hover:text-white dark:bg-violet-500/15 dark:text-violet-300">
                  <Icon />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {genre.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Discover popular {genre.name.toLowerCase()} ebooks from talented writers.
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}