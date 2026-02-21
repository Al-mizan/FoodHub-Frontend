import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

const appURL =
    env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const baseURL =
    typeof window === "undefined"
        ? `${appURL}/api/auth`   // used during SSR/build
        : "/api/auth";           // used in browser (goes through proxy)

export const authClient = createAuthClient({
    baseURL,
    fetchOptions: {
        credentials: "include",
    },
});