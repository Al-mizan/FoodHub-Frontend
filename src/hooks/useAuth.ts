"use client";

import { authClient } from "@/lib/auth-client";

export function useAuth() {
    const { data: session, isPending, error } = authClient.useSession();
    
    const user = session?.user ?? null;
    const isAuthenticated = !!user;
    
    return {
        user,
        session,
        isAuthenticated,
        isPending,
        error,
    };
}
