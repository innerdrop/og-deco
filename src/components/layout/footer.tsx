import Link from "next/link"
import { Facebook, Instagram, MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-olive-dark text-beige">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-xl font-serif font-bold text-white">OG Decoraciones</h3>
                        <p className="text-sm text-stone-300 max-w-xs">
                            Tu casa es tu templo. Decoración pensada para el clima y la luz de Ushuaia, Tierra del Fuego.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-white">Categorías</h4>
                        <ul className="space-y-2 text-sm text-stone-300">
                            <li><Link href="/shop?cat=cortinas" className="hover:text-white">Cortinas & Rollers</Link></li>
                            <li><Link href="/shop?cat=pisos" className="hover:text-white">Pisos Flotantes</Link></li>
                            <li><Link href="/shop?cat=plantas" className="hover:text-white">Plantas & Macetas</Link></li>
                            <li><Link href="/shop?cat=textil" className="hover:text-white">Vajilla & Textil</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-white">Ayuda</h4>
                        <ul className="space-y-2 text-sm text-stone-300">
                            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
                            <li><Link href="/nosotros" className="hover:text-white">Sobre Nosotros</Link></li>
                            <li><Link href="/cotizador" className="hover:text-white">Solicitar Presupuesto</Link></li>
                            <li><Link href="#" className="hover:text-white">Envíos y Devoluciones</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-white">Visitanos</h4>
                        <ul className="space-y-3 text-sm text-stone-300">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                <span>Primer Argentino 221,<br />Ushuaia, Tierra del Fuego</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>+54 9 2901 123456</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>contacto@ogdecoraciones.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-stone-600/50 pt-8 text-center text-xs text-stone-400">
                    © {new Date().getFullYear()} OG Decoraciones. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}
