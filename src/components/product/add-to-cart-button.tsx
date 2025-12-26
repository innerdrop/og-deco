"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <Button
            size="lg"
            onClick={handleAdd}
            className={cn(
                "flex-1 h-14 text-lg transition-all",
                added ? "bg-green-600 hover:bg-green-700 text-white" : "bg-stone-900 hover:bg-black text-white"
            )}
        >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {added ? "¡Agregado!" : "Agregar al Carrito"}
        </Button>
    );
}
