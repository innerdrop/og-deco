"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

export function BackToProposalButton() {
    const pathname = usePathname();

    // Don't show on proposal page itself
    if (pathname === "/propuesta") {
        return null;
    }

    return (
        <Link
            href="/propuesta"
            className="fixed left-3 sm:left-4 top-36 sm:top-28 z-40 flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-amber-600 text-white text-sm sm:text-base rounded-full shadow-lg hover:bg-amber-700 hover:scale-105 transition-all animate-pulse"
            title="Volver a la Propuesta"
        >
            <FileText className="h-4 w-4" />
            <span className="font-semibold">
                Ver Propuesta
            </span>
        </Link>
    );
}
