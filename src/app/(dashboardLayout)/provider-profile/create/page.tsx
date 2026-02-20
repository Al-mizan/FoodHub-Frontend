"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "@/hooks/useAuth";
import { providerClientService } from "@/services/provider-client.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Store,
    Clock,
    MapPin,
    Loader2,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateProviderProfilePage() {
    const { user, isPending } = useAuth();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm({
        defaultValues: {
            restaurant_name: "",
            description: "",
            address: "",
            opening_time: "09:00",
            closing_time: "22:00",
            logo_url: "",
            banner_url: "",
        },
        onSubmit: async ({ value }) => {
            if (!value.restaurant_name.trim()) {
                toast.error("Restaurant name is required");
                return;
            }
            if (!value.address.trim()) {
                toast.error("Address is required");
                return;
            }

            setIsSubmitting(true);
            try {
                await providerClientService.createProviderProfile({
                    restaurant_name: value.restaurant_name.trim(),
                    description: value.description.trim() || undefined,
                    address: value.address.trim(),
                    opening_time: value.opening_time,
                    closing_time: value.closing_time,
                    logo_url: value.logo_url.trim() || undefined,
                    banner_url: value.banner_url.trim() || undefined,
                });
                setIsSuccess(true);
                toast.success("Provider profile created! Your role has been upgraded to Provider.");
                // Refresh session to get updated role
                setTimeout(() => {
                    router.push("/provider/meals");
                    router.refresh();
                }, 1500);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to create profile");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    if (isPending) {
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
                <Button asChild className="cursor-pointer">
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    if (user.role === "PROVIDER") {
        return (
            <div className="mx-auto max-w-lg text-center py-16">
                <CheckCircle2 className="mx-auto mb-4 size-12 text-green-500" />
                <h1 className="mb-2 text-2xl font-bold">Already a Provider!</h1>
                <p className="mb-6 text-muted-foreground">
                    You already have a provider profile. Manage your restaurant from the dashboard.
                </p>
                <div className="flex justify-center gap-3">
                    <Button asChild className="cursor-pointer">
                        <Link href="/provider/meals">Manage Meals</Link>
                    </Button>
                    <Button asChild variant="outline" className="cursor-pointer">
                        <Link href="/provider/orders">View Orders</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="mx-auto max-w-lg text-center py-16">
                <CheckCircle2 className="mx-auto mb-4 size-12 text-green-500" />
                <h1 className="mb-2 text-2xl font-bold">Profile Created!</h1>
                <p className="text-muted-foreground">
                    Redirecting you to the meals management page...
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-4 cursor-pointer">
                    <Link href="/profile">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Profile
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <Store className="size-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Become a Provider</h1>
                        <p className="text-muted-foreground">
                            Set up your restaurant profile to start selling meals.
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-6 rounded-xl border bg-card p-6"
            >
                <div className="space-y-4">
                    <form.Field name="restaurant_name">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="restaurant_name">
                                    <Store className="mr-1 inline size-3" /> Restaurant Name *
                                </Label>
                                <Input
                                    id="restaurant_name"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="e.g. Dhaka Kitchen"
                                    required
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="description">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Tell customers about your restaurant..."
                                    rows={3}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="address">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    <MapPin className="mr-1 inline size-3" /> Address *
                                </Label>
                                <Input
                                    id="address"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Restaurant address"
                                    required
                                />
                            </div>
                        )}
                    </form.Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <form.Field name="opening_time">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="opening_time">
                                        <Clock className="mr-1 inline size-3" /> Opening Time
                                    </Label>
                                    <Input
                                        id="opening_time"
                                        type="time"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        </form.Field>
                        <form.Field name="closing_time">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="closing_time">
                                        <Clock className="mr-1 inline size-3" /> Closing Time
                                    </Label>
                                    <Input
                                        id="closing_time"
                                        type="time"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <form.Field name="logo_url">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="logo_url">Logo URL</Label>
                                    <Input
                                        id="logo_url"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            )}
                        </form.Field>
                        <form.Field name="banner_url">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="banner_url">Banner URL</Label>
                                    <Input
                                        id="banner_url"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            )}
                        </form.Field>
                    </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                        <Store className="mr-2 size-4" />
                    )}
                    {isSubmitting ? "Creating Profile..." : "Create Provider Profile"}
                </Button>
            </form>
        </div>
    );
}
