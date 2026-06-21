"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../../../../services/api";

const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror"];

export default function EditEbookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ebook, setEbook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    api
      .get(`/ebooks/${id}`)
      .then((res) => {
        setEbook(res.data.data);
        setPreview(res.data.data?.coverImage || "");
      })
      .catch(() => toast.error("Failed to load ebook"))
      .finally(() => setLoading(false));
  }, [id]);

  const uploadImageToImgBB = async (imageFile: File) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("imgBB API key is missing");
    }

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imageData,
    });

    const data = await res.json();

    if (!data?.success) {
      throw new Error("Image upload failed");
    }

    return data.data.url;
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const form = e.currentTarget;
      const token = localStorage.getItem("fable-token");

      let coverImage = ebook.coverImage;

      const imageFile = (form.elements.namedItem("coverImage") as HTMLInputElement)
        .files?.[0];

      if (imageFile) {
        coverImage = await uploadImageToImgBB(imageFile);
      }

      const data = {
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        price: Number((form.elements.namedItem("price") as HTMLInputElement).value),
        genre: (form.elements.namedItem("genre") as HTMLSelectElement).value,
        status: (form.elements.namedItem("status") as HTMLSelectElement).value,
        coverImage,
        description: (
          form.elements.namedItem("description") as HTMLTextAreaElement
        ).value,
        content: (form.elements.namedItem("content") as HTMLTextAreaElement)
          .value,
      };

      await api.patch(`/ebooks/${id}`, data, {
        headers: { authorization: token },
      });

      toast.success("Ebook updated successfully");
      router.push("/dashboard/writer/ebooks");
    } catch (error: any) {
      toast.error(error?.message || error?.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 h-10 w-52 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>

          <div className="mt-5 h-44 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-5 h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Ebook not found
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Edit Ebook
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Update ebook information, publish status and cover image.
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
              Ebook Title
            </label>
            <input
              name="title"
              defaultValue={ebook.title}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
              Price
            </label>
            <input
              name="price"
              type="number"
              min="0"
              defaultValue={ebook.price}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
              Genre
            </label>
            <select
              name="genre"
              defaultValue={ebook.genre}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
              Publish Status
            </label>
            <select
              name="status"
              defaultValue={ebook?.status || "published"}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
            Cover Image
          </label>

          <input
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={handlePreview}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-violet-700 file:px-4 file:py-2 file:font-bold file:text-white dark:border-slate-700 dark:bg-slate-950"
          />

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Leave empty to keep the current cover image.
          </p>

          {preview && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-slate-500">
                Current / New Preview
              </p>
              <img
                src={preview}
                alt="Cover preview"
                className="h-52 w-40 rounded-2xl object-cover shadow-lg"
              />
            </div>
          )}
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={ebook.description}
            rows={4}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
            Full Ebook Content
          </label>
          <textarea
            name="content"
            defaultValue={ebook.content}
            rows={8}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <button
          disabled={updating}
          className="mt-6 w-full rounded-xl bg-violet-700 py-3 font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updating ? "Uploading & Updating..." : "Update Ebook"}
        </button>
      </form>
    </div>
  );
}