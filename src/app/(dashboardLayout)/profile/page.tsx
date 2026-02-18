"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Store,
    Loader2,
    Save,
    ChefHat,
    Users,
    Package,
    Tags,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
    const { user, isPending } = useAuth();
    const { profile, isLoading: profileLoading } = useUserProfile();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setPhone(profile.phone || "");
            setAddress(profile.address || "");
        }
    }, [profile]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim() || undefined,
                    phone: phone.trim() || undefined,
                    address: address.trim() || undefined,
                }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.error || json.message || "Failed to update profile");
            }
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    }, [name, phone, address]);

    if (isPending || profileLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Please log in to view your profile.</p>
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    const isProvider = user.role === "PROVIDER";
    const isAdmin = user.role === "ADMIN";

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="size-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">
                            <Shield className="mr-1 size-3" />
                            {user.role}
                        </Badge>
                        {user.emailVerified && (
                            <Badge variant="secondary" className="text-green-600">
                                Verified
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className="space-y-6">
                <h2 className="text-lg font-semibold">Personal Information</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            <User className="mr-1 inline size-3" /> Full Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            <Mail className="mr-1 inline size-3" /> Email
                        </Label>
                        <Input
                            id="email"
                            value={user.email || ""}
                            disabled
                            className="opacity-60"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            <Phone className="mr-1 inline size-3" /> Phone
                        </Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone number"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">
                            <MapPin className="mr-1 inline size-3" /> Address
                        </Label>
                        <Input
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Delivery address"
                        />
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 size-4" />
                    )}
                    Save Changes
                </Button>
            </div>

            <Separator />

            {/* Provider Section */}
            {isProvider ? (
                <div className="rounded-xl border bg-primary/5 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Store className="size-6 text-primary" />
                        <h2 className="text-lg font-semibold">Provider Dashboard</h2>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Manage your restaurant, meals, and incoming orders.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                            <Link href="/provider/meals">
                                <ChefHat className="mr-2 size-4" />
                                Manage Meals
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/provider/orders">
                                <Store className="mr-2 size-4" />
                                View Orders
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-6 text-center">
                    <Store className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                    <h2 className="mb-2 text-lg font-semibold">Become a Provider</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Start selling your meals on FoodHub. Set up your restaurant profile
                        and reach hungry customers.
                    </p>
                    <Button asChild>
                        <Link href="/provider-profile/create">
                            <Store className="mr-2 size-4" />
                            Get Started
                        </Link>
                    </Button>
                </div>
            )}

            {/* Admin Section */}
            {isAdmin && (
                <>
                    <Separator />
                    <div className="rounded-xl border bg-primary/5 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="size-6 text-primary" />
                            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Manage users, orders, and categories across the platform.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild variant="outline">
                                <Link href="/admin/users">
                                    <Users className="mr-2 size-4" />
                                    Manage Users
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/admin/orders">
                                    <Package className="mr-2 size-4" />
                                    View All Orders
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/admin/categories">
                                    <Tags className="mr-2 size-4" />
                                    Manage Categories
                                </Link>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
