"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { providerClientService } from "@/services/provider-client.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ChefHat,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Star,
    DollarSign,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Meal {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    discount_price?: number | null;
    image_url?: string | null;
    is_available: boolean;
    rating_sum: number;
    rating_count: number;
    category_id?: string | null;
    category?: { id: string; name: string } | null;
}

/* ── Meal Form Dialog ── */
function MealFormDialog({
    open,
    onOpenChange,
    meal,
    providerId,
    onSuccess,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    meal?: Meal | null;
    providerId: string;
    onSuccess: () => void;
}) {
    const isEdit = !!meal;
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discount_price: "",
        image_url: "",
        is_available: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (meal) {
            setFormData({
                name: meal.name || "",
                description: meal.description || "",
                price: String(meal.price || ""),
                discount_price: meal.discount_price ? String(meal.discount_price) : "",
                image_url: meal.image_url || "",
                is_available: meal.is_available,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                discount_price: "",
                image_url: "",
                is_available: true,
            });
        }
    }, [meal, open]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Meal name is required");
            return;
        }
        if (!formData.price || Number(formData.price) <= 0) {
            toast.error("Valid price is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: Record<string, unknown> = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                price: Number(formData.price),
                image_url: formData.image_url.trim() || undefined,
                is_available: formData.is_available,
            };
            if (formData.discount_price) {
                payload.discount_price = Number(formData.discount_price);
            }

            if (isEdit) {
                await providerClientService.updateMeal(providerId, meal!.id, payload);
                toast.success("Meal updated successfully!");
            } else {
                await providerClientService.createMeal(providerId, payload as Parameters<typeof providerClientService.createMeal>[1]);
                toast.success("Meal created successfully!");
            }

            onOpenChange(false);
            onSuccess();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Meal" : "Add New Meal"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the meal details below."
                            : "Fill in the details to add a new meal."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="meal-name">Meal Name *</Label>
                        <Input
                            id="meal-name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="e.g. Chicken Biryani"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="meal-desc">Description</Label>
                        <Textarea
                            id="meal-desc"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Describe the meal..."
                            rows={2}
                        />
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="meal-price">Price (৳) *</Label>
                            <Input
                                id="meal-price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meal-discount">Discount Price (৳)</Label>
                            <Input
                                id="meal-discount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.discount_price}
                                onChange={(e) => handleChange("discount_price", e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="meal-image">Image URL</Label>
                        <Input
                            id="meal-image"
                            value={formData.image_url}
                            onChange={(e) => handleChange("image_url", e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="meal-available"
                            checked={formData.is_available}
                            onChange={(e) => handleChange("is_available", e.target.checked)}
                            className="size-4 rounded border"
                        />
                        <Label htmlFor="meal-available">Available for ordering</Label>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                            {isEdit ? "Update Meal" : "Create Meal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/* ── Delete Confirmation Dialog ── */
function DeleteDialog({
    open,
    onOpenChange,
    mealName,
    onConfirm,
    isDeleting,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    mealName: string;
    onConfirm: () => void;
    isDeleting: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="size-5" />
                        Delete Meal
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{mealName}</strong>? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ── Meal Card ── */
function MealCard({
    meal,
    onEdit,
    onDelete,
}: {
    meal: Meal;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const avgRating =
        meal.rating_count > 0
            ? (meal.rating_sum / meal.rating_count).toFixed(1)
            : null;

    return (
        <div className="flex gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
            <img
                src={meal.image_url || "/placeholder.png"}
                alt={meal.name}
                className="size-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-semibold">{meal.name}</h3>
                        {meal.description && (
                            <p className="line-clamp-1 text-sm text-muted-foreground">
                                {meal.description}
                            </p>
                        )}
                    </div>
                    <Badge variant={meal.is_available ? "default" : "secondary"}>
                        {meal.is_available ? "Available" : "Unavailable"}
                    </Badge>
                </div>
                <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center text-sm font-semibold">
                        <DollarSign className="mr-0.5 size-3" />
                        ৳{meal.price.toFixed(2)}
                    </span>
                    {meal.discount_price && (
                        <span className="text-xs text-green-600">
                            Sale: ৳{meal.discount_price.toFixed(2)}
                        </span>
                    )}
                    {avgRating && (
                        <span className="flex items-center gap-0.5 text-sm text-muted-foreground">
                            <Star className="size-3 fill-yellow-400 text-yellow-400" />
                            {avgRating} ({meal.rating_count})
                        </span>
                    )}
                    {meal.category && (
                        <Badge variant="outline" className="text-xs">
                            {meal.category.name}
                        </Badge>
                    )}
                </div>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Pencil className="size-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={onDelete}
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
    );
}

/* ── Page ── */
export default function ProviderMealsPage() {
    const { user, isPending } = useAuth();
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog states
    const [formOpen, setFormOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const providerId = user?.id ?? "";

    const fetchMeals = useCallback(async () => {
        if (!providerId) return;
        try {
            setError(null);
            const result = await providerClientService.getMyMeals(providerId);
            setMeals(result.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load meals");
        } finally {
            setLoading(false);
        }
    }, [providerId]);

    useEffect(() => {
        if (!isPending && user && user.role === "PROVIDER") {
            fetchMeals();
        } else if (!isPending) {
            setLoading(false);
        }
    }, [isPending, user, fetchMeals]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await providerClientService.deleteMeal(providerId, deleteTarget.id);
            toast.success("Meal deleted successfully!");
            setDeleteTarget(null);
            fetchMeals();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete meal");
        } finally {
            setIsDeleting(false);
        }
    };

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
                <ChefHat className="size-12 text-muted-foreground/40" />
                <h2 className="text-lg font-semibold">Provider Access Required</h2>
                <p className="text-sm text-muted-foreground">
                    You need a provider profile to manage meals.
                </p>
                <Button asChild>
                    <Link href="/provider-profile/create">Become a Provider</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">My Meals</h1>
                    <p className="text-muted-foreground">
                        Manage your restaurant menu. {meals.length} meal{meals.length !== 1 && "s"}.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingMeal(null);
                        setFormOpen(true);
                    }}
                >
                    <Plus className="mr-2 size-4" />
                    Add Meal
                </Button>
            </div>

            <Separator />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                    <Button variant="link" className="ml-2 h-auto p-0" onClick={fetchMeals}>
                        Retry
                    </Button>
                </div>
            )}

            {meals.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                    <ChefHat className="mb-4 size-12 text-muted-foreground/40" />
                    <h2 className="mb-2 text-lg font-semibold">No meals yet</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Add your first meal to start receiving orders.
                    </p>
                    <Button
                        onClick={() => {
                            setEditingMeal(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" />
                        Add First Meal
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {meals.map((meal) => (
                        <MealCard
                            key={meal.id}
                            meal={meal}
                            onEdit={() => {
                                setEditingMeal(meal);
                                setFormOpen(true);
                            }}
                            onDelete={() => setDeleteTarget(meal)}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <MealFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                meal={editingMeal}
                providerId={providerId}
                onSuccess={fetchMeals}
            />

            {/* Delete Confirmation */}
            {deleteTarget && (
                <DeleteDialog
                    open={!!deleteTarget}
                    onOpenChange={(v) => !v && setDeleteTarget(null)}
                    mealName={deleteTarget.name}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
