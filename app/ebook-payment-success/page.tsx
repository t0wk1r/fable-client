"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function EbookPaymentSuccessPage() {
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

        await api.get(`/ebook-payment-success?session_id=${sessionId}`, {
          headers: { authorization: token },
        });

        toast.success("Ebook purchased successfully");
        router.replace("/dashboard/user/ebooks");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Ebook purchase failed"
        );
        router.replace("/ebooks");
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  return <LoadingSpinner />;
}