"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoveRight, Check, Ruler, Scissors, Home, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type QuoterOption = {
    id: string;
    name: string;
    priceMod: number; // For simplicity, we assume per m2 for fabrics, or fixed for others
    isPercentage: boolean;
};

type QuoterCategory = {
    id: string;
    name: string;
    slug: string;
    options: QuoterOption[];
};

export default function QuoterClient({ categories, globalSettings }: { categories: QuoterCategory[], globalSettings: any }) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        room: "",
        width: 150,
        height: 200,
        fabric: "",
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    // Filter categories by slug to identifying them
    const environments = categories.find(c => c.slug.includes("ambiente"))?.options || [];
    const fabrics = categories.find(c => c.slug.includes("tela"))?.options || [];

    const calculatePrice = () => {
        const area = (data.width / 100) * (data.height / 100);
        // Find selected fabric
        const selectedFabric = fabrics.find(f => f.id === data.fabric);
        const fabricPrice = selectedFabric ? selectedFabric.priceMod : 0;

        // Base margin from global settings
        const margin = 1 + ((globalSettings?.baseMargin || 30) / 100);

        return Math.round(area * fabricPrice * margin);
    };

    const getWhatsAppLink = () => {
        const price = calculatePrice();
        const fabricName = fabrics.find(f => f.id === data.fabric)?.name;
        const roomName = environments.find(e => e.id === data.room)?.name || data.room;
        const text = `Hola! Hice una cotización en la web. Ambiente: ${roomName}, Medidas: ${data.width}x${data.height}cm, Tela: ${fabricName}. Precio estimado: $${price}. Quisiera coordinar una visita.`;
        return `https://wa.me/5492901123456?text=${encodeURIComponent(text)}`;
    };

    return (
        <main className="min-h-screen flex flex-col bg-stone-50">
            <Navbar />
            <div className="container mx-auto px-4 md:px-6 py-12 flex-grow">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-olive-dark mb-4">Cotizador Online</h1>
                        <p className="text-stone-600">Presupuesto estimado con tus opciones personalizadas.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -z-10 transform -translate-y-1/2" />
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                                    step >= s ? "bg-olive text-white" : "bg-stone-200 text-stone-500"
                                )}
                            >
                                {s}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-between">
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
                                    <Home className="text-olive" /> ¿Qué ambiente vas a renovar?
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {environments.map((room) => (
                                        <button
                                            key={room.id}
                                            onClick={() => setData({ ...data, room: room.id })}
                                            className={cn(
                                                "relative p-4 rounded-xl border-2 text-left transition-all hover:border-olive/50 overflow-hidden group h-32 flex flex-col justify-end",
                                                data.room === room.id ? "border-olive bg-olive/5" : "border-stone-100 bg-stone-50"
                                            )}
                                        >
                                            {room.image && (
                                                <img
                                                    src={room.image}
                                                    alt={room.name}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity z-0"
                                                />
                                            )}
                                            <div className="relative z-10 bg-white/80 p-2 rounded backdrop-blur-sm">
                                                <span className="font-medium text-stone-900 block">{room.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                    {environments.length === 0 && <p className="text-red-500">No hay ambientes configurados en el Admin.</p>}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
                                    <Ruler className="text-olive" /> Medidas de la ventana
                                </h2>
                                <div className="space-y-8 py-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">Ancho: {data.width} cm</label>
                                        <input
                                            type="range"
                                            min={globalSettings?.minWidth || 50}
                                            max={globalSettings?.maxWidth || 400}
                                            step="10"
                                            value={data.width}
                                            onChange={(e) => setData({ ...data, width: parseInt(e.target.value) })}
                                            className="w-full accent-olive"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">Alto: {data.height} cm</label>
                                        <input
                                            type="range"
                                            min={globalSettings?.minHeight || 50}
                                            max={globalSettings?.maxHeight || 300}
                                            step="10"
                                            value={data.height}
                                            onChange={(e) => setData({ ...data, height: parseInt(e.target.value) })}
                                            className="w-full accent-olive"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
                                    <Scissors className="text-olive" /> Elegí tu tela
                                </h2>
                                <div className="space-y-3">
                                    {fabrics.map((fabric) => (
                                        <button
                                            key={fabric.id}
                                            onClick={() => setData({ ...data, fabric: fabric.id })}
                                            className={cn(
                                                "w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center group",
                                                data.fabric === fabric.id ? "border-olive bg-olive/5" : "border-stone-100 bg-stone-50 hover:border-olive/30"
                                            )}
                                        >
                                            <div>
                                                <span className="font-medium text-stone-900 block">{fabric.name}</span>
                                                <span className="text-xs text-stone-500">${fabric.priceMod}/m2</span>
                                            </div>
                                            <div className="text-olive font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                {data.fabric === fabric.id && <Check className="h-5 w-5 opacity-100" />}
                                            </div>
                                        </button>
                                    ))}
                                    {fabrics.length === 0 && <p className="text-red-500">No hay telas configuradas en el Admin.</p>}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-fade-in text-center">
                                <h2 className="text-3xl font-serif font-bold text-olive-dark mb-2">¡Cotización Lista!</h2>

                                <div className="bg-stone-100 p-8 rounded-full h-48 w-48 flex flex-col items-center justify-center mx-auto mb-8 ring-4 ring-white shadow-xl">
                                    <span className="text-sm text-stone-500 uppercase tracking-wide">Estimado</span>
                                    <span className="text-3xl font-bold text-olive-dark">${calculatePrice().toLocaleString('es-AR')}</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <Button size="lg" className="w-full bg-olive hover:bg-olive-dark text-white gap-2 h-14 text-lg">
                                            <Phone className="h-5 w-5" /> Enviar por WhatsApp
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 4 && (
                            <div className="flex justify-between mt-8 pt-6 border-t border-stone-100">
                                <Button variant="ghost" onClick={handleBack} disabled={step === 1}>Volver</Button>
                                <Button onClick={handleNext} className="bg-stone-900 text-white"
                                    disabled={(step === 1 && !data.room) || (step === 3 && !data.fabric)}>
                                    Siguiente <MoveRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                        {step === 4 && (
                            <div className="flex justify-center mt-4">
                                <Button variant="link" onClick={() => setStep(1)} className="text-stone-500">
                                    Recalcular
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
