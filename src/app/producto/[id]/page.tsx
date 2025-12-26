import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Phone, ChevronRight, Truck, ShieldCheck, Ruler } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/product/add-to-cart-button";

// Next.js 15+ Params handling
type Props = {
    params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen flex flex-col bg-beige">
            <Navbar />

            {/* Breadcrumb */}
            <div className="bg-white/50 border-b border-stone-200 py-4">
                <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 text-sm text-stone-500">
                    <Link href="/" className="hover:text-olive-dark">Inicio</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/productos" className="hover:text-olive-dark">Catálogo</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-stone-900">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Gallery Section */}
                    <div className="space-y-4">
                        <div className="aspect-square relative overflow-hidden rounded-xl bg-stone-100 shadow-sm">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${product.image}')` }}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="aspect-square rounded-lg bg-stone-100 overflow-hidden cursor-pointer hover:ring-2 ring-olive transition-all">
                                    <div
                                        className="w-full h-full bg-cover bg-center opacity-80 hover:opacity-100"
                                        style={{ backgroundImage: `url('${product.image}')` }} // Mocking gallery
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <span className="text-sm font-medium text-olive uppercase tracking-wider">{product.category.name}</span>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mt-2 mb-4">{product.name}</h1>
                            <p className="text-3xl font-bold text-olive-dark">${product.price.toLocaleString('es-AR')}</p>
                        </div>

                        <div className="prose prose-stone max-w-none">
                            <p className="text-stone-600 leading-relaxed text-lg">
                                {product.description || "Diseñado para transformar tu espacio en un refugio de calma y estilo."}
                            </p>
                            <ul className="mt-4 space-y-2 text-stone-600 list-disc list-inside">
                                <li>Materiales premium duraderos</li>
                                <li>Diseño exclusivo OG Decoraciones</li>
                                <li>Fácil limpieza y mantenimiento</li>
                                <li>Garantía de calidad garantizada</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-6 border-t border-stone-200">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <AddToCartButton product={product} />
                                <Button size="lg" variant="outline" className="flex-1 border-olive text-olive hover:bg-olive/10 h-14 text-lg">
                                    <Phone className="mr-2 h-5 w-5" /> Consultar por WhatsApp
                                </Button>
                                <Button size="icon" variant="ghost" className="h-14 w-14 border border-stone-200">
                                    <Heart className="h-6 w-6 text-stone-400" />
                                </Button>
                            </div>
                            <p className="text-xs text-stone-500 text-center">
                                * Stock limitado. Consultar disponibilidad para grandes cantidades.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone-100 shadow-sm">
                                <Truck className="h-8 w-8 text-olive/80" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-900">Envíos a todo el país</p>
                                    <p className="text-stone-500">Gratis en Ushuaia</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone-100 shadow-sm">
                                <ShieldCheck className="h-8 w-8 text-olive/80" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-900">Compra Segura</p>
                                    <p className="text-stone-500">Garantía de satisfacción</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-stone-100 shadow-sm">
                                <Ruler className="h-8 w-8 text-olive/80" />
                                <div className="text-sm">
                                    <p className="font-bold text-stone-900">Asesoramiento</p>
                                    <p className="text-stone-500">Personalizado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
