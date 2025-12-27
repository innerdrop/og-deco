import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Filter } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductFilters from "@/components/shop/product-filters";

import { Prisma } from "@prisma/client";

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ cat?: string; min?: string; max?: string; q?: string }>;
}) {
    const { cat: categoryFilter, min, max, q: searchQuery } = await searchParams;

    // Prepare Where Clause
    const whereClause: Prisma.ProductWhereInput = {};

    if (categoryFilter) {
        whereClause.categoryId = categoryFilter;
    }

    if (min || max) {
        whereClause.price = {};
        if (min) whereClause.price.gte = parseFloat(min);
        if (max) whereClause.price.lte = parseFloat(max);
    }

    if (searchQuery) {
        whereClause.name = {
            contains: searchQuery
        };
    }

    // 1. Fetch Categories and Products (Parallel)
    const [categories, products] = await Promise.all([
        prisma.category.findMany(),
        prisma.product.findMany({
            where: whereClause,
            include: { category: true },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return (
        <main className="min-h-screen flex flex-col bg-beige">
            <Navbar />
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-olive-dark mb-2">
                            Catálogo
                        </h1>
                        <p className="text-stone-500">
                            Encontrá la inspiración para tu hogar.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="hidden md:block">
                        <ProductFilters categories={categories} />
                    </div>

                    {/* Product Grid */}
                    <div className="md:col-span-3">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link
                                        href={`/producto/${product.id}`}
                                        key={product.id}
                                        className="group block"
                                    >
                                        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="aspect-[4/5] relative overflow-hidden bg-stone-100">
                                                {product.image && (
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                        style={{ backgroundImage: `url('${product.image}')` }}
                                                    />
                                                )}
                                                {product.isNew && (
                                                    <span className="absolute top-2 left-2 bg-olive text-white text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider font-bold">
                                                        Nuevo
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs text-stone-500 mb-1 capitalize">
                                                    {product.category.name}
                                                </p>
                                                <h3 className="font-serif font-medium text-lg text-stone-900 mb-1 group-hover:text-olive transition-colors">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-olive">
                                                        ${product.price.toLocaleString("es-AR")}
                                                    </span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 rounded-full hover:bg-olive hover:text-white transition-colors"
                                                    >
                                                        <ShoppingCart className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/50 rounded-lg">
                                <p className="text-stone-500 font-serif text-lg">
                                    No encontramos productos con estos filtros.
                                </p>
                                <Link href="/productos">
                                    <Button variant="link" className="text-olive mt-2">
                                        Limpiar filtros
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
