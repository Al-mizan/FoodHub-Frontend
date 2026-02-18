"use client";

import { authClient } from "@/lib/auth-client";

type AuthUser = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role?: string;
    phone?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

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
