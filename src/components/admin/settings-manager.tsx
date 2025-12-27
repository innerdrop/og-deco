"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calculator,
    Ruler,
    Plus,
    Trash2,
    Save,
    Palette,
    Settings,
    Pencil,
    Wand2,
    ImageIcon
} from "lucide-react";
import {
    updateGlobalSettings,
    createQuoterCategory,
    deleteQuoterCategory,
    createQuoterOption,
    deleteQuoterOption,
    updateQuoterCategory,
    updateQuoterOption,
    initializeQuoterDefaults
} from "@/actions/settings-actions";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function SettingsManager({ settings, categories }: { settings: any, categories: any[] }) {
    const { toast } = useToast();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<() => void>(() => { });

    // Editing States
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [editingOption, setEditingOption] = useState<any>(null);

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

    const handleInitializeDefaults = async () => {
        await initializeQuoterDefaults();
        toast({ title: "Inicializado", description: "Se han cargado ambientes y telas de ejemplo." });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-stone-800">Configuración</h1>
            </div>

            <Tabs defaultValue="quoter" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general" className="flex gap-2"><Ruler className="h-4 w-4" /> Límites</TabsTrigger>
                    <TabsTrigger value="quoter" className="flex gap-2"><Palette className="h-4 w-4" /> Cotizador Personal</TabsTrigger>
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
                    {/* Header Actions */}
                    <div className="flex justify-between items-center bg-olive/10 p-4 rounded-lg border border-olive/20">
                        <div>
                            <h3 className="font-bold text-olive-dark">Configuración del Cotizador</h3>
                            <p className="text-sm text-stone-600">Define las opciones disponibles para tus clientes.</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleInitializeDefaults}
                            className="bg-white border-olive text-olive hover:bg-olive hover:text-white transition-colors gap-2"
                        >
                            <Wand2 className="h-4 w-4" /> Inicializar Ejemplos
                        </Button>
                    </div>

                    {/* Add Category */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <h3 className="font-bold text-lg mb-4">Nueva Categoría Global</h3>
                        <form action={createQuoterCategory} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Nombre (ej: Tipo de Riel)</label>
                                <Input name="name" required placeholder="Nombre de la categoría" />
                            </div>
                            <Button type="submit" className="bg-stone-800 text-white gap-2">
                                <Plus className="h-4 w-4" /> Crear
                            </Button>
                        </form>
                    </div>

                    {/* List Categories & Options */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-stone-800 text-lg">{cat.name}</h3>
                                        <button
                                            onClick={() => setEditingCategory(cat)}
                                            className="text-stone-400 hover:text-olive transition-colors"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <form action={() => deleteQuoterCategory(cat.id)}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>

                                {/* Options List */}
                                <div className="space-y-2 flex-grow mb-4 overflow-y-auto max-h-[300px] pr-2">
                                    {cat.options.map((opt: any) => (
                                        <div key={opt.id} className="flex justify-between items-center text-sm p-3 bg-stone-50 rounded-lg border border-stone-100 hover:border-olive/30 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-stone-800">{opt.name}</span>
                                                    <span className="text-xs text-stone-500 font-mono">
                                                        {opt.isPercentage ? `+${opt.priceMod}%` : `+$${opt.priceMod.toLocaleString()}`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-stone-400 hover:text-olive"
                                                    onClick={() => setEditingOption(opt)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <form action={() => deleteQuoterOption(opt.id)}>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-stone-400 hover:text-red-500">
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                    {cat.options.length === 0 && <p className="text-sm text-stone-400 italic text-center py-4">No hay opciones cargadas.</p>}
                                </div>

                                {/* Add Option Form */}
                                <form action={createQuoterOption} className="space-y-3 pt-4 border-t border-stone-100 mt-auto">
                                    <input type="hidden" name="categoryId" value={cat.id} />
                                    <div className="grid grid-cols-[1fr_auto] gap-2">
                                        <Input name="name" placeholder="Nueva opción" className="h-9 text-sm" required />
                                        <Input name="priceMod" type="number" placeholder="$ Extra" className="h-9 text-sm w-24" required />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="isPercentage" id={`perc-${cat.id}`} className="rounded border-stone-300 text-olive focus:ring-olive" />
                                            <label htmlFor={`perc-${cat.id}`} className="text-xs text-stone-600">Es Porcentaje (%)</label>
                                        </div>
                                        <Button size="sm" type="submit" className="bg-stone-100 text-stone-900 hover:bg-olive hover:text-white h-8 text-xs px-3 transition-colors">
                                            <Plus className="h-3 w-3 mr-1" /> Agregar
                                        </Button>
                                    </div>
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

            {/* --- Modals --- */}

            {/* Confirmation Modal */}
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

            {/* Edit Category Modal */}
            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoría</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                        <form
                            action={(formData) => {
                                updateQuoterCategory(editingCategory.id, formData);
                                setEditingCategory(null);
                                toast({ title: "Actualizado", description: "Categoría actualizada correctamente." });
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre</label>
                                <Input name="name" defaultValue={editingCategory.name} required />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>Cancelar</Button>
                                <Button type="submit" className="bg-olive text-white">Guardar</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Option Modal */}
            <Dialog open={!!editingOption} onOpenChange={(open) => !open && setEditingOption(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Opción</DialogTitle>
                    </DialogHeader>
                    {editingOption && (
                        <form
                            action={(formData) => {
                                updateQuoterOption(editingOption.id, formData);
                                setEditingOption(null);
                                toast({ title: "Actualizado", description: "Opción actualizada correctamente." });
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre</label>
                                <Input name="name" defaultValue={editingOption.name} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Precio / Modificador</label>
                                <Input name="priceMod" type="number" defaultValue={editingOption.priceMod} required />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isPercentage"
                                    id="edit-perc"
                                    defaultChecked={editingOption.isPercentage}
                                    className="rounded border-stone-300 text-olive focus:ring-olive"
                                />
                                <label htmlFor="edit-perc" className="text-sm text-stone-600">Es Porcentaje (%)</label>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingOption(null)}>Cancelar</Button>
                                <Button type="submit" className="bg-olive text-white">Guardar</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
