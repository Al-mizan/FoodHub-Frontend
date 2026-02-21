import { cookies } from "next/headers";

export const userService = {
    getSession: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch("/api/auth/get-session", {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                method: "GET",
                credentials: "include",
                cache: "no-store",
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