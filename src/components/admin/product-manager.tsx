"use client";

import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { createProduct, deleteProduct, updateProduct } from "@/actions/product-actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

// Types for props
type Product = {
    id: string;
    name: string;
    category: { id: string; name: string };
    price: number;
    image: string | null;
    stock: number;
    description: string | null;
    categoryId: string;
};

type Category = {
    id: string;
    name: string;
}

type ConfirmationState = {
    isOpen: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    variant?: "destructive" | "default";
};

export default function ProductManager({ products, categories }: { products: Product[], categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Confirmation State
    const [confirmation, setConfirmation] = useState<ConfirmationState>({
        isOpen: false,
        title: "",
        description: "",
        action: async () => { },
    });
    const [isConfirming, setIsConfirming] = useState(false);

    // Temp Form Data Ref
    const formRef = useRef<HTMLFormElement>(null);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setOpen(true);
    };

    // Prepare Delete Confirmation
    const requestDelete = (product: Product) => {
        setConfirmation({
            isOpen: true,
            title: "¿Eliminar producto?",
            description: `Estás a punto de eliminar "${product.name}". Esta acción no se puede deshacer.`,
            variant: "destructive",
            action: async () => {
                const formData = new FormData();
                formData.append("id", product.id);
                await deleteProduct(formData);
            }
        });
    };

    // Prepare Save Confirmation
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const isEdit = !!editingProduct;
        const productName = formData.get("name") as string;

        setConfirmation({
            isOpen: true,
            title: isEdit ? "¿Guardar cambios?" : "¿Crear producto?",
            description: isEdit
                ? `Se actualizará la información del producto "${productName}".`
                : `Se creará el nuevo producto "${productName}" en el catálogo.`,
            variant: "default",
            action: async () => {
                if (isEdit && editingProduct) {
                    formData.append("id", editingProduct.id);
                    await updateProduct(formData);
                } else {
                    await createProduct(formData);
                }
                setOpen(false); // Close the edit modal after success
            }
        });
    };

    // Execute Confirmed Action
    const executeConfirmation = async () => {
        try {
            setIsConfirming(true);
            await confirmation.action();
            setConfirmation(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            console.error("Error executing action:", error);
        } finally {
            setIsConfirming(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800">Productos</h1>
                    <p className="text-stone-500">Gestioná tu catálogo y stock.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 w-full rounded-md border border-stone-200 focus:outline-none focus:ring-1 focus:ring-olive"
                        />
                    </div>

                    <Button onClick={handleCreate} className="bg-olive text-white gap-2">
                        <Plus className="h-4 w-4" /> Nuevo
                    </Button>
                    {/* Dialog code omitted for brevity as it is unchanged */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                            </DialogHeader>
                            <form
                                ref={formRef}
                                onSubmit={handleFormSubmit}
                                className="space-y-4 pt-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre</label>
                                    <input name="name" defaultValue={editingProduct?.name} required className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Precio</label>
                                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stock</label>
                                    <input name="stock" type="number" defaultValue={editingProduct?.stock || 10} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Categoría</label>
                                    <select name="categoryId" defaultValue={editingProduct?.categoryId} className="w-full border rounded p-2">
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Imagen del Producto</label>
                                    <input
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="w-full border rounded p-2 text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-olive/10 file:text-olive hover:file:bg-olive/20"
                                    />
                                    {editingProduct?.image && (
                                        <div className="mt-2 text-xs text-stone-500">
                                            Imagen actual: <a href={editingProduct.image} target="_blank" className="text-olive underline">Ver imagen</a>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Descripción</label>
                                    <textarea name="description" defaultValue={editingProduct?.description || ''} className="w-full border rounded p-2" />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                                    <Button type="submit" className="bg-olive text-white">Guardar</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-stone-50 text-stone-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Imagen</th>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-stone-50/50">
                                    <td className="px-6 py-4">
                                        <div className="h-10 w-10 rounded bg-stone-100 overflow-hidden shrink-0">
                                            {product.image && (
                                                <div
                                                    className="w-full h-full bg-cover bg-center"
                                                    style={{ backgroundImage: `url('${product.image}')` }}
                                                />
                                            )}

                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-stone-900">{product.name}</td>
                                    <td className="px-6 py-4 capitalize">{product.category.name}</td>
                                    <td className="px-6 py-4">${product.price.toLocaleString('es-AR')}</td>
                                    <td className="px-6 py-4">
                                        {product.stock > 0 ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                                                {product.stock} un.
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                                Sin Stock
                                            </span>
                                        )}

                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-stone-500 hover:text-olive"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-stone-500 hover:text-red-500"
                                                onClick={() => requestDelete(product)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Global Confirmation Modal */}
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
