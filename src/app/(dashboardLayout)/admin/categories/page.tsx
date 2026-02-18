"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
    adminClientService,
    type AdminCategory,
} from "@/services/admin-client.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Plus,
    Pencil,
    Loader2,
    Shield,
    Tags,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/* ── Category Form Dialog ── */
function CategoryFormDialog({
    open,
    onOpenChange,
    category,
    onSuccess,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    category?: AdminCategory | null;
    onSuccess: () => void;
}) {
    const isEdit = !!category;
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setSlug(category.slug);
            setIconUrl(category.icon_url || "");
        } else {
            setName("");
            setSlug("");
            setIconUrl("");
        }
    }, [category, open]);

    // Auto-generate slug from name
    const handleNameChange = (val: string) => {
        setName(val);
        if (!isEdit) {
            setSlug(
                val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")
                    .slice(0, 20)
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }
        if (!slug.trim()) {
            toast.error("Slug is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                name: name.trim(),
                slug: slug.trim(),
                icon_url: iconUrl.trim() || undefined,
            };

            if (isEdit) {
                await adminClientService.updateCategory(category!.id, data);
                toast.success("Category updated!");
            } else {
                await adminClientService.createCategory(data);
                toast.success("Category created!");
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
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Category" : "Add Category"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the category details."
                            : "Create a new cuisine category."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cat-name">Name *</Label>
                        <Input
                            id="cat-name"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g. Bengali"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cat-slug">Slug *</Label>
                        <Input
                            id="cat-slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. bengali"
                            maxLength={20}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cat-icon">Icon URL</Label>
                        <Input
                            id="cat-icon"
                            value={iconUrl}
                            onChange={(e) => setIconUrl(e.target.value)}
                            placeholder="https://..."
                        />
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
                            {isSubmitting && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/* ── Category Card ── */
function CategoryCard({
    category,
    onEdit,
    onToggle,
}: {
    category: AdminCategory;
    onEdit: () => void;
    onToggle: () => void;
}) {
    const [toggling, setToggling] = useState(false);

    const handleToggle = async () => {
        setToggling(true);
        await onToggle();
        setToggling(false);
    };

    return (
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
                {category.icon_url ? (
                    <img
                        src={category.icon_url}
                        alt={category.name}
                        className="size-10 rounded-lg object-cover"
                    />
                ) : (
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Tags className="size-5 text-muted-foreground" />
                    </div>
                )}
                <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">/{category.slug}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Active" : "Inactive"}
                </Badge>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggle}
                    disabled={toggling}
                >
                    {toggling ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : category.is_active ? (
                        "Deactivate"
                    ) : (
                        "Activate"
                    )}
                </Button>
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Pencil className="size-4" />
                </Button>
            </div>
        </div>
    );
}

/* ── Page ── */
export default function AdminCategoriesPage() {
    const { user, isPending } = useAuth();
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
        null
    );

    const fetchCategories = useCallback(async () => {
        try {
            setError(null);
            const data = await adminClientService.getCategories();
            setCategories(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load categories"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isPending && user && user.role === "ADMIN") {
            fetchCategories();
        } else if (!isPending) {
            setLoading(false);
        }
    }, [isPending, user, fetchCategories]);

    const handleToggleActive = async (cat: AdminCategory) => {
        try {
            await adminClientService.updateCategory(cat.id, {
                is_active: !cat.is_active,
            });
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === cat.id ? { ...c, is_active: !c.is_active } : c
                )
            );
            toast.success(
                `Category ${!cat.is_active ? "activated" : "deactivated"}`
            );
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Failed to update category"
            );
        }
    };

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
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Manage Categories
                    </h1>
                    <p className="text-muted-foreground">
                        {categories.length} categor
                        {categories.length !== 1 ? "ies" : "y"}
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormOpen(true);
                    }}
                >
                    <Plus className="mr-2 size-4" />
                    Add Category
                </Button>
            </div>

            <Separator />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                    <Button
                        variant="link"
                        className="ml-2 h-auto p-0"
                        onClick={fetchCategories}
                    >
                        Retry
                    </Button>
                </div>
            )}

            {categories.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                    <Tags className="mb-4 size-12 text-muted-foreground/40" />
                    <h2 className="mb-2 text-lg font-semibold">No categories yet</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Add your first cuisine category.
                    </p>
                    <Button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormOpen(true);
                        }}
                    >
                        <Plus className="mr-2 size-4" />
                        Add Category
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            onEdit={() => {
                                setEditingCategory(cat);
                                setFormOpen(true);
                            }}
                            onToggle={() => handleToggleActive(cat)}
                        />
                    ))}
                </div>
            )}

            <CategoryFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                category={editingCategory}
                onSuccess={fetchCategories}
            />
        </div>
    );
}
