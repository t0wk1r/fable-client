"use client";

import { useEffect, useState } from "react";
import EbookCard from "./EbookCard";
import api from "../services/api";
import { motion } from "framer-motion";

type Ebook = {
  _id: string;
  title: string;
  writerName: string;
  coverImage: string;
  genre: string;
  price: number;
};

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/ebooks?limit=6")
      .then((res) => {
        setEbooks(res.data.data || []);
      })
      .catch(() => {
        setEbooks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-2 font-semibold text-violet-700 dark:text-violet-400">
            Featured Collection
          </p>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">
            Featured Ebooks
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <p className="text-center text-slate-500">No featured ebooks found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ebooks.map((ebook, index) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <EbookCard ebook={ebook} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}