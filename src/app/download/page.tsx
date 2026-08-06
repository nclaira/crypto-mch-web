"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, XCircle, Loader2 } from "lucide-react";
import { useCryptoAuth } from "@/lib/auth";

interface BookData {
  title: string;
  pdfUrl: string;
  price: number;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const bookId = searchParams.get("bookId");
  const { user, setUser } = useCryptoAuth();

  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "success" || !bookId) {
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        // 1. Fetch book details
        const bookRes = await fetch("/api/books/" + bookId);
        const bookData = await bookRes.json();

        if (!bookData.success) {
          setError("Could not load book details.");
          return;
        }

        setBook({ title: bookData.title, pdfUrl: bookData.pdfUrl, price: bookData.price });

        // 2. Mark user as paid in MongoDB
        await fetch("/api/payments/confirm", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId }),
        });

        // 3. Update auth context so BookCard shows download button immediately
        if (user) {
          setUser({ ...user, isPaid: true });
        }

      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [status, bookId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#d4af37]" />
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            Preparing your download...
          </p>
        </div>
      </div>
    );
  }

  if (status !== "success" || !bookId || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
        <div
          className="w-full max-w-md rounded-2xl p-[1px]"
          style={{ backgroundImage: "linear-gradient(135deg,#ef4444,#7f1d1d,#ef4444)" }}
        >
          <div className="rounded-2xl bg-[#0d1117] p-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {error || "This download link is invalid or your payment was not completed."}
            </p>
            <Link
              href="/books"
              className="mt-8 inline-block rounded-xl border border-[#d4af37]/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f3e5ab] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10"
            >
              Back to Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
      <div
        className="w-full max-w-md rounded-2xl p-[1px] shadow-[0_0_60px_-10px_rgba(212,175,55,0.4)]"
        style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#f3e5ab,#9ca3af,#d4af37)" }}
      >
        <div className="rounded-2xl bg-[#0d1117] p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Payment Confirmed</p>
          <h1 className="mt-3 text-2xl font-bold bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
            {book?.title}
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            Your purchase is complete. Click below to download your eBook.
          </p>
          <a
            href={book?.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={book?.title}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" />
            Download eBook
          </a>
          <Link
            href="/books"
            className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-gray-300 transition"
          >
            Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0d1117]"><Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" /></div>}>
      <DownloadContent />
    </Suspense>
  );
}
