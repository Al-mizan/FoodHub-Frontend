"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "Minimalist Beige Sneakers",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png",
    price: 120.0,
    quantity: 1,
  },
  {
    id: "2",
    name: "Embroidered Blue Top",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png",
    price: 140.0,
    quantity: 1,
  },
  {
    id: "3",
    name: "Classic Fedora Hat",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-2.png",
    price: 84.0,
    quantity: 1,
  },
];

const ShoppingCart1 = ({
  initialItems = DEFAULT_ITEMS,
}: {
  initialItems?: CartItem[];
}) => {
  const [items, setItems] = useState(initialItems);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <section className="py-32">
        <div className="container max-w-lg text-center">
          <h1 className="mb-4 text-2xl font-semibold">Your cart is empty</h1>
          <p className="mb-8 text-muted-foreground">
            Looks like you haven't added anything yet.
          </p>
          <Button asChild>
            <a href="#">Continue Shopping</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="container max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold">Shopping Cart</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <div className="w-20 shrink-0">
                <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                </AspectRatio>
              </div>

              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => removeItem(item.id)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <Button size="lg" className="w-full">
            Checkout
          </Button>
        </div>
      </div>
    </section>
  );
};

export { ShoppingCart1 };
