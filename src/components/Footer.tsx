// Footer — Mucamanza Crypto Hub

const Footer = () => (
  <footer className="mt-16 border-t border-[#d4af37]/15 bg-black/60">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3">

      {/* Brand */}
      <div>
        <div className="flex items-center gap-3">
          <img src="/assets/logo.jpeg" alt="Mucamanza Crypto Hub logo" className="h-10 w-10 rounded-full object-cover ring-1 ring-[#d4af37]/40" />
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

      {/* Social Media Links */}
      <div>
        <h4 className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Follow Us</h4>
        <div className="mt-4 flex flex-wrap gap-3">

          {/* LinkedIn — paste your LinkedIn profile or page URL below */}
          <a
            href="https://www.linkedin.com/in/YOUR_LINKEDIN_HERE"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-full border border-[#d4af37]/20 p-2 text-gray-300 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 8.98h4V21H3V8.98zM8.5 8.98H12v1.65h.05c.49-.93 1.7-1.9 3.5-1.9 3.74 0 4.43 2.46 4.43 5.66V21h-4v-5.95c0-1.42-.03-3.24-1.97-3.24-1.98 0-2.28 1.54-2.28 3.14V21h-4V8.98z" />
            </svg>
          </a>

          {/* YouTube — paste your YouTube channel URL below */}
          <a
            href="https://youtube.com/@mrcrypto-hub250tradingsn?si=0nf8CYoyeiAs2BzE"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="rounded-full border border-[#d4af37]/20 p-2 text-gray-300 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.5v-7l6.25 3.5-6.25 3.5z" />
            </svg>
          </a>

          {/* Facebook — paste your Facebook page or group URL below */}
          <a
            href="https://www.facebook.com/share/1EADH8gKcG/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="rounded-full border border-[#d4af37]/20 p-2 text-gray-300 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54v-2.2c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.88h-2.33v6.99A10 10 0 0 0 22 12z" />
            </svg>
          </a>

          {/* TikTok — paste your TikTok profile URL below */}
          <a
            href="https://www.tiktok.com/@cryptomucamanzatrading?_r=1&_t=ZS-98I9wYf9exM"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="rounded-full border border-[#d4af37]/20 p-2 text-gray-300 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
            </svg>
          </a>

          {/* Twitter / X — paste your Twitter/X profile URL below */}
          <a
            href="https://x.com/JeanMucung82403"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="rounded-full border border-[#d4af37]/20 p-2 text-gray-300 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Telegram — paste your Telegram channel or group link below */}
          <a
            href="https://t.me/YOUR_TELEGRAM_HERE"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="rounded-full border border-[#d4af37]/20 p-2 text-gray-300 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>

          {/* WhatsApp — paste your WhatsApp GROUP invite link below */}
          {/* To get your group link: open WhatsApp group > group info > Invite via link > Copy link */}
          <a
            href="https://whatsapp.com/channel/0029Vb6d3WX0AgWKg6kDq91k"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Group"
            className="rounded-full border border-[#d4af37]/20 p-2 text-gray-300 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>

        </div>
      </div>

      {/* Disclaimer */}
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
