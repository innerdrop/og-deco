import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col bg-beige">
            <Navbar />
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-olive-dark mb-6">Nuestra Historia</h1>
                    <p className="text-lg text-stone-600 leading-relaxed font-light">
                        Desde el fin del mundo, creamos espacios que refugian.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="aspect-[4/3] bg-stone-200 rounded-lg overflow-hidden shadow-lg">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2574&auto=format&fit=crop')` }} // Cozy store interior
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-stone-800">Diseño pensado para el Sur</h2>
                        <p className="text-stone-600 leading-relaxed">
                            OG Decoraciones nació en Ushuaia con una misión clara: ofrecer soluciones de decoración que no solo sean estéticamente impecables, sino que también respondan a las necesidades climáticas únicas de nuestra región.
                        </p>
                        <p className="text-stone-600 leading-relaxed">
                            Sabemos lo importante que es la luz en invierno y la aislación térmica. Por eso, nuestras cortinas y materiales están seleccionados para maximizar el confort en tu hogar, sin sacrificar el estilo.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm text-center">
                    <h2 className="text-2xl font-serif font-bold text-stone-800 mb-8">Por qué elegirnos</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🌱</div>
                            <h3 className="font-bold text-stone-900 mb-2">Compromiso Local</h3>
                            <p className="text-sm text-stone-500">Somos de acá, entendemos lo que tu casa necesita.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✨</div>
                            <h3 className="font-bold text-stone-900 mb-2">Calidad Premium</h3>
                            <p className="text-sm text-stone-500">Materiales duraderos y terminaciones de excelencia.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
                            <h3 className="font-bold text-stone-900 mb-2">Asesoramiento Integral</h3>
                            <p className="text-sm text-stone-500">Te acompañamos desde la idea hasta la instalación.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
