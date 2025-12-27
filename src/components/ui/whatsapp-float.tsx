"use client";

import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export function WhatsAppFloat() {
    const pathname = usePathname();
    if (pathname === "/propuesta") return null;

    return (
        <a
            href="https://wa.me/5492901553173"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-fade-in"
            aria-label="Contactar por WhatsApp"
        >
            <Phone className="h-6 w-6 fill-current" />
        </a>
    );
}
