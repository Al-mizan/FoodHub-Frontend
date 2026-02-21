import { NextRequest, NextResponse } from "next/server";

function getBackendUrl() {
    // Prefer server-only env var; fall back to NEXT_PUBLIC_ variant
    // const url = process.env.BACKEND_API || process.env.NEXT_PUBLIC_BACKEND_API;
    const url =
        process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_API
            : process.env.BACKEND_API;
    if (!url) throw new Error("BACKEND_API (or NEXT_PUBLIC_BACKEND_API) is not set");
    return url.replace(/\/+$/, ""); // remove trailing slash
}

async function handler(req: NextRequest) {
    const backendUrl = getBackendUrl();
    const url = new URL(req.url);
    // Forward the path after /api/auth to the backend
    const pathAfterAuth = url.pathname; // e.g., /api/auth/get-session
    const targetUrl = `${backendUrl}${pathAfterAuth}${url.search}`;

    // Only forward safe headers — avoid accept-encoding, host, etc.
    const forwardHeaders = new Headers();
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) forwardHeaders.set("cookie", cookieHeader);
    const contentType = req.headers.get("content-type");
    if (contentType) forwardHeaders.set("content-type", contentType);
    forwardHeaders.set("accept", req.headers.get("accept") ?? "application/json");
    // better-auth requires Origin header for CSRF / trusted origins
    const requestOrigin = req.headers.get("origin") ?? url.origin;
    forwardHeaders.set("origin", requestOrigin);

    const fetchOptions: RequestInit = {
        method: req.method,
        headers: forwardHeaders,
        // CRITICAL: prevent fetch from following redirects so we can forward
        // the raw 302 + Set-Cookie headers back to the browser
        redirect: "manual",
    };

    // Forward body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
        fetchOptions.body = await req.text();
    }

    try {
        const response = await fetch(targetUrl, fetchOptions);

        const responseHeaders = new Headers();

        // Copy content-type
        const resContentType = response.headers.get("content-type");
        if (resContentType) responseHeaders.set("content-type", resContentType);

        // Forward Location header for redirects (OAuth flow needs this)
        const location = response.headers.get("location");
        if (location) responseHeaders.set("location", location);

        // Fix Set-Cookie domain — remove backend domain so cookie is set on frontend domain
        const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
        for (const cookie of setCookieHeaders) {
            // Remove Domain attribute so it defaults to the frontend domain
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
        console.error("Auth proxy error:", error);
        return NextResponse.json(
            { error: "Auth proxy failed" },
            { status: 502 }
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
