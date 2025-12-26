import { prisma } from "@/lib/prisma";
import { History, Mail } from "lucide-react";
import MarketingManager from "@/components/admin/marketing-manager";

export default async function MarketingPage() {
    const broadcasts = await prisma.broadcast.findMany({
        orderBy: { sentAt: "desc" }
    });

    const users = await prisma.user.findMany({
        where: { role: "USER" },
        select: { id: true, name: true, email: true, phone: true }
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-800">Marketing</h1>
                    <p className="text-stone-500">Comunicación con tus clientes.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Send Message Form */}
                <MarketingManager users={users} />

                {/* History */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden h-fit">
                    <div className="p-6 border-b border-stone-100">
                        <h2 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                            <History className="text-stone-400" /> Historial de Envíos
                        </h2>
                    </div>
                    <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
                        {broadcasts.length > 0 ? broadcasts.map((msg) => (
                            <div key={msg.id} className="p-4 hover:bg-stone-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-stone-900">{msg.subject}</h3>
                                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                                        {new Date(msg.sentAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-stone-600 line-clamp-2 mb-2">{msg.message}</p>
                                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                    <Mail className="h-3 w-3" /> Enviado a {msg.recipients} destinatarios
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-stone-500">
                                No has enviado mensajes aún.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
