"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/productos?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            {isOpen ? (
                <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-stone-200 rounded-full shadow-lg p-1 z-50 animate-fade-in w-64 md:w-80">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 px-3 py-1 bg-transparent focus:outline-none text-sm"
                        autoFocus
                        onBlur={() => !query && setIsOpen(false)}
                    />
                    <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-stone-100">
                        <Search className="h-4 w-4 text-stone-600" />
                    </Button>
                </form>
            ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                    <Search className="h-5 w-5" />
                </Button>
            )}
        </div>

    );
}
