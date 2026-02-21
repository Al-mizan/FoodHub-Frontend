import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
    server: {
        BACKEND_API: z.url(),
        FRONTEND_API: z.url(),
        API_URL: z.url(),
    },
    client: {
        NEXT_PUBLIC_BACKEND_API: z.url(),
        NEXT_PUBLIC_API_URL: z.url(),
        // NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production", "test"]), it has buildin feature
    },
    runtimeEnv: {
        BACKEND_API: process.env.BACKEND_API,
        FRONTEND_API: process.env.FRONTEND_API,
        API_URL: process.env.API_URL,
        NEXT_PUBLIC_BACKEND_API: process.env.NEXT_PUBLIC_BACKEND_API,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        // NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    },
});