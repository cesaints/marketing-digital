import crypto from "crypto";

const COOKIE_NAME = "md_session";

function b64url(input: Buffer | string) {
    const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
    return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlDecode(input: string) {
    const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
    const s = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
    return Buffer.from(s, "base64");
}

export function signSession(payload: object, secret: string) {
    const data = b64url(JSON.stringify(payload));
    const sig = b64url(
        crypto.createHmac("sha256", secret).update(data).digest()
    );
    return `${data}.${sig}`;
}

export function verifySession(token: string, secret: string) {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [data, sig] = parts;

    const expected = b64url(
        crypto.createHmac("sha256", secret).update(data).digest()
    );

    // timing-safe compare
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    try {
        const json = b64urlDecode(data).toString("utf8");
        return JSON.parse(json) as any;
    } catch {
        return null;
    }
}

export { COOKIE_NAME };
