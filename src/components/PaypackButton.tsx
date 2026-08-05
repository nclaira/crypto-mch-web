"use client";

const PAYPACK_LINKS = [
  { maxPrice: 3000, url: "https://payments.paypack.rw/link/YOUR_3000_LINK_ID" },
  { maxPrice: 5000, url: "https://payments.paypack.rw/link/plink_Rzdpcu80a5Mst9IE4SP7" },
];

const FALLBACK_LINK = "https://payments.paypack.rw/link/plink_Rzdpcu80a5Mst9IE4SP7";

function getPaypackLink(price: number): string {
  const match = PAYPACK_LINKS.find((l) => price <= l.maxPrice);
  return match ? match.url : FALLBACK_LINK;
}

interface PaypackProps {
  amount: number;
  bookId: string;
}

export default function PaypackButton({ amount, bookId }: PaypackProps) {
  const handlePay = () => {
    const link = getPaypackLink(amount);
    const redirectUrl = `${window.location.origin}/download?status=success&bookId=${bookId}`;
    window.location.href = `${link}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <button
      onClick={handlePay}
      className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 font-semibold text-black shadow-lg transition hover:scale-[1.01]"
    >
      Pay RWF {amount.toLocaleString()}
    </button>
  );
}
