"use client";

import { Button } from "@/components/ui/button";
import { Plus, Ticket, Trash2, Power } from "lucide-react";
import { createPromotion, deletePromotion, togglePromotionStatus } from "@/actions/promotion-actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

type Promotion = {
    id: string;
    title: string;
    code: string;
    discount: number;
    type: string;
    isActive: boolean;
};

export default function PromotionManager({ promotions }: { promotions: Promotion[] }) {
    const [open, setOpen] = useState(false);

    // Confirmation State
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => Promise<void>;
        variant?: "destructive" | "default";
    }>({
        isOpen: false,
        title: "",
        description: "",
        action: async () => { },
    });
    const [isConfirming, setIsConfirming] = useState(false);

    // Create Handler
    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setConfirmation({
            isOpen: true,
            title: "¿Crear promoción?",
            description: `Se creará el cupón "${formData.get("code")}" con un ${formData.get("discount")}% de descuento.`,
            variant: "default",
            action: async () => {
                await createPromotion(formData);
                setOpen(false);
            }
        });
    };

    const handleDelete = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: "¿Eliminar promoción?",
            description: "Esta acción es irreversible.",
            variant: "destructive",
            action: async () => {
                const fd = new FormData();
                fd.append("id", id);
                await deletePromotion(fd);
            }
        });
    }

    const executeConfirmation = async () => {
        try {
            setIsConfirming(true);
            await confirmation.action();
            setConfirmation(prev => ({ ...prev, isOpen: false }));
        } catch (e) {
            alert("Error: " + e);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800">Promociones</h1>
                    <p className="text-stone-500">Administra tus cupones de descuento.</p>
                </div>
                <Button onClick={() => setOpen(true)} className="bg-olive text-white gap-1 whitespace-nowrap">
                    <Plus className="h-4 w-4" /> Nueva Promo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                    <div key={promo.id} className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${promo.isActive ? 'border-stone-100' : 'border-stone-100 opacity-75 bg-stone-50'}`}>
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-olive/10 rounded-full text-olive">
                                <Ticket className="h-6 w-6" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${promo.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {promo.isActive ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold text-stone-900 text-lg">{promo.title}</h3>
                            <p className="font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded w-fit mt-1 text-sm tracking-wider font-bold">
                                {promo.code}
                            </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-stone-100 flex justify-between items-center">
                            <span className="font-bold text-olive text-xl">{promo.discount}% OFF</span>

                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={promo.isActive ? "text-green-600 hover:text-green-700" : "text-stone-400 hover:text-green-600"}
                                    title={promo.isActive ? "Desactivar" : "Activar"}
                                    onClick={() => togglePromotionStatus(promo.id, promo.isActive)}
                                >
                                    <Power className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-stone-400 hover:text-red-600"
                                    onClick={() => handleDelete(promo.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Nueva Promoción</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 pt-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Título de la Campaña</label>
                            <input name="title" required placeholder="Ej. Verano 2025" className="w-full border rounded p-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Código (Cupón)</label>
                                <input name="code" required placeholder="VERANO25" className="w-full border rounded p-2 uppercase" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Descuento (%)</label>
                                <input name="discount" type="number" min="1" max="100" required className="w-full border rounded p-2" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-olive text-white">Crear Cupón</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                open={confirmation.isOpen}
                onOpenChange={(isOpen) => setConfirmation(prev => ({ ...prev, isOpen }))}
                title={confirmation.title}
                description={confirmation.description}
                onConfirm={executeConfirmation}
                isLoading={isConfirming}
                variant={confirmation.variant}
            />
        </div>
    );
}
