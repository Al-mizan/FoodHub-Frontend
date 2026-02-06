"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUser";
import { toast } from "sonner";

interface AddressModalProps {
    trigger?: React.ReactNode;
}

export function AddressModal({ trigger }: AddressModalProps) {
    const { profile, isLoading: profileLoading, updateAddress } = useUserProfile();
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Sync address with profile when modal opens
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen && profile?.address) {
            setAddress(profile.address);
        }
        setOpen(isOpen);
    };

    const handleSave = async () => {
        if (!address.trim()) {
            toast.error("Please enter an address");
            return;
        }

        setIsSaving(true);
        const result = await updateAddress(address.trim());
        setIsSaving(false);

        if (result.success) {
            toast.success("Address updated successfully!");
            setOpen(false);
        } else {
            toast.error(result.error || "Failed to update address");
        }
    };

    const defaultTrigger = (
        <Button variant="ghost" className="flex items-center gap-1">
            <MapPin className="size-4" />
            <span>Address</span>
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
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
                                className="min-h-[80px]"
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
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || profileLoading}>
                        {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Save Address
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
