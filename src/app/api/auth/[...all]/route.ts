import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_AUTH_URL = env.BACKEND_API;

async function handler(req: NextRequest) {
    const url = new URL(req.url);
    // Forward the path after /api/auth to the backend
    const pathAfterAuth = url.pathname; // e.g., /api/auth/get-session
    const targetUrl = `${BACKEND_AUTH_URL}${pathAfterAuth}${url.search}`;

    const headers = new Headers(req.headers);
    // Remove host header so backend gets its own host
    headers.delete("host");

    const fetchOptions: RequestInit = {
        method: req.method,
        headers,
        // @ts-expect-error - duplex is needed for streaming request bodies
        duplex: "half",
    };

    // Forward body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
        fetchOptions.body = req.body;
    }

    try {
        const response = await fetch(targetUrl, fetchOptions);

        const responseHeaders = new Headers(response.headers);

        // Fix Set-Cookie domain - remove backend domain so cookie is set on frontend domain
        const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
        if (setCookieHeaders.length > 0) {
            responseHeaders.delete("set-cookie");
            for (const cookie of setCookieHeaders) {
                // Remove Domain attribute so it defaults to the frontend domain
                const fixedCookie = cookie
                    .replace(/;\s*Domain=[^;]*/gi, "")
                    .replace(/;\s*SameSite=[^;]*/gi, "; SameSite=Lax");
                responseHeaders.append("set-cookie", fixedCookie);
            }
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
