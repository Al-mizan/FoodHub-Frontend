import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "/api/auth",   // ✅ ALWAYS RELATIVE
    fetchOptions: {
        credentials: "include", // ✅ send cookies
    },
});