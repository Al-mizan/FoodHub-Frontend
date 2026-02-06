"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function CartIcon() {
    const { isAuthenticated } = useAuth();
    const { count, isLoading } = useCart();

    return (
        <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
                <ShoppingCart className="size-5" />
                {isAuthenticated && !isLoading && count > 0 && (
                    <Badge 
                        className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs font-bold text-white border-0"
                    >
                        {count > 99 ? "99+" : count}
                    </Badge>
                )}
            </Link>
        </Button>
    );
}
