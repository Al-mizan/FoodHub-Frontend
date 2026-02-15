import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export const userService = {
    getSession: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString(),
                    cache: "no-store",
                },
            });
            const session = await res.json();
            if (session === null) {
                return {
                    data: null,
                    error: { message: "No active session" },
                }
            }
            return {
                data: session,
                error: null,
            }
        } catch (error) {
            console.error(error);
            return {
                data: null,
                error: { message: "Failed to fetch session" },
                details: error instanceof Error ? error.message : String(error),
            }
        }
    }
}