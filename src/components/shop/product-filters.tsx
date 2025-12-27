"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Category = {
    id: string;
    name: string;
    slug: string;
};

export default function ProductFilters({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCat = searchParams.get("cat");
    const currentMin = searchParams.get("min");
    const currentMax = searchParams.get("max");

    const [minPrice, setMinPrice] = useState(currentMin || "");
    const [maxPrice, setMaxPrice] = useState(currentMax || "");

    // Update state if URL changes externally
    useEffect(() => {
        setMinPrice(currentMin || "");
        setMaxPrice(currentMax || "");
    }, [currentMin, currentMax]);

    const handleCategoryClick = (catId: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (catId) {
            params.set("cat", catId);
        } else {
            params.delete("cat");
        }
        // Reset pagination if exists? For now just push
        router.push(`/productos?${params.toString()}`);
    };

    const handlePriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set("min", minPrice);
        else params.delete("min");

        if (maxPrice) params.set("max", maxPrice);
        else params.delete("max");

        router.push(`/productos?${params.toString()}`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Categories */}
            <div>
                <h3 className="font-serif font-bold text-lg mb-4 text-stone-800">
                    Categorías
                </h3>
                <ul className="space-y-2 text-sm text-stone-600">
                    <li>
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={cn(
                                "hover:text-olive-dark transition-colors text-left w-full",
                                !currentCat && "font-bold text-olive"
                            )}
                        >
                            Ver todo
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => handleCategoryClick(cat.id)}
                                className={cn(
                                    "hover:text-olive-dark transition-colors text-left w-full capitalize",
                                    currentCat === cat.id && "font-bold text-olive"
                                )}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="font-serif font-bold text-lg mb-4 text-stone-800">
                    Precio
                </h3>
                <Link href="/productos" className="text-sm text-olive hover:underline block mt-2">
                    Limpiar Filtros
                </Link>
                <div className="flex items-center gap-2 text-sm text-stone-600 mb-3">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-20 p-2 border border-stone-200 rounded bg-white/50 focus:outline-none focus:border-olive"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-20 p-2 border border-stone-200 rounded bg-white/50 focus:outline-none focus:border-olive"
                    />
                </div>
                <Button
                    onClick={handlePriceFilter}
                    variant="outline"
                    size="sm"
                    className="w-full border-olive text-olive hover:bg-olive hover:text-white"
                >
                    Aplicar
                </Button>
            </div>
        </div>
    );
}
