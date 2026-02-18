export type CartItemDisplay = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    mealId?: string;
};

export function calculateTotals(cartItems: CartItemDisplay[]) {
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const delivery = subtotal > 0 ? 60 : 0;

    return {
        subtotal,
        delivery,
        total: subtotal + delivery,
    };
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
