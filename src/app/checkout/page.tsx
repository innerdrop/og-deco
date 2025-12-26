"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CreditCard, Truck, CheckCircle, Ticket } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { validateCoupon } from "@/actions/promotion-actions";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const { items, cartTotal } = useCart();
    const { toast } = useToast();

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; type: string } | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidating(true);
        try {
            const result = await validateCoupon(couponCode);
            if (result.valid) {
                setAppliedDiscount({
                    code: result.code!,
                    amount: result.discount!,
                    type: result.type!
                });
                toast({
                    title: "¡Cupón aplicado!",
                    description: `Descuento del ${result.discount}% aplicado correctamente.`,
                    className: "bg-green-600 text-white border-none",
                });
            } else {
                setAppliedDiscount(null);
                toast({
                    title: "Error",
                    description: result.error,
                    className: "bg-red-600 text-white border-none",
                });
            }
        } catch (error) {
            toast({ title: "Error", description: "No se pudo validar el cupón." });
        } finally {
            setIsValidating(false);
        }
    };

    const discountAmount = appliedDiscount
        ? (cartTotal * appliedDiscount.amount / 100)
        : 0;

    const finalTotal = cartTotal - discountAmount;

    return (
        <main className="min-h-screen flex flex-col bg-stone-50">
            <div className="bg-white border-b border-stone-200 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                    <Link href="/" className="font-serif font-bold text-olive-dark text-xl">OG</Link>
                    <div className="flex items-center gap-2 text-stone-500">
                        <span className="text-green-600 font-medium">Checkout Seguro</span>
                        <span className="text-xs bg-stone-100 px-2 py-1 rounded">SSL Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
                {step < 3 ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            {/* Shipping Step */}
                            <div className={`bg-white p-6 rounded-xl shadow-sm border ${step === 1 ? 'border-olive ring-1 ring-olive' : 'border-stone-100'}`}>
                                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                                    <Truck className="text-olive" /> Datos de Envío
                                </h2>
                                {step === 1 ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Nombre" className="p-3 border rounded-md w-full" defaultValue="Mauro" />
                                            <input placeholder="Apellido" className="p-3 border rounded-md w-full" />
                                        </div>
                                        <input placeholder="Dirección / Calle y Altura" className="p-3 border rounded-md w-full" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Ciudad (Ushuaia)" className="p-3 border rounded-md w-full" defaultValue="Ushuaia" />
                                            <input placeholder="Código Postal" className="p-3 border rounded-md w-full" defaultValue="9410" />
                                        </div>
                                        <Button onClick={() => setStep(2)} className="w-full bg-stone-900 text-white h-12 mt-4">
                                            Continuar al Pago
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-sm text-stone-500 flex justify-between items-center">
                                        <p>Mauro - Primer Argentino 221, Ushuaia.</p>
                                        <Button variant="link" onClick={() => setStep(1)} className="text-olive h-auto p-0">Editar</Button>
                                    </div>
                                )}
                            </div>

                            {/* Payment Step */}
                            <div className={`bg-white p-6 rounded-xl shadow-sm border ${step === 2 ? 'border-olive ring-1 ring-olive' : 'border-stone-100'}`}>
                                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="text-olive" /> Medio de Pago
                                </h2>
                                {step === 2 ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="p-4 border rounded-lg flex items-center gap-4 bg-sky-50 border-sky-200 cursor-pointer">
                                            <div className="bg-sky-500 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold">MP</div>
                                            <div>
                                                <p className="font-bold text-stone-900">Mercado Pago</p>
                                                <p className="text-xs text-stone-500">Tarjetas, Débito, Efectivo</p>
                                            </div>
                                        </div>

                                        <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                                            <label className="text-sm font-medium text-stone-700 mb-2 block flex items-center gap-2">
                                                <Ticket className="h-4 w-4" /> Cupón de Descuento
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    placeholder="Ej: VERANO10"
                                                    className="flex-1 p-2 border rounded border-stone-300 uppercase"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    disabled={!!appliedDiscount}
                                                />
                                                <Button
                                                    onClick={handleApplyCoupon}
                                                    disabled={isValidating || !couponCode || !!appliedDiscount}
                                                    className="bg-stone-800 text-white"
                                                >
                                                    {isValidating ? "..." : appliedDiscount ? "Aplicado" : "Aplicar"}
                                                </Button>
                                            </div>
                                            {appliedDiscount && (
                                                <p className="text-xs text-green-600 mt-2 font-medium">
                                                    Cupón {appliedDiscount.code} aplicado: -${discountAmount.toLocaleString()}
                                                </p>
                                            )}
                                        </div>

                                        <Button onClick={() => setStep(3)} className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 mt-4 shadow-lg shadow-blue-500/20">
                                            Pagar ${finalTotal.toLocaleString()} con Mercado Pago
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-stone-400">Completá el envío para ver los pagos.</p>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="h-fit space-y-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                                <h3 className="font-bold text-stone-800 mb-4">Resumen de Compra</h3>
                                <div className="space-y-2 text-sm text-stone-600 border-b border-stone-100 pb-4">
                                    {items.length > 0 ? items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <span className="truncate max-w-[150px]">{item.name} <span className="text-stone-400">x{item.quantity}</span></span>
                                            <span>${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    )) : (
                                        <p className="text-stone-400 italic">Tu carrito está vacío.</p>
                                    )}
                                </div>
                                <div className="space-y-2 pt-4">
                                    <div className="flex justify-between text-stone-500">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toLocaleString()}</span>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Descuento ({appliedDiscount.amount}%)</span>
                                            <span>-${discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-xl text-stone-900 border-t pt-2 mt-2">
                                        <span>Total</span>
                                        <span>${finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Success Step */
                    <div className="max-w-md mx-auto text-center py-12 animate-fade-in">
                        <div className="bg-green-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-4">¡Gracias por tu compra!</h1>
                        <p className="text-stone-600 mb-8">
                            Tu pedido ha sido confirmado. Hemos enviado los detalles a tu email.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/">
                                <Button variant="outline">Volver al Inicio</Button>
                            </Link>
                            <Link href="/shop">
                                <Button className="bg-olive hover:bg-olive-dark text-white">Seguir Comprando</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
