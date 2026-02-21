import { NextRequest, NextResponse } from "next/server";

/**
 * General API proxy — forwards all /api/* requests (except /api/auth/*)
 * to the backend, including cookies. This ensures the session cookie
 * (set on the frontend domain) is forwarded to the backend for auth.
 *
 * Next.js App Router gives precedence to /api/auth/[...all] over this
 * catch-all, so auth routes are handled by the dedicated auth proxy.
 */

function getBackendUrl() {
    const url = process.env.NEXT_PUBLIC_BACKEND_API || process.env.BACKEND_API;
    if (!url) throw new Error("NEXT_PUBLIC_BACKEND_API is not set");
    return url.replace(/\/+$/, "");
}

async function handler(req: NextRequest) {
    const backendUrl = getBackendUrl();
    const url = new URL(req.url);
    const targetUrl = `${backendUrl}${url.pathname}${url.search}`;

    const forwardHeaders = new Headers();
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) forwardHeaders.set("cookie", cookieHeader);
    const contentType = req.headers.get("content-type");
    if (contentType) forwardHeaders.set("content-type", contentType);
    forwardHeaders.set("accept", req.headers.get("accept") ?? "application/json");

    const fetchOptions: RequestInit = {
        method: req.method,
        headers: forwardHeaders,
        redirect: "manual",
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
        fetchOptions.body = await req.text();
    }

    try {
        const response = await fetch(targetUrl, fetchOptions);

        const responseHeaders = new Headers();

        const resContentType = response.headers.get("content-type");
        if (resContentType) responseHeaders.set("content-type", resContentType);

        const location = response.headers.get("location");
        if (location) responseHeaders.set("location", location);

        // Forward Set-Cookie headers, fixing domain
        const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
        for (const cookie of setCookieHeaders) {
            const fixedCookie = cookie
                .replace(/;\s*Domain=[^;]*/gi, "")
                .replace(/;\s*SameSite=[^;]*/gi, "; SameSite=Lax");
            responseHeaders.append("set-cookie", fixedCookie);
        }

        const body = await response.arrayBuffer();

        return new NextResponse(body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("API proxy error:", error);
        return NextResponse.json(
            { error: "API proxy failed" },
            { status: 502 }
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
