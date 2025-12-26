import { Quote } from "lucide-react"

export function Testimonials() {
    return (
        <section className="py-24 bg-olive/5 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
                    <Quote className="h-12 w-12 text-olive/20" />
                    <p className="text-2xl md:text-3xl font-serif text-stone-700 italic leading-relaxed">
                        "Excelente atención y calidad. Las cortinas roller cambiaron por completo la luz de mi living. Entendieron perfecto lo que necesitaba para el clima de acá."
                    </p>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-olive-dark">María Eugenia L.</span>
                        <span className="text-sm text-stone-500">Cliente de Ushuaia</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
