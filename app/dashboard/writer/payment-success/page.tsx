"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../../../services/api";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export default function WriterPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const called = useRef(false);

  useEffect(() => {
    if (!sessionId || called.current) return;

    called.current = true;

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("fable-token");

        await api.get(`/writer-payment-success?session_id=${sessionId}`, {
          headers: { authorization: token },
        });

        const savedUser = localStorage.getItem("fable-user");

        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.isVerifiedWriter = true;
          localStorage.setItem("fable-user", JSON.stringify(user));
          window.dispatchEvent(new Event("fable-auth-change"));
        }

        toast.success("Writer verification successful");
        router.replace("/dashboard/writer/add-ebook");
      } catch {
        toast.error("Writer verification failed");
        router.replace("/dashboard/writer");
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  return <LoadingSpinner />;
}