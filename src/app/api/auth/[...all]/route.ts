import { NextRequest, NextResponse } from "next/server";

function getBackendUrl() {
    // Use NEXT_PUBLIC_BACKEND_API since server-only BACKEND_API may point to localhost
    const url = process.env.NEXT_PUBLIC_BACKEND_API;
    if (!url) throw new Error("NEXT_PUBLIC_BACKEND_API is not set");
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
    forwardHeaders.set("accept", "application/json");

    const fetchOptions: RequestInit = {
        method: req.method,
        headers: forwardHeaders,
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

        // Fix Set-Cookie domain - remove backend domain so cookie is set on frontend domain
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
