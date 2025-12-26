"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

type Product = {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: { name: string };
};

export function ProductCardActions({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "/placeholder.jpg",
            quantity: 1,
        });

        toast({
            title: "¡Agregado al carrito!",
            description: `${product.name} ya está en tu pedido.`,
            className: "bg-olive text-white border-none",
        });
    };

    return (
        <Button
            size="sm"
            className="bg-white text-stone-900 hover:bg-beige shadow-lg"
            onClick={handleAddToCart}
        >
            <ShoppingCart className="mr-2 h-4 w-4" /> Agregar
        </Button>
    );
}
