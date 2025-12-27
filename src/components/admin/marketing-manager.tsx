"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, Users, Search } from "lucide-react";
import { sendBroadcast } from "@/actions/marketing-actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
};

export default function MarketingManager({ users }: { users: User[] }) {
    const { toast } = useToast();
    const [mode, setMode] = useState<"all" | "select">("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUser = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleAction = async (formData: FormData) => {
        if (mode === "select" && selectedIds.length === 0) {
            toast({
                title: "Error",
                description: "Debes seleccionar al menos un usuario.",
                variant: "destructive"
            });
            return;
        }

        formData.append("mode", mode);
        if (mode === "select") {
            formData.append("recipientIds", JSON.stringify(selectedIds));
        }

        await sendBroadcast(formData);
        toast({ title: "Enviado", description: "Mensaje enviado correctamente." });
        setSelectedIds([]);
        setMode("all");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-fit">
            <h2 className="font-bold text-lg text-stone-800 mb-4 flex items-center gap-2">
                <Send className="text-olive" /> Nuevo Mensaje Masivo
            </h2>

            <form action={handleAction} className="space-y-6">
                <div>
                    <Label className="mb-2 block">Destinatarios</Label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button
                            type="button"
                            variant={mode === "all" ? "primary" : "outline"}
                            className={mode === "all" ? "bg-olive hover:bg-olive-dark" : ""}
                            onClick={() => setMode("all")}
                        >
                            <Users className="h-4 w-4 mr-2" /> Todos ({users.length})
                        </Button>
                        <Button
                            type="button"
                            variant={mode === "select" ? "primary" : "outline"}
                            className={mode === "select" ? "bg-olive hover:bg-olive-dark" : ""}
                            onClick={() => setMode("select")}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" /> Seleccionar
                        </Button>
                    </div>

                    {mode === "select" && (
                        <div className="border rounded-md p-4 bg-stone-50 animate-fade-in">
                            <div className="relative mb-2">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-stone-400" />
                                <Input
                                    placeholder="Buscar usuario..."
                                    className="pl-8 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto space-y-1">
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-2 p-2 hover:bg-stone-100 rounded cursor-pointer"
                                        onClick={() => toggleUser(user.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(user.id)}
                                            readOnly
                                            className="rounded border-stone-300 text-olive focus:ring-olive"
                                        />
                                        <div className="text-sm">
                                            <p className="font-medium text-stone-900 leading-none">{user.name || "Sin Nombre"}</p>
                                            <p className="text-xs text-stone-500">{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-stone-500 mt-2 text-right">
                                {selectedIds.length} seleccionados
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <Label className="mb-1 block">Asunto</Label>
                    <Input name="subject" required placeholder="Ej: ¡Ofertas de Verano!" />
                </div>

                <div>
                    <Label className="mb-1 block">Mensaje</Label>
                    <textarea
                        name="message"
                        required
                        rows={5}
                        className="w-full border border-stone-200 rounded-md p-2 focus:ring-1 focus:ring-olive focus:outline-none text-sm"
                        placeholder="Escribí tu novedad aquí..."
                    />
                </div>

                <Button type="submit" className="w-full bg-stone-900 text-white hover:bg-black">
                    <Send className="h-4 w-4 mr-2" /> Enviar Mensaje
                </Button>
            </form>
        </div>
    );
}
