"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChefHat,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Star,
    DollarSign,
    AlertTriangle,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { env } from "@/env";
import { Category, Meal } from "@/types";
import Image from "next/image";

const API_URL = env.NEXT_PUBLIC_API_URL;


/* ── Fetch categories for dropdown ── */
async function fetchCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/api/categories`, {
            credentials: "include",
        });
        const json = await res.json();
        if (res.ok && json.success) return json.data ?? [];
    } catch {
        /* ignore */
    }
    return [];
}

/* ── Meal form default values from meal or empty ── */
function getMealFormDefaults(meal?: Meal | null) {
    if (meal) {
        return {
            name: meal.name || "",
            description: meal.description || "",
            price: String(meal.price ?? ""),
            discount_price: meal.discount_price != null ? String(meal.discount_price) : "",
            discount_percentage: meal.discount_percentage != null ? String(meal.discount_percentage) : "",
            image_url: meal.image_url || "",
            category_id: meal.category_id || "",
            preparation_time: meal.preparation_time != null ? String(meal.preparation_time) : "",
            is_available: meal.is_available,
        };
    }
    return {
        name: "",
        description: "",
        price: "",
        discount_price: "",
        discount_percentage: "",
        image_url: "",
        category_id: "",
        preparation_time: "",
        is_available: true,
    };
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
    const [categories, setCategories] = useState<Category[]>([]);

    // Load categories when dialog opens
    useEffect(() => {
        if (open) {
            fetchCategories().then(setCategories);
        }
    }, [open]);

    const form = useForm({
        formId: open ? (meal?.id ?? "new") : "closed",
        defaultValues: getMealFormDefaults(meal),
        onSubmit: async ({ value }) => {
            if (!value.name.trim()) {
                toast.error("Meal name is required");
                return;
            }
            if (!value.price || Number(value.price) <= 0) {
                toast.error("Valid price is required");
                return;
            }
            if (!value.category_id) {
                toast.error("Please select a category");
                return;
            }
            if (!value.preparation_time || Number(value.preparation_time) <= 0) {
                toast.error("Preparation time is required");
                return;
            }

            const payload: Record<string, unknown> = {
                name: value.name.trim(),
                description: value.description.trim() || undefined,
                price: Number(value.price),
                image_url: value.image_url.trim() || undefined,
                category_id: value.category_id,
                preparation_time: Number(value.preparation_time),
                is_available: value.is_available,
            };
            if (value.discount_price) {
                payload.discount_price = Number(value.discount_price);
            }
            if (value.discount_percentage) {
                payload.discount_percentage = Number(value.discount_percentage);
            }

            if (isEdit) {
                await providerClientService.updateMeal(providerId, meal!.id, payload);
                toast.success("Meal updated successfully!");
            } else {
                await providerClientService.createMeal(providerId, payload as unknown as Meal);
                toast.success("Meal created successfully!");
            }

            onOpenChange(false);
            onSuccess();
        },
    });

    const isSubmitting = form.state.isSubmitting;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="name">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="meal-name">Meal Name *</Label>
                                <Input
                                    id="meal-name"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="e.g. Chicken Biryani"
                                    required
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="description">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="meal-desc">Description</Label>
                                <Textarea
                                    id="meal-desc"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Describe the meal..."
                                    rows={2}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="category_id">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="meal-category">Category *</Label>
                                <Select
                                    value={field.state.value}
                                    onValueChange={(val) => field.handleChange(val)}
                                >
                                    <SelectTrigger id="meal-category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </form.Field>
                    <div className="grid gap-4 grid-cols-2">
                        <form.Field name="price">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="meal-price">Price (&#2547;) *</Label>
                                    <Input
                                        id="meal-price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            )}
                        </form.Field>
                        <form.Field name="discount_price">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="meal-discount">Discount Price (&#2547;)</Label>
                                    <Input
                                        id="meal-discount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                        </form.Field>
                    </div>
                    <form.Field name="discount_percentage">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="meal-discount-pct">Discount Percentage (%)</Label>
                                <Input
                                    id="meal-discount-pct"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="e.g. 10"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter either a flat discount price or a percentage — both are optional.
                                </p>
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="preparation_time">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="meal-prep-time">Preparation Time (minutes) *</Label>
                                <Input
                                    id="meal-prep-time"
                                    type="number"
                                    min="1"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="e.g. 30"
                                    required
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="image_url">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="meal-image">Image URL</Label>
                                <Input
                                    id="meal-image"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="is_available">
                        {(field) => (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="meal-available"
                                    checked={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.checked)}
                                    className="size-4 rounded border"
                                />
                                <Label htmlFor="meal-available">Available for ordering</Label>
                            </div>
                        )}
                    </form.Field>
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

    // Calculate the final price after discount
    let finalPrice: number | null = null;
    if (meal.discount_price != null && meal.discount_price > 0) {
        finalPrice = meal.price - meal.discount_price;
    }
    if (meal.discount_percentage != null && meal.discount_percentage > 0) {
        finalPrice = meal.price * (1 - (meal.discount_percentage / 100));
    }

    return (
        <div className="flex gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
            <Image
                src={meal.image_url || "/placeholder.png"}
                alt={meal.name}
                className="size-20 shrink-0 rounded-lg object-cover"
                width={80}
                height={80}
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
                <div className="mt-2 flex flex-wrap items-center gap-3">
                    {finalPrice != null ? (
                        <>
                            <span className="flex items-center text-sm font-semibold text-primary">
                                {/* <DollarSign className="mr-0.5 size-3" /> */}
                                &#2547;{finalPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                                &#2547;{meal.price.toFixed(2)}
                            </span>
                            {meal.discount_percentage != null && meal.discount_percentage > 0 && (
                                <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-600 text-[11px]">
                                    -{meal.discount_percentage}%
                                </Badge>
                            )}
                            {
                                meal.discount_price != null && meal.discount_price > 0 && (
                                    <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-600 text-[11px]">
                                        -&#2547;{meal.discount_price.toFixed(2)}
                                    </Badge>
                                )
                            }
                        </>
                    ) : (
                        <span className="flex items-center text-sm font-semibold">
                            {/* <DollarSign className="mr-0.5 size-3" /> */}
                            &#2547;{meal.price.toFixed(2)}
                        </span>
                    )}
                    {meal.preparation_time && (
                        <span className="flex items-center gap-0.5 text-sm text-muted-foreground">
                            <Clock className="size-3" />
                            {meal.preparation_time} min
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
