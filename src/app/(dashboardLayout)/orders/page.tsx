"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ordersClientService } from "@/services/orders-client.service";
import { reviewsClientService } from "@/services/reviews-client.service";
import type { Order, OrderStatus } from "@/types/order.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Package,
    ChefHat,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    Star,
    Loader2,
    ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/* ── Status helpers ── */
const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
    { key: "PENDING", label: "Order Placed", icon: Package },
    { key: "PREPARING", label: "Preparing", icon: ChefHat },
    { key: "ON_THE_WAY", label: "Out for Delivery", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    PREPARING: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    ON_THE_WAY: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    DELIVERED: "bg-green-500/10 text-green-600 border-green-500/30",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
};

function getStepIndex(status: OrderStatus): number {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx === -1 ? -1 : idx;
}

/* ── Order Timeline ── */
function OrderTimeline({ status }: { status: OrderStatus }) {
    if (status === "CANCELLED") {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                <XCircle className="size-5 text-red-500" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Order Cancelled
                </span>
            </div>
        );
    }

    const currentIdx = getStepIndex(status);

    return (
        <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                    <div key={step.key} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`flex size-9 items-center justify-center rounded-full border-2 transition-all ${
                                    isCompleted
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/30 bg-background text-muted-foreground/40"
                                } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
                            >
                                <Icon className="size-4" />
                            </div>
                            <span
                                className={`text-xs font-medium ${
                                    isCompleted ? "text-foreground" : "text-muted-foreground/50"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                            <div
                                className={`mx-1 h-0.5 w-8 sm:w-12 ${
                                    idx < currentIdx ? "bg-primary" : "bg-muted-foreground/20"
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ── Star Rating Input ── */
function StarRating({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(star)}
                >
                    <Star
                        className={`size-6 ${
                            star <= (hover || value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

/* ── Review Dialog ── */
function ReviewDialog({
    open,
    onOpenChange,
    orderId,
    mealId,
    mealName,
    onReviewSubmitted,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    orderId: string;
    mealId: string;
    mealName: string;
    onReviewSubmitted: () => void;
}) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewsClientService.createReview({
                meal_id: mealId,
                order_id: orderId,
                rating,
                comment: comment.trim() || undefined,
            });
            toast.success("Review submitted successfully!");
            onOpenChange(false);
            setRating(0);
            setComment("");
            onReviewSubmitted();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Review {mealName}</DialogTitle>
                    <DialogDescription>
                        Share your experience with this meal.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <StarRating value={rating} onChange={setRating} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="review-comment">Comment (optional)</Label>
                        <Textarea
                            id="review-comment"
                            placeholder="Tell us about your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
                        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ── Order Card ── */
function OrderCard({
    order,
    onRefresh,
}: {
    order: Order;
    onRefresh: () => void;
}) {
    const [reviewItem, setReviewItem] = useState<{
        mealId: string;
        mealName: string;
    } | null>(null);

    const reviewedMeals = new Set(order.reviews?.map((r) => r.meal_id) ?? []);
    const restaurantName =
        order.provider?.providerProfile?.restaurant_name ?? order.provider?.name ?? "Restaurant";

    return (
        <div className="rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{restaurantName}</h3>
                        <Badge variant="outline" className={STATUS_COLORS[order.status]}>
                            {order.status === "ON_THE_WAY" ? "Out for Delivery" : order.status}
                        </Badge>
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
                    ৳{order.total_amount.toFixed(2)}
                </p>
            </div>

            {/* Timeline */}
            <div className="overflow-x-auto p-4">
                <OrderTimeline status={order.status} />
            </div>

            <Separator />

            {/* Items */}
            <div className="p-4">
                <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                    Order Items
                </h4>
                <div className="space-y-3">
                    {order.orderItems.map((item) => {
                        const hasReview = reviewedMeals.has(item.meal_id);
                        return (
                            <div
                                key={item.id}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={item.meal.image_url || "/placeholder.png"}
                                    alt={item.meal.name}
                                    className="size-12 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {item.meal.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.quantity} x ৳{item.unit_price.toFixed(2)}
                                    </p>
                                </div>
                                <p className="shrink-0 text-sm font-medium tabular-nums">
                                    ৳{item.sub_total_amount.toFixed(2)}
                                </p>
                                {order.status === "DELIVERED" && !hasReview && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="shrink-0"
                                        onClick={() =>
                                            setReviewItem({
                                                mealId: item.meal_id,
                                                mealName: item.meal.name,
                                            })
                                        }
                                    >
                                        <Star className="mr-1 size-3" /> Review
                                    </Button>
                                )}
                                {hasReview && (
                                    <Badge variant="secondary" className="shrink-0">
                                        <Star className="mr-1 size-3 fill-yellow-400 text-yellow-400" />
                                        Reviewed
                                    </Badge>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Delivery address */}
            <div className="border-t px-4 py-3">
                <p className="text-xs text-muted-foreground">
                    <strong>Delivery:</strong> {order.delivery_address}
                </p>
            </div>

            {/* Review dialog */}
            {reviewItem && (
                <ReviewDialog
                    open={!!reviewItem}
                    onOpenChange={(v) => !v && setReviewItem(null)}
                    orderId={order.id}
                    mealId={reviewItem.mealId}
                    mealName={reviewItem.mealName}
                    onReviewSubmitted={onRefresh}
                />
            )}
        </div>
    );
}

/* ── Page ── */
export default function OrdersPage() {
    const { user, isPending } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setError(null);
            const data = await ordersClientService.getMyOrders();
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isPending && user) {
            fetchOrders();
        } else if (!isPending && !user) {
            setLoading(false);
        }
    }, [isPending, user, fetchOrders]);

    // Auto-refresh active orders every 30s
    useEffect(() => {
        const hasActive = orders.some(
            (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
        );
        if (!hasActive) return;

        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [orders, fetchOrders]);

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
                <p className="text-muted-foreground">Please log in to view your orders.</p>
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
                <p className="text-muted-foreground">
                    Track your orders and leave reviews for delivered meals.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                    <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchOrders}>
                        Retry
                    </Button>
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                    <ShoppingBag className="mb-4 size-12 text-muted-foreground/40" />
                    <h2 className="mb-2 text-lg font-semibold">No orders yet</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Start by adding meals to your cart.
                    </p>
                    <Button asChild>
                        <Link href="/">Browse Menu</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} onRefresh={fetchOrders} />
                    ))}
                </div>
            )}
        </div>
    );
}
