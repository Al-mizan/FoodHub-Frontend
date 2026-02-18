import { env } from "@/env";
import { AdminCategory, AdminOrder, AdminUser } from "@/types";

const API_URL = env.NEXT_PUBLIC_API_URL;

async function adminFetch<T = unknown>(url: string, opts: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...opts.headers },
        ...opts,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Request failed");
    }
    return json.data;
}


export const adminClientService = {
    getUsers: () => adminFetch<AdminUser[]>(`${API_URL}/api/admin/users`),

    updateUser: (id: string, data: { status?: string }) =>
        adminFetch<AdminUser>(`${API_URL}/api/admin/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    getOrders: () => adminFetch<AdminOrder[]>(`${API_URL}/api/admin/orders`),

    getCategories: () => adminFetch<AdminCategory[]>(`${API_URL}/api/categories`),

    createCategory: (data: { name: string; slug: string; icon_url?: string }) =>
        adminFetch<AdminCategory>(`${API_URL}/api/categories`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateCategory: (id: string, data: { name?: string; slug?: string; icon_url?: string; is_active?: boolean }) =>
        adminFetch<AdminCategory>(`${API_URL}/api/categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
};
