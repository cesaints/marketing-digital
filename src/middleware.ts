import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/sessions";

const PROTECTED = ["/dashboard", "/produtos", "/simulador"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!needsAuth) return NextResponse.next();

    const token = req.cookies.get(COOKIE_NAME)?.value;
    const secret = process.env.SESSION_SECRET ?? "";
    if (!token || !secret) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    const session = verifySession(token, secret);
    if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/produtos/:path*", "/simulador/:path*"],
};
