import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
    server: {
        BACKEND_API: z.url().optional(),
    },
    client: {
        NEXT_PUBLIC_BACKEND_API: z.url(),
        NEXT_PUBLIC_API_URL: z.url(),
        NEXT_PUBLIC_APP_URL: z.url(),
    },
    runtimeEnv: {
        BACKEND_API: process.env.BACKEND_API,
        NEXT_PUBLIC_BACKEND_API: process.env.NEXT_PUBLIC_BACKEND_API,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
});