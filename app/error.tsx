"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <div className="mb-6 text-7xl">⚠️</div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Something went wrong
        </h1>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          An unexpected error occurred while loading this page.
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-violet-700 px-6 py-3 font-bold text-white hover:bg-violet-800"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}