import { env } from "@/env"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /**
     * Point to the frontend itself — requests go to /api/auth/*
     * which is proxied to the backend. This keeps session cookies
     * on the same domain so they are sent with every request.
     */
    baseURL: env.NEXT_PUBLIC_FRONTEND_API,
})