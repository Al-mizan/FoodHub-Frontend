export interface AuthUser {
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