"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, ShoppingCart, Lock, Plus, MessageSquare, PenTool, CreditCard, User, Globe, Instagram, Heart, Clock, AlertCircle, TrendingUp, ShieldCheck, Smartphone, Zap, Calendar, FileText, Bot, Database, Info, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

// --- DATA: FEATURES & PACKAGES ---

type Feature = {
    id: string;
    title: string;
    icon: any;
    short: string;
    full_description: string;
    benefits: string[];
};

const FEATURES: Record<string, Feature> = {
    "web": {
        id: "web",
        title: "Web Institucional & Hosting",
        icon: Globe,
        short: "Diseño profesional y presencia digital base.",
        full_description: "Desarrollo de un sitio web moderno, rápido y adaptado a celulares. Incluye la página de inicio (Home), sección 'Nosotros', 'Contacto' y la infraestructura técnica (Hosting de alta velocidad + Dominio .com) por un año.",
        benefits: ["Imagen profesional ante el cliente.", "Aparición en Google (SEO básico).", "Carga instantánea en celulares."]
    },
    // Variante 1: Vidriera (Sin precios)
    "catalog_view": {
        id: "catalog_view",
        title: "Vidriera Digital (Sin Precios)",
        icon: ShoppingCart,
        short: "Exhibición de productos. Botón 'Consultar'.",
        full_description: "Un catálogo interactivo donde sus clientes pueden ver fotos y descripciones técnicas. NO muestra precios para obligar a la consulta por WhatsApp.",
        benefits: ["Ideal para filtrar curiosos.", "Fomenta el contacto directo.", "Protege su estrategia de precios."]
    },
    // Variante 2: Catálogo Full (Con precios)
    "catalog_full": {
        id: "catalog_full",
        title: "Catálogo E-commerce (Precios Visibles)",
        icon: ShoppingCart,
        short: "Experiencia de compra completa con precios.",
        full_description: "Muestra precios actualizados y permite la compra directa, eliminando la necesidad de preguntar '¿Cuánto sale?'.",
        benefits: ["Venta 100% automática.", "Menos consultas obvias.", "Experiencia de usuario moderna."]
    },
    "admin": {
        id: "admin",
        title: "Panel de Gestión (Admin)",
        icon: Lock,
        short: "Control total de productos y stock.",
        full_description: "Una oficina virtual privada. Desde aquí usted podrá crear nuevos productos, pausar los que no tengan stock, cambiar fotos y descripciones sin depender de un programador.",
        benefits: ["Independencia total.", "Gestión desde el celular.", "Control de inventario."]
    },
    "users": {
        id: "users",
        title: "Cuentas de Cliente",
        icon: User,
        short: "Registro y base de datos de compradores.",
        full_description: "Permite que los visitantes se registren, guarden sus direcciones de envío y vean sus pedidos anteriores.",
        benefits: ["Fidelización de marca.", "Datos para marketing futuro.", "Agiliza la recompra."]
    },
    "cart_direct": {
        id: "cart_direct",
        title: "Carrito de Compra Web",
        icon: ShoppingCart,
        short: "Gestión de pedido 100% en el sitio.",
        full_description: "A diferencia del carrito básico de WhatsApp, este módulo permite al cliente seleccionar productos, ver el resumen, calcular envío y completar la compra directamente en la web sin hablar con nadie si no lo desea.",
        benefits: ["Independencia total del vendedor.", "Ventas mientras usted duerme.", "Proceso profesional fluido."]
    },
    "quoter": {
        id: "quoter",
        title: "Cotizador Automático (AI)",
        icon: PenTool,
        short: "Calcula precios de cortinas por m² al instante.",
        full_description: "La estrella del sistema. Un algoritmo a medida que permite al cliente ingresar Ancho x Alto y Tela, y recibir el precio exacto al instante. Incluye lógica de desperdicios y mínimos.",
        benefits: ["Ahorra horas de calcular presupuestos manuales.", "Captura al cliente ansioso a cualquier hora.", "Reduce la fricción de venta a cero."]
    },
    "payments": {
        id: "payments",
        title: "Pasarela de Pagos Completa",
        icon: CreditCard,
        short: "MercadoPago, Tarjetas y Transferencia.",
        full_description: "Integración con los medios de pago más usados en Argentina: Mercado Pago (QR, Dinero en cuenta), Tarjetas de Crédito/Débito (Ahora 3/6/12 si aplica) y módulo para reportar Transferencias Bancarias con comprobante.",
        benefits: ["Cobro automático y seguro.", "Ofrece financiación a sus clientes.", "Validación de transferencias."]
    }
};

