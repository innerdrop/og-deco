"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Check if exists, might need creating
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need to check/create tabs
import {
    Calculator,
    Ruler,
    Plus,
    Trash2,
    Save,
    Palette,
    Settings
} from "lucide-react";
import {
    updateGlobalSettings,
    createQuoterCategory,
    deleteQuoterCategory,
    createQuoterOption,
    deleteQuoterOption
} from "@/actions/settings-actions";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function SettingsManager({ settings, categories }: { settings: any, categories: any[] }) {
    const { toast } = useToast();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<() => void>(() => { });

    // Financial Calculator State
    const [calcCost, setCalcCost] = useState(10000);
    const [calcMargin, setCalcMargin] = useState(40);
    const calcPrice = calcCost * (1 + calcMargin / 100);

    const handleSaveGlobal = async (formData: FormData) => {
        setPendingAction(() => async () => {
            await updateGlobalSettings(formData);
            toast({ title: "Guardado", description: "Configuración global actualizada." });
        });
        setIsSaveModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-stone-800">Configuración</h1>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general" className="flex gap-2"><Ruler className="h-4 w-4" /> Cotizador & Límites</TabsTrigger>
                    <TabsTrigger value="quoter" className="flex gap-2"><Palette className="h-4 w-4" /> Opciones de Personalización</TabsTrigger>
                    <TabsTrigger value="financial" className="flex gap-2"><Calculator className="h-4 w-4" /> Finanzas</TabsTrigger>
                </TabsList>

                {/* --- Tab 1: Global Limits --- */}
                <TabsContent value="general">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                            <Settings className="text-olive" /> Límites del Sistema
                        </h2>
                        <form action={handleSaveGlobal} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Ancho Mínimo (cm)</label>
                                    <Input name="minWidth" type="number" defaultValue={settings?.minWidth || 50} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Ancho Máximo (cm)</label>
                                    <Input name="maxWidth" type="number" defaultValue={settings?.maxWidth || 400} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Alto Mínimo (cm)</label>
                                    <Input name="minHeight" type="number" defaultValue={settings?.minHeight || 50} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Alto Máximo (cm)</label>
                                    <Input name="maxHeight" type="number" defaultValue={settings?.maxHeight || 300} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-stone-100 flex justify-end">
                                <Button type="submit" className="bg-stone-900 text-white gap-2">
                                    <Save className="h-4 w-4" /> Guardar Cambios Globales
                                </Button>
                            </div>
                        </form>
                    </div>

                </TabsContent>

                {/* --- Tab 2: Quoter Configuration --- */}
                <TabsContent value="quoter" className="space-y-6">
                    {/* Add Category */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <h3 className="font-bold text-lg mb-4">Nueva Categoría de Opción</h3>
                        <form action={createQuoterCategory} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Nombre (ej: Tela, Sistema, Ambiente)</label>
                                <Input name="name" required placeholder="Nombre de la categoría" />
                            </div>
                            <Button type="submit" className="bg-olive text-white gap-2">
                                <Plus className="h-4 w-4" /> Agregar
                            </Button>
                        </form>
                    </div>

                    {/* List Categories & Options */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h3 className="font-bold text-stone-800">{cat.name}</h3>
                                    <form action={() => deleteQuoterCategory(cat.id)}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>

                                {/* Options List */}
                                <div className="space-y-2 max-h-[200px] overflow-y-auto mb-4">
                                    {cat.options.map((opt: any) => (
                                        <div key={opt.id} className="flex justify-between items-center text-sm p-2 bg-stone-50 rounded">
                                            <span>{opt.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-stone-600">
                                                    {opt.isPercentage ? `+${opt.priceMod}%` : `+$${opt.priceMod}`}
                                                </span>
                                                <form action={() => deleteQuoterOption(opt.id)}>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-stone-400 hover:text-red-500">
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                    {cat.options.length === 0 && <p className="text-xs text-stone-400 italic">Sin opciones.</p>}
                                </div>

                                {/* Add Option Form */}
                                <form action={createQuoterOption} className="space-y-3 pt-4 border-t">
                                    <input type="hidden" name="categoryId" value={cat.id} />
                                    <Input name="name" placeholder="Nueva opción (ej: Lino)" className="h-8 text-sm" required />
                                    <Input name="image" placeholder="URL de imagen (opcional)" className="h-8 text-sm" />
                                    <div className="flex gap-2">
                                        <Input name="priceMod" type="number" placeholder="Costo Extra" className="h-8 text-sm" required />
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="isPercentage" id={`perc-${cat.id}`} className="rounded border-stone-300" />
                                            <label htmlFor={`perc-${cat.id}`} className="text-xs text-stone-500">%</label>
                                        </div>
                                    </div>
                                    <Button size="sm" type="submit" className="w-full bg-stone-100 text-stone-900 hover:bg-stone-200 h-8">
                                        <Plus className="h-3 w-3 mr-2" /> Agregar Opción
                                    </Button>
                                </form>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Tab 3: Financials --- */}
                <TabsContent value="financial">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Calculator */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                                <Calculator className="text-olive" /> Calculadora de Precios Avanzada
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-stone-600 mb-1 block">Materiales ($)</label>
                                        <Input
                                            type="number"
                                            value={calcCost}
                                            onChange={(e) => setCalcCost(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-stone-600 mb-1 block">Mano de Obra ($)</label>
                                        <Input
                                            type="number" defaultValue={2000}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-stone-600 mb-1 block">Gastos Fijos (%)</label>
                                        <Input
                                            type="number" defaultValue={10}
                                            className="bg-stone-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-stone-600 mb-1 block">Impuestos / IVA (%)</label>
                                        <Input
                                            type="number" defaultValue={21}
                                            className="bg-stone-50"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-stone-100 my-4 pt-4">
                                    <label className="text-sm font-medium text-stone-600 mb-1 block">Margen de Ganancia (%)</label>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            type="range" min="0" max="200" step="5"
                                            value={calcMargin}
                                            onChange={(e) => setCalcMargin(Number(e.target.value))}
                                            className="flex-1 accent-olive h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="font-bold w-12 text-right text-stone-800">{calcMargin}%</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-green-50 rounded-lg border border-green-100 mt-6 space-y-2">
                                    <div className="flex justify-between items-center text-sm text-green-800/70">
                                        <span>Costo Total:</span>
                                        <span>${(calcCost + 2000).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-green-800/70">
                                        <span>Precio antes de Impuestos:</span>
                                        <span>${(calcPrice).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-green-200 pt-2">
                                        <span className="text-green-900 font-bold">Precio Final Sugerido:</span>
                                        <span className="text-2xl font-bold text-green-700">${(calcPrice * 1.21).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                            <h3 className="font-bold text-stone-800 mb-2">Estructura de Costos</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-stone-600">
                                <li><strong>Materiales:</strong> Insumos directos (telas, sistemas).</li>
                                <li><strong>Mano de Obra:</strong> Costo por hora/confección.</li>
                                <li><strong>Gastos Fijos:</strong> Porcentaje para cubrir luz, alquiler, etc.</li>
                                <li><strong>Margen:</strong> Tu ganancia neta sobre el costo.</li>
                            </ul>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <ConfirmationModal
                open={isSaveModalOpen}
                onOpenChange={setIsSaveModalOpen}
                onConfirm={() => {
                    pendingAction();
                    setIsSaveModalOpen(false);
                }}
                title="¿Guardar Configuración?"
                description="Estos cambios afectarán a todos los nuevos presupuestos y cotizaciones."
            />
        </div>
    );
}
