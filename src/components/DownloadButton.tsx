"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

type Props = {
  fileUrl: string;       // The UploadThing CDN URL
  title: string;         // Used as the saved filename e.g. "Crypto Basics.pdf"
  className?: string;    // Optional extra classes for styling flexibility
  label?: string;        // Button label — defaults to "Download PDF"
};

const DownloadButton = ({ fileUrl, title, className, label = "Download PDF" }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Fetch the file from the CDN URL
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(`Could not fetch file (${response.status})`);
      }

      // 2. Convert the response to a Blob
      const blob = await response.blob();

      // 3. Generate a temporary Object URL from the Blob
      const objectUrl = window.URL.createObjectURL(blob);

      // 4. Create a hidden <a> and programmatically click it to trigger save
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${title}.pdf`;   // Sets the saved filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      // 5. Revoke the Object URL to free memory
      window.URL.revokeObjectURL(objectUrl);

    } catch (err: any) {
      setError("Download failed. Please try again.");
      console.error("Download error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.02] disabled:opacity-60"
        }
      >
        {loading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Download className="h-4 w-4" />
        }
        {loading ? "Downloading..." : label}
      </button>

      {/* Error message shown below the button if fetch fails */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default DownloadButton;