const FUTURE_FEATURES = [
    { icon: Smartphone, title: "App Móvil (PWA)", desc: "Icono instalable en el celular de sus clientes para acceso directo." },
    { icon: FileText, title: "Facturación AFIP", desc: "Emisión de factura electrónica automática al confirmar la compra." },
    { icon: Calendar, title: "Turnos de Instalación", desc: "Sistema de reservas para visitas de medición y colocación." },
    { icon: Bot, title: "Chatbot IA Avanzado", desc: "Respuestas automáticas inteligentes a preguntas frecuentes sobre telas y medidas." }
];

const PACKAGES = [
    {
        id: 1,
        name: "Nivel 1: Presencia",
        description: "Profesionalice la marca. Deje de enviar fotos sueltas.",
        price: 350000,
        features: ["web", "catalog_view"],
        cta: "Elegir Presencia",
        popular: false
    },
    {
        id: 2,
        name: "Nivel 2: Gestión",
        description: "Tome control del stock y construya su base de clientes.",
        price: 550000,
        features: ["web", "catalog_view", "admin", "users"],
        cta: "Elegir Gestión",
        popular: false
    },
    {
        id: 3,
        name: "Nivel 3: Automatización",
        description: "La máquina de ventas completa. Cierre ventas sin intervenir.",
        price: 890000,
        originalPrice: 980000,
        features: ["web", "catalog_full", "admin", "users", "cart_direct", "quoter", "payments"],
        cta: "Quiero Automatizar Todo",
        popular: true,
        badge: "Recomendado"
    }
];

const EXTRA_FEATURES: Feature[] = [
    {
        id: "blog",
        title: "Blog de Novedades",
        icon: PenTool,
        short: "Artículos para atraer tráfico.",
        full_description: "Una sección donde publicar artículos sobre tendencias, tips de diseño, etc. Fundamental para aparecer en Google.",
        benefits: ["Posicionamiento SEO.", "Autoridad de marca.", "Contenido para redes."]
    },
    {
        id: "coupons",
        title: "Cupones de Descuento",
        icon: TrendingUp,
        short: "Promociones y ofertas.",
        full_description: "Permite crear promociones como '10% OFF', 'Envío gratis superando X monto', etc.",
        benefits: ["Incentivos de compra.", "Liquidación de stock.", "Fechas especiales."]
    },
    {
        id: "wishlist",
        title: "Lista de Deseos",
        icon: Heart,
        short: "Guardar favoritos.",
        full_description: "Permite a los usuarios marcar productos que les gustan para comprar después.",
        benefits: ["Reduce el abandono.", "Mide interés.", "Facilita recompra."]
    },
    {
        id: "reviews",
        title: "Reseñas con Fotos",
        icon: Instagram,
        short: "Testimonios de clientes.",
        full_description: "Módulo para que los compradores suban fotos y dejen calificaciones.",
        benefits: ["Prueba social.", "Genera confianza.", "Contenido genuino."]
    },
    {
        id: "social_login",
        title: "Login Google",
        icon: User,
        short: "Registro en 1 clic.",
        full_description: "Permite registrarse usando su cuenta de Google, sin crear contraseña.",
        benefits: ["Menos fricción.", "Más usuarios.", "Acceso rápido."]
    },
    {
        id: "newsletter",
        title: "Newsletter",
        icon: MessageSquare,
        short: "Email Marketing.",
        full_description: "Captura emails de clientes y envía novedades automáticas o manuales.",
        benefits: ["Canal directo.", "Fidelización.", "Costo cero."]
    }
];

