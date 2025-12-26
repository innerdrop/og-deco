import Link from "next/link"
import { ImageIcon } from "lucide-react"

export function CategoryGrid({ categories }: { categories: any[] }) {
    return (
        <section className="py-20 bg-beige">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="mb-12 text-center text-3xl font-serif font-bold text-stone-800 md:text-4xl text-olive-dark">
                    Categorías Destacadas
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/productos?categoria=${cat.slug}`}
                            className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer shadow-md"
                        >
                            {cat.image ? (
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${cat.image}')` }}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                                    <ImageIcon className="h-12 w-12 text-stone-400" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
                                    <span className="font-serif font-medium text-stone-900 text-lg uppercase tracking-wide">
                                        {cat.name}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full text-center p-8 bg-white/50 rounded-xl border border-stone-200">
                            <p className="text-stone-500 italic">No hay categorías destacadas aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

