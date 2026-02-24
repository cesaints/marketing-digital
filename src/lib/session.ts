export const COOKIE_NAME = "md_session";

function b64urlFromBytes(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const base64 = btoa(bin);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function bytesFromB64url(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlFromString(s: string) {
  return b64urlFromBytes(new TextEncoder().encode(s));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmacSha256B64Url(data: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );

  return b64urlFromBytes(new Uint8Array(sig));
}

export async function signSession(payload: object, secret: string) {
  const data = b64urlFromString(JSON.stringify(payload));
  const sig = await hmacSha256B64Url(data, secret);
  return `${data}.${sig}`;
}

export async function verifySession(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [data, sig] = parts;

  const expected = await hmacSha256B64Url(data, secret);
  const a = new TextEncoder().encode(sig);
  const b = new TextEncoder().encode(expected);

  if (!timingSafeEqual(a, b)) return null;

  try {
    const json = new TextDecoder().decode(bytesFromB64url(data));
    return JSON.parse(json) as any;
  } catch {
    return null;
  }
}
