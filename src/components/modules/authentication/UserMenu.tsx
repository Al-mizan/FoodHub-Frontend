"use client";

import { LogOut, User, MapPin, Loader2, ShoppingBag, ChefHat, Store, Users, Package, Tags } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function UserMenu() {
    const { user } = useAuth();
    const { profile, isLoading: profileLoading, updateAddress } = useUserProfile();
    const router = useRouter();
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Sync address with profile when modal opens
    const handleOpenAddressModal = () => {
        if (profile?.address) {
            setAddress(profile.address);
        }
        setAddressModalOpen(true);
    };

    if (!user) return null;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            toast.success("Logged out successfully!");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    const handleSaveAddress = async () => {
        if (!address.trim()) {
            toast.error("Please enter an address");
            return;
        }

        setIsSaving(true);
        const result = await updateAddress(address.trim());
        setIsSaving(false);

        if (result.success) {
            toast.success("Address updated successfully!");
            setAddressModalOpen(false);
        } else {
            toast.error(result.error || "Failed to update address");
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative size-9 rounded-full">
                        <Avatar className="size-9">
                            <AvatarImage src={user.image || undefined} alt={user.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => router.push("/orders")}>
                        <ShoppingBag className="mr-2 size-4" />
                        <span>My Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/profile")}>
                        <User className="mr-2 size-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleOpenAddressModal}>
                        <MapPin className="mr-2 size-4" />
                        <span>Address</span>
                    </DropdownMenuItem>
                    {user.role === "PROVIDER" && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => router.push("/provider/meals")}>
                                <ChefHat className="mr-2 size-4" />
                                <span>Manage Meals</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push("/provider/orders")}>
                                <Store className="mr-2 size-4" />
                                <span>Provider Orders</span>
                            </DropdownMenuItem>
                        </>
                    )}
                    {user.role === "ADMIN" && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => router.push("/admin/users")}>
                                <Users className="mr-2 size-4" />
                                <span>Manage Users</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push("/admin/orders")}>
                                <Package className="mr-2 size-4" />
                                <span>All Orders</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push("/admin/categories")}>
                                <Tags className="mr-2 size-4" />
                                <span>Categories</span>
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
                        <LogOut className="mr-2 size-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Address Modal */}
            <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin className="size-5" />
                            Delivery Address
                        </DialogTitle>
                        <DialogDescription>
                            Enter your delivery address. This will be used for all your orders.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            {profileLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <Input
                                    id="address"
                                    placeholder="Enter your full address..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            )}
                        </div>
                        {profile?.address && (
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Current address:</span> {profile.address}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddressModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAddress} disabled={isSaving || profileLoading}>
                            {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Save Address
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
