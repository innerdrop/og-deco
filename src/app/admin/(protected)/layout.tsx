"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-stone-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <span className="text-xl font-serif font-bold text-olive-dark">OG Admin</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menu.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
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
            <div className="flex-1 overflow-auto bg-stone-50 text-stone-900">
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 md:hidden">
                    <span className="font-serif font-bold text-olive-dark">OG Admin</span>
                    {/* Mobile menu logic would go here */}
                </header>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
