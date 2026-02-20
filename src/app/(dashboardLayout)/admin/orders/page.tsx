"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminClientService } from "@/services/admin-client.service";
import type { AdminOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    ChefHat,
    Truck,
    CheckCircle2,
    XCircle,
    Loader2,
    Shield,
    User,
    MapPin,
    Clock,
    Store,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";

type OrderStatus = "PENDING" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";

const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    PREPARING: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    ON_THE_WAY: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    DELIVERED: "bg-green-500/10 text-green-600 border-green-500/30",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
};

const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
    PENDING: Package,
    PREPARING: ChefHat,
    ON_THE_WAY: Truck,
    DELIVERED: CheckCircle2,
    CANCELLED: XCircle,
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "Pending",
    PREPARING: "Preparing",
    ON_THE_WAY: "On the Way",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

function OrderCard({ order }: { order: AdminOrder }) {
    const StatusIcon = STATUS_ICONS[order.status as OrderStatus] || Package;
    const restaurantName =
        order.provider?.providerProfile?.restaurant_name || order.provider?.name || "Unknown";

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusIcon className="size-4" />
                        <Badge variant="outline" className={STATUS_COLORS[order.status as OrderStatus] || ""}>
                            {STATUS_LABELS[order.status as OrderStatus] || order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            #{order.id.slice(-8).toUpperCase()}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        <Clock className="mr-1 inline size-3" />
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <p className="text-lg font-bold tabular-nums">
                    &#2547;{order.total_amount.toFixed(2)}
                </p>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-3">
                <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground">Customer</h4>
                    <p className="flex items-center gap-1 text-sm">
                        <User className="size-3" />
                        {order.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.user.email}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {order.delivery_address}
                    </p>
                </div>

                <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground">Restaurant</h4>
                    <p className="flex items-center gap-1 text-sm">
                        <Store className="size-3" />
                        {restaurantName}
                    </p>
                    <Badge variant="outline" className="text-xs">
                        {order.payment_status}
                    </Badge>
                </div>

                <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground">
                        Items ({order.orderItems.length})
                    </h4>
                    <div className="space-y-1">
                        {order.orderItems.slice(0, 3).map((item) => (
                            <p key={item.id} className="text-xs">
                                {item.meal.name} x{item.quantity}
                            </p>
                        ))}
                        {order.orderItems.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                                +{order.orderItems.length - 3} more
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminOrdersPage() {
    const { user, isPending } = useAuth();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("ALL");

    const fetchOrders = useCallback(async () => {
        try {
            setError(null);
            const data = await adminClientService.getOrders();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isPending && user && user.role === "ADMIN") {
            fetchOrders();
        } else if (!isPending) {
            setLoading(false);
        }
    }, [isPending, user, fetchOrders]);

    const filteredOrders =
        filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

    const statusCounts = orders.reduce(
        (acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    if (isPending || loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <Shield className="size-12 text-muted-foreground/40" />
                <h2 className="text-lg font-semibold">Admin Access Required</h2>
                <Button asChild>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">All Orders</h1>
                    <p className="text-muted-foreground">
                        {orders.length} order{orders.length !== 1 && "s"} total
                    </p>
                </div>
                <Button variant="outline" onClick={fetchOrders}>
                    <RefreshCw className="mr-2 size-4" />
                    Refresh
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                <Button
                    variant={filter === "ALL" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("ALL")}
                >
                    All ({orders.length})
                </Button>
                {(["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED", "CANCELLED"] as OrderStatus[]).map(
                    (status) => (
                        <Button
                            key={status}
                            variant={filter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(status)}
                        >
                            {STATUS_LABELS[status]} ({statusCounts[status] || 0})
                        </Button>
                    )
                )}
            </div>

            <Separator />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                    <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchOrders}>
                        Retry
                    </Button>
                </div>
            )}

            {filteredOrders.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                    <Package className="mb-4 size-12 text-muted-foreground/40" />
                    <h2 className="mb-2 text-lg font-semibold">No orders found</h2>
                    <p className="text-sm text-muted-foreground">
                        {filter !== "ALL"
                            ? `No ${STATUS_LABELS[filter as OrderStatus]?.toLowerCase()} orders.`
                            : "No orders have been placed yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}
