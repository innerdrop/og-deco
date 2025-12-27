"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tag,
    LogOut,
    Menu,
    X,
    FolderTree,
    Settings,
    Users,
    Mail
} from "lucide-react";
import { signOutAction } from "@/actions/auth-actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menu = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Productos", href: "/admin/products", icon: Package },
        { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
        { name: "Clientes", href: "/admin/customers", icon: Users },
        { name: "Marketing", href: "/admin/marketing", icon: Mail },
        { name: "Promociones", href: "/admin/promotions", icon: Tag },
        { name: "Configuración", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-stone-50 flex transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 md:translate-x-0 md:static",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-stone-100 flex justify-between items-center h-16">
                    <span className="text-xl font-serif font-bold text-olive-dark">OG Admin</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-stone-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menu.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                                    isActive
                                        ? "bg-olive/10 text-olive"
                                        : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-stone-100">
                    <form action={signOutAction}>
                        <button className="flex w-full items-center gap-3 px-4 py-3 text-stone-500 hover:text-red-500 transition-colors text-sm font-medium">
                            <LogOut className="h-5 w-5" /> Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-stone-50 text-stone-900 w-full">
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
                    <span className="font-serif font-bold text-olive-dark">OG Admin</span>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-stone-800 p-2">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>
                <div className="p-4 md:p-8 w-full max-w-full overflow-x-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
