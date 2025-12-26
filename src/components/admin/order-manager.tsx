"use client";

import { Button } from "@/components/ui/button";
import { Eye, Download, Filter, Package } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type OrderItem = {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        image: string | null;
    };
};

type Order = {
    id: string;
    createdAt: Date;
    total: number;
    status: string;
    user: {
        name: string | null;
        email: string;
    } | null;
    items: OrderItem[];
};

export default function OrderManager({ orders }: { orders: Order[] }) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800">Pedidos</h1>
                    <p className="text-stone-500">Estado de envíos y pagos.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filtros
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Exportar
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">ID Pedido</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-stone-50/50">
                                <td className="px-6 py-4 font-medium text-stone-900">
                                    #{order.id.slice(-6).toUpperCase()}
                                </td>
                                <td className="px-6 py-4 text-stone-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {order.user?.name || order.user?.email || "Invitado"}
                                </td>
                                <td className="px-6 py-4 font-bold text-stone-700">
                                    ${order.total.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                                            order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                                                    order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                        }`}>
                                        {translateStatus(order.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-stone-500 hover:text-olive"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-stone-500">
                                    No hay pedidos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="bg-white sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Detalle del Pedido #{selectedOrder?.id.slice(-6).toUpperCase()}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-stone-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-stone-500">Cliente</p>
                                    <p className="font-medium">{selectedOrder.user?.name || "Invitado"}</p>
                                    <p className="text-stone-400">{selectedOrder.user?.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-stone-500">Fecha</p>
                                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()} {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                                <h3 className="font-serif font-bold text-stone-800">Productos</h3>
                                <div className="divide-y divide-stone-100 border rounded-lg overflow-hidden">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-white items-center">
                                            <div className="h-12 w-12 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                                                {item.product.image ? (
                                                    <div
                                                        className="w-full h-full bg-cover bg-center"
                                                        style={{ backgroundImage: `url('${item.product.image}')` }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                        <Package className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-stone-900">{item.product.name}</p>
                                                <p className="text-xs text-stone-500">{item.quantity} x ${item.price.toLocaleString()}</p>
                                            </div>
                                            <p className="font-bold text-stone-700">
                                                ${(item.quantity * item.price).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                                    <span>Total</span>
                                    <span>${selectedOrder.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function translateStatus(status: string) {
    const map: Record<string, string> = {
        PENDING: "Pendiente",
        PAID: "Pagado",
        SHIPPED: "Enviado",
        DELIVERED: "Entregado",
        CANCELLED: "Cancelado"
    };
    return map[status] || status;
}
