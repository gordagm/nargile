// Edge + Node uyumlu basit imzalı çerez oturumu (Web Crypto).
export const COOKIE_NAME = "np_session";
const DAY_MS = 86_400_000;

function toB64Url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toB64Url(new Uint8Array(sig));
}

export async function createSessionToken(secret: string, ttlMs = 30 * DAY_MS): Promise<string> {
  const exp = String(Date.now() + ttlMs);
  const sig = await sign(exp, secret);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = await sign(exp, secret);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export function getSecret(): string {
  return process.env.COOKIE_SECRET || process.env.ADMIN_PASSWORD || "dev-insecure-secret-change-me";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}
