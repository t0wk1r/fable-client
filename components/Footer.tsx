import Link from "next/link";
import { FiFacebook, FiGithub, FiInstagram, FiMail, FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300 dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <h2 className="mb-3 text-2xl font-bold text-white">Fable</h2>
          <p className="text-sm leading-6 text-slate-400">
            Discover, share, and read original ebooks from talented writers around the world.
          </p>

          <div className="mt-5 flex gap-3">
            <a href="#" className="rounded-full bg-slate-800 p-3 hover:bg-violet-700">
              <FiFacebook />
            </a>
            <a href="#" className="rounded-full bg-slate-800 p-3 hover:bg-violet-700">
              <FiTwitter />
            </a>
            <a href="#" className="rounded-full bg-slate-800 p-3 hover:bg-violet-700">
              <FiInstagram />
            </a>
            <a href="#" className="rounded-full bg-slate-800 p-3 hover:bg-violet-700">
              <FiGithub />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/ebooks" className="hover:text-white">Browse Ebooks</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Platform</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/register" className="hover:text-white">Become a Writer</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Newsletter</h3>
          <p className="mb-4 text-sm text-slate-400">
            Get updates about new ebooks and writers.
          </p>

          <div className="flex overflow-hidden rounded-full bg-white p-1">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 text-sm text-slate-900 outline-none"
            />
            <button className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800">
              <FiMail />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-5 text-center text-sm text-slate-500">
        © 2026 Fable. All rights reserved.
      </div>
    </footer>
  );
}