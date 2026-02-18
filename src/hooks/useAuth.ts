"use client";

import { authClient } from "@/lib/auth-client";
import { AuthUser } from "@/types";


export function useAuth() {
    const { data: session, isPending, error } = authClient.useSession();
    
    const user = (session?.user as AuthUser | undefined) ?? null;
    const isAuthenticated = !!user;
    
    return {
        user,
        session,
        isAuthenticated,
        isPending,
        error,
    };
}
