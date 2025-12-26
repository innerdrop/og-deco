
const { PrismaClient } = require('@prisma/client');

// Force absolute path to avoid resolution issues
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:c:/Users/Mauro/Desktop/OG Deco/prisma/dev.db"
        }
    }
});

// Curated Unsplash Images by Category
const images = {
    cortinas: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e60?q=80&w=1975&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1461988320302-38e7f960f260?q=80&w=2070&auto=format&fit=crop",
    ],
    almohadones: [
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=2040&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579656381226-5fc70aa6f632?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2564&auto=format&fit=crop",
    ],
    muebles: [
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2080&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598300042247-d088f8d7d910?q=80&w=2052&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1538688536322-a290f848be52?q=80&w=1973&auto=format&fit=crop",
    ],
    plantas: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1463320726281-696a413703b6?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1974&auto=format&fit=crop",
    ],
    default: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    ]
}

function getRandomImage(categorySlug) {
    // Basic heuristics if slug is missing or different
    let key = 'default';
    if (categorySlug) {
        if (categorySlug.includes('cortina')) key = 'cortinas';
        else if (categorySlug.includes('almohadon')) key = 'almohadones';
        else if (categorySlug.includes('mueble') || categorySlug.includes('silla') || categorySlug.includes('mesa')) key = 'muebles';
        else if (categorySlug.includes('planta')) key = 'plantas';
    }

    const pool = images[key];
    return pool[Math.floor(Math.random() * pool.length)];
}

async function main() {
    console.log('Starting image update with absolute path...')

    // Get all products including their category
    const products = await prisma.product.findMany({
        include: { category: true }
    })

    console.log(`Found ${products.length} products to update.`)

    for (const product of products) {
        const newImage = getRandomImage(product.category ? product.category.slug : '');

        await prisma.product.update({
            where: { id: product.id },
            data: { image: newImage }
        })
        console.log(`Updated product: ${product.name}`)
    }

    const categories = await prisma.category.findMany();
    for (const cat of categories) {
        const newImage = getRandomImage(cat.slug);
        await prisma.category.update({
            where: { id: cat.id },
            data: { image: newImage }
        })
        console.log(`Updated category: ${cat.name}`)
    }

    console.log('All images updated successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
