import { FiBookOpen } from "react-icons/fi";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-violet-700 text-4xl text-white shadow-xl shadow-violet-500/30">
          <FiBookOpen />
        </div>

        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />

        <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">
          Loading Fable...
        </p>
      </div>
    </div>
  );
}