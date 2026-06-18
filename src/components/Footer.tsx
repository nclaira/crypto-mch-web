// =============================================================
// Footer — luxury dark, gold accents
// =============================================================
import { XIcon, Send, MessageCircle } from "lucide-react";

const Footer = () => (
  <footer className="mt-24 border-t border-[#d4af37]/15 bg-black/60">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
      <div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full ring-1 ring-[#d4af37]/40 bg-[#d4af37]/20" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Mucamanza</div>
            <div className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-base font-bold tracking-wider text-transparent">
              CRYPTO HUB
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          Decentralized resource distribution & advanced crypto architecture gateway.
        </p>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Follow</h4>
        <div className="mt-4 flex gap-4 text-gray-300">
          <a href="#" aria-label="Twitter" className="rounded-full border border-[#d4af37]/20 p-2 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"><XIcon className="h-4 w-4" /></a>
          <a href="#" aria-label="Telegram" className="rounded-full border border-[#d4af37]/20 p-2 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"><Send className="h-4 w-4" /></a>
          <a href="#" aria-label="Discord" className="rounded-full border border-[#d4af37]/20 p-2 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"><MessageCircle className="h-4 w-4" /></a>
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Disclaimer</h4>
        <p className="mt-4 text-sm text-gray-400">
          Educational content only. Not financial advice. Trade responsibly.
        </p>
      </div>
    </div>
    <div className="border-t border-[#d4af37]/10 py-5 text-center text-xs tracking-[0.2em] text-gray-500">
      © {new Date().getFullYear()} MUCAMANZA CRYPTO HUB — ALL RIGHTS RESERVED
    </div>
  </footer>
);

export default Footer;
