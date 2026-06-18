// API helper — Mucamanza Crypto Hub
// -------------------------------------------------------------
// Every call MUST send `credentials: 'include'` so the browser
// attaches the HTTP-Only `token` cookie set by the backend at
// /api/auth/login. Without it, the backend will not recognise
// the session and protected routes will return 401/403.


export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; status: number; error: string };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      ...init,
      credentials: "include", // CRITICAL — sends HTTP-Only auth cookie
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });

    // Try to parse JSON safely (some endpoints — like /api/books/download —
    // may return a binary PDF stream instead).
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      if (!res.ok) return { ok: false as const, status: res.status, error: res.statusText };
      return { ok: true as const, data: (await res.blob()) as unknown as T };
    }

    const body = await res.json();
    if (!res.ok) {
      return { ok: false as const, status: res.status, error: body?.error || "Request failed" };
    }
    return { ok: true as const, data: body as T };
  } catch (err: any) {
    return { ok: false as const, status: 0, error: err?.message || "Network error" };
  }
}

// Download a preview PDF from the backend bouncer endpoint:
// GET /api/books/download?type=preview  (free tier)
// GET /api/books/download?type=full     (requires isPaid)
// Returns { ok: false, status: 401|403 } → trigger paywall modal.

export async function downloadBook(type: "preview" | "full", filename = "mucamanza-book.pdf") {
  const res = await fetch(`/api/books/download?type=${type}`, {
    credentials: "include",
  });
  if (!res.ok) {
    return { ok: false as const, status: res.status };
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { ok: true as const };
}
