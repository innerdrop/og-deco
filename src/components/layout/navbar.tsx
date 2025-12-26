"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/productos" },
        { name: "Cortinas a Medida", href: "/cotizador" },
        { name: "Nosotros", href: "/nosotros" },
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-olive text-white w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xl group-hover:bg-olive-dark transition-colors">
                        OG
                    </div>
                    <span className="font-serif font-bold text-xl text-stone-800 tracking-tight">OG Decoraciones</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-stone-600 hover:text-olive transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="text-stone-500 hover:text-olive transition-colors">
                        <Search className="h-5 w-5" />
                    </button>
                    <Link href="/cart">
                        <div className="relative text-stone-500 hover:text-olive transition-colors">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-olive text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
                        </div>
                    </Link>

                    <a
                        href="https://wa.me/5492901123456"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:block"
                    >
                        <Button className="bg-olive hover:bg-olive-dark text-white rounded-full px-6">
                            Consultar via WhatsApp
                        </Button>
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-stone-800"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-stone-100 bg-white absolute w-full left-0 animate-fade-in shadow-xl">
                    <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-stone-800 py-2 border-b border-stone-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a
                            href="https://wa.me/5492901123456"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4"
                        >
                            <Button className="w-full bg-olive hover:bg-olive-dark text-white h-12 text-lg">
                                Consultar via WhatsApp
                            </Button>
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
