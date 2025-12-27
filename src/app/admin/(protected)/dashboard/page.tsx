import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardOverview() {
    const [
        totalRevenue,
        ordersCount,
        productsCount,
        customersCount,
        recentOrders
    ] = await Promise.all([
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: "CANCELLED" } }
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: true, items: { include: { product: true } } }
        })
    ]);

    const revenue = totalRevenue._sum.total || 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-stone-800">Panel de Control</h1>
                <Link href="/admin/products">
                    <Button className="bg-olive text-white shadow-sm gap-1 whitespace-nowrap">
                        <Package className="h-4 w-4" /> Nuevo Producto
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Ventas Totales", value: `$${revenue.toLocaleString()}`, icon: DollarSign, trend: "Actual" },
                    { label: "Pedidos", value: ordersCount.toString(), icon: ShoppingBag, trend: "Total" },
                    { label: "Productos", value: productsCount.toString(), icon: Package, trend: "Activos" },
                    { label: "Clientes", value: customersCount.toString(), icon: Users, trend: "Registrados" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-olive/10 rounded-lg text-olive">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900">{stat.value}</h3>
                        <p className="text-sm text-stone-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="font-bold text-stone-800 text-lg">Pedidos Recientes</h2>
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="text-sm text-olive">Ver todos</Button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-stone-50 text-stone-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-stone-50/50">
                                    <td className="px-6 py-4 font-medium text-stone-900">#{order.id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4">{order.user?.name || order.user?.email || "Invitado"}</td>
                                    <td className="px-6 py-4">{order.items.length} productos</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                                                order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                                                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                                                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-stone-700">${order.total.toLocaleString()}</td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-stone-500">No hay pedidos recientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

