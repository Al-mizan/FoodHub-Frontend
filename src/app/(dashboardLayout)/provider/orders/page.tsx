"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ordersClientService } from "@/services/orders-client.service";
import type { ProviderOrder, OrderStatus } from "@/types/order.type";
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
    Clock,
    Loader2,
    User,
    MapPin,
    RefreshCw,
    Store,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/* ── Status config ── */
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

const NEXT_STATUS: Record<string, { value: OrderStatus; label: string }[]> = {
    PENDING: [
        { value: "PREPARING", label: "Start Preparing" },
        { value: "CANCELLED", label: "Cancel Order" },
    ],
    PREPARING: [
        { value: "ON_THE_WAY", label: "Out for Delivery" },
        { value: "CANCELLED", label: "Cancel Order" },
    ],
    ON_THE_WAY: [{ value: "DELIVERED", label: "Mark Delivered" }],
    DELIVERED: [],
    CANCELLED: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "Pending",
    PREPARING: "Preparing",
    ON_THE_WAY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

/* ── Provider Order Card ── */
function ProviderOrderCard({
    order,
    onStatusUpdate,
}: {
    order: ProviderOrder;
    onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}) {
    const [isUpdating, setIsUpdating] = useState(false);
    const actions = NEXT_STATUS[order.status] || [];
    const StatusIcon = STATUS_ICONS[order.status];

    const handleChange = async (status: string) => {
        setIsUpdating(true);
        try {
            await ordersClientService.updateOrderStatus(order.id, status);
            toast.success(`Order status updated to ${STATUS_LABELS[status as OrderStatus]}`);
            onStatusUpdate(order.id, status as OrderStatus);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <StatusIcon className="size-4" />
                        <Badge variant="outline" className={STATUS_COLORS[order.status]}>
                            {STATUS_LABELS[order.status]}
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
                <div className="flex items-center gap-3">
                    <p className="text-lg font-bold tabular-nums">
                        ৳{order.total_amount.toFixed(2)}
                    </p>
                    {actions.length > 0 && (
                        <Select onValueChange={handleChange} disabled={isUpdating}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {actions.map((action) => (
                                    <SelectItem key={action.value} value={action.value}>
                                        {action.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {isUpdating && <Loader2 className="size-4 animate-spin" />}
                </div>
            </div>

            {/* Customer info + Items */}
            <div className="grid gap-4 p-4 sm:grid-cols-2">
                {/* Customer */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                    <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-1.5">
                            <User className="size-3.5" />
                            {order.user.name}
                        </p>
                        {order.user.phone && (
                            <p className="text-muted-foreground">{order.user.phone}</p>
                        )}
                        <p className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="size-3.5" />
                            {order.delivery_address}
                        </p>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
                    <div className="space-y-1.5">
                        {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 text-sm">
                                <img
                                    src={item.meal.image_url || "/placeholder.png"}
                                    alt={item.meal.name}
                                    className="size-8 rounded object-cover"
                                />
                                <span className="flex-1 truncate">{item.meal.name}</span>
                                <span className="text-muted-foreground">x{item.quantity}</span>
                                <span className="tabular-nums">৳{item.sub_total_amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Page ── */
export default function ProviderOrdersPage() {
    const { user, isPending } = useAuth();
    const [orders, setOrders] = useState<ProviderOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

    const fetchOrders = useCallback(async () => {
        try {
            setError(null);
            const data = await ordersClientService.getProviderOrders();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isPending && user && user.role === "PROVIDER") {
            fetchOrders();
        } else if (!isPending) {
            setLoading(false);
        }
    }, [isPending, user, fetchOrders]);

    // Auto-refresh every 30s
    useEffect(() => {
        const hasActive = orders.some(
            (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
        );
        if (!hasActive) return;
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [orders, fetchOrders]);

    const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
    };

    const filteredOrders =
        filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

    if (isPending || loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Please log in first.</p>
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    if (user.role !== "PROVIDER") {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <Store className="size-12 text-muted-foreground/40" />
                <h2 className="text-lg font-semibold">Provider Access Required</h2>
                <p className="text-sm text-muted-foreground">
                    You need a provider profile to manage orders.
                </p>
                <Button asChild>
                    <Link href="/provider-profile/create">Become a Provider</Link>
                </Button>
            </div>
        );
    }

    const statusCounts = orders.reduce(
        (acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Incoming Orders</h1>
                    <p className="text-muted-foreground">
                        {orders.length} order{orders.length !== 1 && "s"} total
                    </p>
                </div>
                <Button variant="outline" onClick={fetchOrders}>
                    <RefreshCw className="mr-2 size-4" />
                    Refresh
                </Button>
            </div>

            {/* Status filter */}
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
                    <h2 className="mb-2 text-lg font-semibold">
                        {filter === "ALL" ? "No orders yet" : `No ${STATUS_LABELS[filter as OrderStatus].toLowerCase()} orders`}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Orders will appear here when customers place them.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <ProviderOrderCard
                            key={order.id}
                            order={order}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
