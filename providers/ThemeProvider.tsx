"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="fable-theme"
      disableTransitionOnChange
    >
      {children}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: "600",
          },

          success: {
            style: {
              background: "#10b981",
              color: "#fff",
            },
          },

          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </NextThemesProvider>
  );
}