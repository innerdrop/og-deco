import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative h-[80vh] w-full overflow-hidden bg-stone-900">
            {/* Background Image (Simulated with Placeholder) */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2670&auto=format&fit=crop')`, // Cozy living room with curtains
                    opacity: 0.7
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />

            <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center px-4 animate-slide-up">
                <h1 className="mb-4 text-5xl font-bold font-serif text-white md:text-7xl drop-shadow-lg">
                    Tu casa es tu templo
                </h1>
                <p className="mb-8 max-w-xl text-lg text-stone-100 md:text-xl font-light">
                    Decoración pensada para el clima y la luz de Ushuaia.
                    Creá espacios que te abracen.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href="/productos" className="flex-1 sm:flex-none">
                        <Button size="lg" className="w-full bg-olive hover:bg-olive-dark text-white text-lg h-14 px-8 rounded-full border-2 border-transparent transition-all">
                            Ver Catálogo
                        </Button>
                    </Link>
                    <Link href="/cotizador">
                        <Button size="lg" variant="outline" className="min-w-[160px] border-white text-white hover:bg-white/20 text-lg font-medium backdrop-blur-sm">
                            Cotizar Cortinas
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
