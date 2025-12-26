"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Download, Search, Mail, Plus, UserPlus, CheckSquare, Square } from "lucide-react";
import { createCustomer } from "@/actions/customer-actions";
import { useToast } from "@/hooks/use-toast";

type Customer = {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    createdAt: Date;
    _count: { orders: number };
};

export default function CustomerManager({ customers }: { customers: Customer[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    // 1. Filtering
    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    // 2. Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredCustomers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredCustomers.map(c => c.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // 3. Export Logic
    const handleExport = () => {
        const dataToExport = selectedIds.length > 0
            ? filteredCustomers.filter(c => selectedIds.includes(c.id))
            : filteredCustomers;

        const csvContent = [
            ["Nombre", "Email", "Telefono", "Pedidos", "Fecha Registro"], // Headers
            ...dataToExport.map(c => [
                c.name || "",
                c.email,
                c.phone || "",
                c._count.orders,
                new Date(c.createdAt).toLocaleDateString()
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `clientes_ogdeco_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        toast({ title: "Exportación lista", description: "El archivo CSV se ha descargado." });
    };

    // 4. Create Logic
    const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.currentTarget);
        try {
            await createCustomer(formData);
            toast({ title: "Cliente creado", description: "El cliente se ha añadido correctamente." });
            setIsCreateOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "No se pudo crear el cliente.", variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800">Clientes</h1>
                    <p className="text-stone-500">Gestión de base de datos de compradores.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        {selectedIds.length > 0 ? `Exportar (${selectedIds.length})` : "Exportar Todo"}
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-olive text-white gap-2">
                        <UserPlus className="h-4 w-4" /> Nuevo Cliente
                    </Button>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <Input
                            placeholder="Buscar por nombre, email o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white border-stone-200"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-stone-50">
                            <TableRow>
                                <TableHead className="w-[50px] text-center">
                                    <button onClick={toggleSelectAll} className="opacity-50 hover:opacity-100">
                                        {selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0
                                            ? <CheckSquare className="h-4 w-4 text-olive" />
                                            : <Square className="h-4 w-4" />}
                                    </button>
                                </TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead>Pedidos</TableHead>
                                <TableHead>Registrado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map((customer) => (
                                <TableRow key={customer.id} className={selectedIds.includes(customer.id) ? "bg-olive/5" : ""}>
                                    <TableCell className="text-center">
                                        <button onClick={() => toggleSelect(customer.id)}>
                                            {selectedIds.includes(customer.id)
                                                ? <CheckSquare className="h-4 w-4 text-olive" />
                                                : <Square className="h-4 w-4 text-stone-300" />}
                                        </button>
                                    </TableCell>
                                    <TableCell className="font-medium text-stone-900">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold uppercase text-xs">
                                                {customer.name?.slice(0, 2) || "NN"}
                                            </div>
                                            {customer.name || "Sin Nombre"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{customer.email}</span>
                                            <span className="text-xs text-stone-400">{customer.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-800">
                                            {customer._count.orders}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-stone-500">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-stone-500 hover:text-olive">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                                        No se encontraron clientes.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Customer Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Nuevo Cliente Manual</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Nombre Completo</label>
                            <Input name="name" required placeholder="Ej: Juan Perez" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Email</label>
                            <Input name="email" type="email" required placeholder="juan@ejemplo.com" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Teléfono</label>
                            <Input name="phone" placeholder="+54 9 ..." />
                        </div>
                        <p className="text-xs text-stone-400 bg-yellow-50 p-2 rounded border border-yellow-100">
                            Nota: Se creará una clave por defecto para este usuario.
                        </p>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-olive text-white" disabled={isCreating}>
                                {isCreating ? "Guardando..." : "Crear Cliente"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
