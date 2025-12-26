"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    return (
        <main className="min-h-screen flex flex-col bg-beige">
            <Navbar />
            <div className="container mx-auto px-4 md:px-6 py-12">
                <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">Tu Carrito ({cartCount})</h1>

                {items.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                                    <div className="h-24 w-24 rounded-md bg-stone-100 overflow-hidden shrink-0">
                                        {item.image && (
                                            <div
                                                className="w-full h-full bg-cover bg-center"
                                                style={{ backgroundImage: `url('${item.image}')` }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-serif font-medium text-stone-900">{item.name}</h3>
                                                <p className="text-sm text-stone-500 capitalize">{item.category}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-stone-400 hover:text-red-500"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-stone-500">Cant:</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                    className="w-16 h-8 rounded border border-stone-200 px-2 text-sm"
                                                />
                                            </div>
                                            <p className="font-bold text-olive">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white p-6 rounded-lg shadow-sm h-fit space-y-6">
                            <h2 className="font-serif font-bold text-xl text-stone-800">Resumen de Compra</h2>
                            <div className="space-y-3 text-sm text-stone-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span className="text-green-600">Gratis</span>
                                </div>
                                <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-lg text-stone-900">
                                    <span>Total</span>
                                    <span>${cartTotal.toLocaleString('es-AR')}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block">
                                <Button size="lg" className="w-full bg-olive hover:bg-olive-dark text-white h-12">
                                    Iniciar Compra
                                </Button>
                            </Link>

                            <div className="flex justify-center gap-2 mt-4 opacity-50 grayscale">
                                <span className="text-xs text-stone-400">Pagá seguro con Mercado Pago</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 rounded-lg">
                        <ShoppingBag className="h-16 w-16 mx-auto text-stone-300 mb-4" />
                        <h2 className="text-xl font-serif font-bold text-stone-700 mb-2">Tu carrito está vacío</h2>
                        <p className="text-stone-500 mb-6">Parece que aún no has agregado nada.</p>
                        <Link href="/shop">
                            <Button className="bg-olive text-white">
                                Ir al Catálogo
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
