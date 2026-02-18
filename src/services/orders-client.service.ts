import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const ordersClientService = {
    getMyOrders: async () => {
        const res = await fetch(`${API_URL}/api/orders`, {
            credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to fetch orders");
        return json.data;
    },

    getOrderById: async (orderId: string) => {
        const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
            credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to fetch order");
        return json.data;
    },

    placeOrder: async (providerId: string, deliveryAddress: string) => {
        const res = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                provider_id: providerId,
                delivery_address: deliveryAddress,
            }),
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to place order");
        return json.data;
    },

    getProviderOrders: async () => {
        const res = await fetch(`${API_URL}/api/orders/provider`, {
            credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to fetch provider orders");
        return json.data;
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        const res = await fetch(`${API_URL}/api/providers/orders/${orderId}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        const json = await res.json();
        if (!res.ok || !json.success)
            throw new Error(json.error || json.message || "Failed to update status");
        return json.data;
    },
};
