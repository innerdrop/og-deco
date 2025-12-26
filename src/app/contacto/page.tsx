import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen flex flex-col bg-beige">
            <Navbar />
            <div className="container mx-auto px-4 md:px-6 py-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-olive-dark mb-12 text-center">Contacto</h1>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm h-fit">
                        <h2 className="text-2xl font-serif font-bold text-stone-800">Estamos en contacto</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="text-olive h-6 w-6 mt-1" />
                                <div>
                                    <h3 className="font-bold text-stone-900">Dirección</h3>
                                    <p className="text-stone-600">Primer Argentino 221,<br />Ushuaia, Tierra del Fuego</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="text-olive h-6 w-6 mt-1" />
                                <div>
                                    <h3 className="font-bold text-stone-900">WhatsApp</h3>
                                    <p className="text-stone-600">+54 9 2901 123456</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="text-olive h-6 w-6 mt-1" />
                                <div>
                                    <h3 className="font-bold text-stone-900">Email</h3>
                                    <p className="text-stone-600">contacto@ogdecoraciones.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="text-olive h-6 w-6 mt-1" />
                                <div>
                                    <h3 className="font-bold text-stone-900">Horarios</h3>
                                    <p className="text-stone-600">Lines a Sábado: 10:00 - 20:00 hs</p>
                                </div>
                            </div>
                        </div>

                        <div className="aspect-video w-full bg-stone-200 rounded-lg mt-8 relative overflow-hidden">
                            {/* Map Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center bg-stone-300 text-stone-500 font-medium">
                                Google Maps Mockup
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Envianos tu consulta</h2>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Nombre</label>
                                    <input type="text" className="w-full h-10 rounded-md border border-stone-200 px-3 focus:outline-none focus:ring-1 focus:ring-olive" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Apellido</label>
                                    <input type="text" className="w-full h-10 rounded-md border border-stone-200 px-3 focus:outline-none focus:ring-1 focus:ring-olive" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">Email</label>
                                <input type="email" className="w-full h-10 rounded-md border border-stone-200 px-3 focus:outline-none focus:ring-1 focus:ring-olive" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">Teléfono</label>
                                <input type="tel" className="w-full h-10 rounded-md border border-stone-200 px-3 focus:outline-none focus:ring-1 focus:ring-olive" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700">Mensaje</label>
                                <textarea className="w-full min-h-[120px] rounded-md border border-stone-200 p-3 focus:outline-none focus:ring-1 focus:ring-olive" />
                            </div>
                            <Button size="lg" className="w-full bg-olive hover:bg-olive-dark text-white">Enviar Mensaje</Button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
