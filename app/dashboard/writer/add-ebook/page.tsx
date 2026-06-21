"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../../../services/api";

const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror"];

export default function AddEbookPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("fable-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

  const handleWriterVerification = async () => {
    const token = localStorage.getItem("fable-token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setVerifying(true);

      const res = await api.post(
        "/create-writer-verification-session",
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );

      window.location.href = res.data.url;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to start verification payment"
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.isVerifiedWriter) {
      toast.error("Please verify your writer account first");
      return;
    }

    setLoading(true);

    const form = e.currentTarget;
    const token = localStorage.getItem("fable-token");

    try {
      const imageFile = (form.elements.namedItem("coverImage") as HTMLInputElement)
        .files?.[0];

      if (!imageFile) {
        toast.error("Cover image is required");
        return;
      }

      const coverImage = await uploadImageToImgBB(imageFile);

      const data = {
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        description: (
          form.elements.namedItem("description") as HTMLTextAreaElement
        ).value,
        content: (form.elements.namedItem("content") as HTMLTextAreaElement)
          .value,
        price: Number(
          (form.elements.namedItem("price") as HTMLInputElement).value
        ),
        genre: (form.elements.namedItem("genre") as HTMLSelectElement).value,
        status: (form.elements.namedItem("status") as HTMLSelectElement).value,
        coverImage,
        writerName: user.name,
        writerId: user._id,
      };

      await api.post("/ebooks", data, {
        headers: { authorization: token },
      });

      toast.success("Ebook added successfully");
      router.push("/dashboard/writer/ebooks");
    } catch (error: any) {
      toast.error(
        error?.message || error?.response?.data?.message || "Failed to add ebook"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const isVerified = !!user?.isVerifiedWriter;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Add Ebook
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Upload your ebook cover to imgBB and publish or save it as unpublished.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Writer Verification
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Complete one-time verification payment before publishing ebooks.
            </p>
          </div>

          {isVerified ? (
            <button
              type="button"
              disabled
              className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white"
            >
              Verified Writer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleWriterVerification}
              disabled={verifying}
              className="rounded-xl bg-violet-700 px-6 py-3 font-bold text-white hover:bg-violet-800 disabled:opacity-60"
            >
              {verifying ? "Processing..." : "Verify Writer - $5"}
            </button>
          )}
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${
          !isVerified ? "opacity-70" : ""
        }`}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
              Ebook Title
            </label>
            <input
              name="title"
              required
              disabled={!isVerified}
              placeholder="Enter ebook title"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
              Price
            </label>
            <input
              name="price"
              required
              min="0"
              type="number"
              disabled={!isVerified}
              placeholder="Enter price"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
              Genre
            </label>
            <select
              name="genre"
              required
              disabled={!isVerified}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select Genre</option>
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
              defaultValue="published"
              disabled={!isVerified}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950"
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
            required
            type="file"
            accept="image/*"
            disabled={!isVerified}
            onChange={handlePreview}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-violet-700 file:px-4 file:py-2 file:font-bold file:text-white disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950"
          />

          {preview && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-slate-500">
                Preview
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
            required
            disabled={!isVerified}
            placeholder="Short ebook description"
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
            Full Ebook Content
          </label>
          <textarea
            name="content"
            required
            disabled={!isVerified}
            placeholder="Write full ebook content"
            rows={8}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <button
          disabled={loading || !isVerified}
          className="mt-6 w-full rounded-xl bg-violet-700 py-3 font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!isVerified
            ? "Verify Writer First"
            : loading
            ? "Uploading & Adding..."
            : "Add Ebook"}
        </button>
      </form>
    </div>
  );
}