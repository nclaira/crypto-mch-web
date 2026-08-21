import { Resend } from "resend";

interface WelcomeEmailParams {
  to: string;
  username: string;
  loginUrl: string;
}

export function buildWelcomeEmailHtml({ username, loginUrl }: WelcomeEmailParams): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d1117;color:#e5e7eb;padding:32px;border-radius:16px;border:1px solid rgba(212,175,55,0.2);">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#d4af37;">Mucamanza Crypto Hub</p>
      <h1 style="margin:0 0 16px;font-size:24px;color:#f3e5ab;">Welcome, ${escapeHtml(username)}!</h1>
      <p style="margin:0 0 12px;color:#9ca3af;font-size:14px;line-height:1.6;">
        Your account has been created successfully. You can now sign in to explore premium crypto and forex resources.
      </p>
      <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;line-height:1.6;">
        Browse the library, preview free content, and unlock paid materials when you are ready.
      </p>
      <a href="${loginUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#d4af37,#f3e5ab);color:#000;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">
        Sign In to Your Account
      </a>
      <p style="margin:24px 0 0;color:#6b7280;font-size:12px;line-height:1.5;">
        If you did not create this account, you can safely ignore this email.
      </p>
    </div>
  `;
}

/** Sends welcome email after signup. Failures are logged and never thrown. */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Welcome email skipped: RESEND_API_KEY is not set");
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "Mucamanza Crypto Hub <hello@mucamanzacryptohub.com>";

    await resend.emails.send({
      from,
      to: params.to,
      subject: "Welcome to Mucamanza Crypto Hub",
      html: buildWelcomeEmailHtml(params),
    });
  } catch (error) {
    console.error("Welcome email failed:", error);
  }
}



function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
