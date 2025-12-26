import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCardActions } from "@/components/shop/product-card-actions"

type Product = {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: { name: string };
    isNew: boolean;
};

export function FeaturedProducts({ products }: { products: Product[] }) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-between mb-12 sm:flex-row">
                    <h2 className="text-3xl font-serif font-bold text-olive-dark md:text-4xl text-center sm:text-left">
                        Nuevos Ingresos
                    </h2>
                    <Link href="/productos">
                        <Button variant="link" className="text-olive hover:text-olive-dark text-lg mt-4 sm:mt-0">
                            Ver todo el catálogo &rarr;
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <Link href={`/producto/${product.id}`} key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block">
                            <div className="aspect-square relative overflow-hidden bg-stone-100">
                                {product.image && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: `url('${product.image}')` }}
                                    />
                                )}
                                {/* Overlay actions */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent pb-6">
                                    <ProductCardActions product={product} />
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-stone-500 mb-1 capitalize">{product.category.name}</p>
                                <h3 className="font-serif font-medium text-lg text-stone-900 group-hover:text-olive transition-colors">
                                    {product.name}
                                </h3>
                                <p className="font-bold text-olive mt-2">
                                    ${product.price.toLocaleString('es-AR')}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