export default function ProposalPage() {
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

    return (
        <div className="bg-stone-50 text-stone-900 font-sans selection:bg-olive selection:text-white pb-20">

            {/* Minimal Header */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/50">
                <img src="/logo-full.png" alt="OG" className="h-10 w-10 object-cover rounded-full" />
                <Button
                    variant="ghost"
                    className="text-xs uppercase tracking-widest font-bold text-olive hover:bg-olive/10"
                    onClick={() => document.getElementById('presupuesto')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    Empezar
                </Button>
            </header>

            {/* 1. HERO: INTRO PERSONAL & PROFESIONAL */}
            <section className="pt-40 pb-24 px-6 text-center bg-white border-b border-stone-200">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-olive/10 text-olive border border-olive/20 font-bold tracking-widest text-[10px] uppercase mb-8">
                        Propuesta de Desarrollo 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 tracking-tight">
                        SU NEGOCIO, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B8000] to-[#556B2F] animate-gradient">AUTOMÁTICO.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-500 font-light leading-relaxed max-w-3xl mx-auto mb-10">
                        Somos <strong>V Solutions</strong>, desarrolladores de software. En esta oportunidad, hemos diseñado una estrategia para que <strong>OG Decoraciones</strong> deje de depender de su tiempo manual y empiece a escalar con tecnología propia.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-stone-900 hover:bg-stone-800 text-white h-14 px-8 rounded-full text-lg shadow-xl"
                        >
                            Probar Demo
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* 2. ANÁLISIS DE INSTAGRAM */}
            <section id="analysis" className="py-24 bg-stone-50 border-b border-stone-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Intro Texto */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white rounded-full shadow-sm text-[#E1306C]">
                                    <Instagram className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-bold uppercase tracking-widest text-stone-400">Auditoría: @ogdecoracionesok</span>
                            </div>
                            <h2 className="text-3xl font-serif text-stone-900 mb-6">El diagnóstico detallado.</h2>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                Analicé su perfil en profundidad. Tienen una <strong>marca aspiracional</strong> muy potente, pero la operativa actual actúa como un "cuello de botella" para el crecimiento real.
                            </p>
                        </div>

                        {/* Cards Comparison */}
                        <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
                            {/* Puntos Fuertes */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm"
                            >
                                <h3 className="text-xl font-serif text-stone-900 mb-6 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-olive" />
                                    Lo que FUNCIONA
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <Check className="h-4 w-4 text-olive shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-stone-900 text-sm">Confianza Visual & Estética</h4>
                                            <p className="text-stone-500 text-xs mt-1">
                                                Las fotos de obras terminadas y la paleta de colores transmiten calidad premium. El cliente ya confía en que saben trabajar.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Heart className="h-4 w-4 text-olive shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-stone-900 text-sm">Engagement Real</h4>
                                            <p className="text-stone-500 text-xs mt-1">
                                                Hay comentarios activos preguntando precios. La gente QUIERE comprar, el deseo ya está generado.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <User className="h-4 w-4 text-olive shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-stone-900 text-sm">Autoridad en el Nicho</h4>
                                            <p className="text-stone-500 text-xs mt-1">
                                                Se percibe como un referente local en Ushuaia. No necesitan "convencer" de que existen, solo necesitan facilitar la venta.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Oportunidades */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-olive/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2 relative z-10">
                                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                                    Lo que PERDEMOS
                                </h3>
                                <ul className="space-y-6 relative z-10">
                                    <li className="flex gap-4">
                                        <AlertCircle className="h-4 w-4 text-stone-400 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Fuga Silenciosa ("Ghosting")</h4>
                                            <p className="text-stone-400 text-xs mt-1">
                                                El cliente ve la foto a las 23hs, se emociona, no ve el precio, manda DM... y si no responden en 5 minutos, el deseo se enfría y sigue scrolleando. Venta perdida.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Clock className="h-4 w-4 text-stone-400 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Consultas Repetitivas</h4>
                                            <p className="text-stone-400 text-xs mt-1">
                                                Responder las mismas preguntas una y otra vez por DM consume tiempo valioso que podría usarse en tareas más importantes.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Database className="h-4 w-4 text-stone-400 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Sin Base de Datos Propia</h4>
                                            <p className="text-stone-400 text-xs mt-1">
                                                Los seguidores son de Instagram (Meta), no de ustedes. Si mañana les banean la cuenta o cambia el algoritmo, pierden el contacto con sus clientes.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. MEJORAS (BENEFICIOS) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <h2 className="text-3xl font-serif text-stone-900 mb-6">Por qué un Sistema a Medida cambia el juego</h2>
                    <p className="text-stone-500 max-w-3xl mx-auto mb-16">
                        No es solo "una página web bonita". Es implementar una <strong>lógica de negocio</strong> que trabaja por ustedes.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {[
                            {
                                title: "Captura la Venta en Caliente",
                                desc: "El cotizador automático le da al cliente la satisfacción inmediata de saber el precio exacto MIENTRAS tiene el deseo alto. Pasa de 'curioso' a 'comprador' en segundos, sin esperar respuesta humana.",
                                icon: Zap
                            },
                            {
                                title: "Profesionalismo & Ticket Alto",
                                desc: "Para vender cortinas de alto valor, la experiencia de compra debe ser premium. Un sistema que calcula desperdicios y muestra detalles técnicos justifica precios más altos que la competencia informal.",
                                icon: ShieldCheck
                            },
                            {
                                title: "Activo Digital Propio",
                                desc: "Cada venta registra al cliente en SU base de datos. Pueden enviar emails, ofertas y recordatorios sin depender del algoritmo de Instagram. El negocio pasa a ser 100% suyo.",
                                icon: Database
                            },
                            {
                                title: "Atención 24/7 Real",
                                desc: "Su mejor vendedor ahora trabaja feriados y de madrugada. El sistema nunca duerme, nunca se olvida de responder y nunca se equivoca en la cuenta.",
                                icon: Clock
                            },
                            {
                                title: "Escalabilidad",
                                desc: "Hoy son cortinas, mañana es Bazar, pasado Pisos. El sistema está preparado para agregar categorías sin límites. No hay techo de crecimiento técnico.",
                                icon: TrendingUp
                            },
                            {
                                title: "Orden Operativo",
                                desc: "Centralice stocks, precios y pedidos. Se acabó el '¿me queda stock de este color?' preguntando por WhatsApp al depósito. Todo está en el panel en tiempo real.",
                                icon: Lock
                            },
                        ].map((item, i) => (
                            <div key={i} className="p-8 border border-stone-100 rounded-2xl hover:border-olive/30 hover:shadow-lg transition-all group bg-stone-50/50">
                                <item.icon className="h-10 w-10 text-olive mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="font-bold text-lg text-stone-900 mb-3">{item.title}</h3>
                                <p className="text-sm text-stone-600 leading-relaxed font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. DEMO: LA SOLUCIÓN */}
            <section id="demo" className="py-24 bg-stone-50 border-y border-stone-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-olive font-bold tracking-widest text-xs uppercase mb-2 block">Prototipo Funcional</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6">Pruébelo ahora mismo.</h2>
                        <p className="text-stone-500 max-w-2xl mx-auto">
                            He creado un entorno de prueba donde puede navegar como cliente y como administrador.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* CLIENTE */}
                        <div className="bg-white border border-stone-200 rounded-3xl p-8 hover:border-olive/50 transition-all text-center">
                            <ShoppingCart className="h-10 w-10 text-stone-900 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif text-stone-900 mb-2">Tienda & Cotizador</h3>
                            <p className="text-stone-500 text-sm mb-8">
                                Vea cómo sus clientes filtran productos y obtienen precios al instante.
                            </p>
                            <Link href="/" target="_blank">
                                <Button className="w-full h-12 bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200">Ver Demo Tienda</Button>
                            </Link>
                        </div>

                        {/* ADMIN */}
                        <div className="bg-stone-900 rounded-3xl p-8 text-white text-center relative overflow-hidden ring-1 ring-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-olive/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <Lock className="h-10 w-10 text-white mx-auto mb-6 relative z-10" />
                            <h3 className="text-2xl font-serif text-white mb-2 relative z-10">Panel de Control</h3>
                            <div className="inline-block bg-white/10 px-3 py-1 rounded mb-6 text-xs text-stone-300 font-mono relative z-10">
                                admin@ogdecoraciones.com | password123
                            </div>
                            <Link href="/admin" target="_blank" className="relative z-10">
                                <Button className="w-full h-12 bg-olive hover:bg-olive-dark text-white border-none">Ingresar al Panel</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA - LLAMADO A LA ACCIÓN */}
            <section id="presupuesto" className="py-24 bg-stone-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative bg-white rounded-3xl p-12 md:p-16 text-center border-2 border-olive/30 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-olive/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-olive/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <span className="inline-block py-1 px-4 rounded-full bg-olive/10 text-olive border border-olive/20 font-bold tracking-widest text-[10px] uppercase mb-8">
                                Próximo Paso
                            </span>

                            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
                                Escribinos para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B8000] to-[#556B2F]">visitarte</span>
                            </h2>

                            <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                                Coordinamos una visita a tu local para conocer tu operación, entender tus necesidades y armar juntos la mejor solución.
                                <span className="block mt-3 text-stone-400 text-base">Sin compromiso. Solo una charla.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                                <Button
                                    onClick={() => {
                                        const message = `Hola Mauro! Vi la propuesta para OG Decoraciones y me gustaría coordinar una visita para charlar.\n\n¿Cuándo podrías pasar?`;
                                        window.open(`https://wa.me/5492901652974?text=${encodeURIComponent(message)}`, '_blank');
                                    }}
                                    className="h-14 px-10 bg-olive hover:bg-olive-dark text-white text-lg font-bold rounded-full shadow-xl hover:scale-105 transition-all"
                                >
                                    <MessageSquare className="h-5 w-5 mr-2" />
                                    Coordinar Visita por WhatsApp
                                </Button>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-400">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-olive" />
                                    <span>Respuesta en menos de 2 horas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-olive" />
                                    <span>Disponible Lun-Sáb</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. MENÚ DE EXPANSIÓN (6 Items) */}
            <section className="py-20 bg-stone-50 border-t border-stone-200">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="text-stone-400 font-bold tracking-widest text-xs uppercase mb-2 block">Extras</span>
                        <h2 className="text-3xl font-serif text-stone-900 mb-6">¿Qué más podemos agregar?</h2>
                        <p className="text-stone-500 max-w-2xl mx-auto">
                            Tu sistema está preparado para crecer con módulos adicionales.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {EXTRA_FEATURES.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedFeature(item)}
                                className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-100 shadow-sm hover:border-olive/30 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="mt-1 w-6 h-6 rounded-full bg-olive/10 text-olive flex items-center justify-center shrink-0 group-hover:bg-olive group-hover:text-white transition-colors">
                                    <item.icon className="h-3 w-3" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-stone-600 leading-tight group-hover:text-olive transition-colors block mb-1">{item.title}</span>
                                    <span className="text-[10px] text-stone-400 block line-clamp-1">{item.short}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <span className="inline-block py-2 px-6 rounded-full bg-olive/10 text-olive font-bold text-sm">
                            ¡Y mucho más!
                        </span>
                    </div>
                </div>
            </section>

            {/* 7. FUTURO (ESCALABILIDAD) */}
            <section className="py-20 bg-stone-50 border-t border-stone-200">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="inline-block p-3 rounded-full bg-blue-50 text-blue-600 mb-6">
                        <Zap className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-serif text-stone-900 mb-6">Escalabilidad Infinita</h2>
                    <p className="text-stone-500 mb-12">
                        Esto es solo el comienzo. Al tener software propio (y no una plantilla alquilada), podemos agregar funcionalidades avanzadas a futuro:
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FUTURE_FEATURES.map((feat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-stone-100 hover:shadow-lg transition-all text-left">
                                <feat.icon className="h-6 w-6 text-stone-400 mb-4" />
                                <h4 className="font-bold text-stone-900 mb-2 text-sm">{feat.title}</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. MVP DELIVERY */}
            <section className="container mx-auto px-6 max-w-4xl mb-20 mt-20">
                <div className="bg-olive/5 rounded-3xl p-8 md:p-12 border border-olive/20 text-center">
                    <div className="inline-block p-3 rounded-full bg-olive/10 text-olive mb-6">
                        <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif text-stone-900 mb-4">
                        MVP funcional en <span className="text-olive">1 semana</span>
                    </h3>
                    <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
                        Entregamos una primera versión funcional de tu sistema en solo 7 días para que puedas empezar a usarlo, probarlo y darnos feedback real.
                    </p>
                </div>
            </section>

            {/* FOOTER BUTTON */}
            <div className="pb-12 text-center">
                <Button
                    variant="link"
                    className="text-stone-400 hover:text-olive gap-2"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <ArrowUp className="h-4 w-4" /> Volver al Inicio
                </Button>
            </div>

            {/* FEATURE DETAIL DIALOG */}
            <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
                <DialogContent className="max-w-md bg-white border border-stone-100 p-0 overflow-hidden rounded-2xl">
                    {selectedFeature && (
                        <>
                            <div className="bg-stone-50 p-6 border-b border-stone-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-olive shadow-sm">
                                    <selectedFeature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-stone-900">{selectedFeature.title}</h3>
                                    <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">Detalle Funcional</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-stone-600 leading-relaxed mb-6 text-sm">
                                    {selectedFeature.full_description}
                                </p>

                                <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-olive" /> Beneficios Clave
                                </h4>
                                <ul className="space-y-2">
                                    {selectedFeature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-stone-500">
                                            <Check className="h-4 w-4 text-olive shrink-0 mt-0.5" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 bg-stone-50 border-t border-stone-100 text-center">
                                <Button variant="outline" className="w-full" onClick={() => setSelectedFeature(null)}>Entendido</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}
