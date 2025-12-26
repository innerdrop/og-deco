
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:../dev.db" // Relative to the script location (assuming running from prisma/ or similar, adjusted below)
        }
    }
})

// Curated Unsplash Images by Category
const images = {
    cortinas: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop", // White curtains
        "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e60?q=80&w=1975&auto=format&fit=crop", // Sheer curtains
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop", // Dark curtains
        "https://images.unsplash.com/photo-1461988320302-38e7f960f260?q=80&w=2070&auto=format&fit=crop", // Modern curtains
    ],
    almohadones: [
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=2040&auto=format&fit=crop", // Pillows on sofa
        "https://images.unsplash.com/photo-1579656381226-5fc70aa6f632?q=80&w=1974&auto=format&fit=crop", // Colorful pillows
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2564&auto=format&fit=crop", // Minimalist pillow
    ],
    muebles: [
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2080&auto=format&fit=crop", // Grey Sofa
        "https://images.unsplash.com/photo-1598300042247-d088f8d7d910?q=80&w=2052&auto=format&fit=crop", // Wooden Chair
        "https://images.unsplash.com/photo-1538688536322-a290f848be52?q=80&w=1973&auto=format&fit=crop", // Modern chair
    ],
    plantas: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop", // Monstera
        "https://images.unsplash.com/photo-1463320726281-696a413703b6?q=80&w=2070&auto=format&fit=crop", // Indoor plant
        "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1974&auto=format&fit=crop", // Pot plant
    ],
    default: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop", // Interior generic
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop", // Interior light
    ]
}

function getRandomImage(categorySlug: string) {
    const pool = images[categorySlug as keyof typeof images] || images.default;
    return pool[Math.floor(Math.random() * pool.length)];
}

async function main() {
    console.log('Starting image update...')

    // Get all products including their category
    const products = await prisma.product.findMany({
        include: { category: true }
    })

    console.log(`Found ${products.length} products to update.`)

    for (const product of products) {
        // Only update if image is null or placeholder (optional check, here we force update)
        // const shouldUpdate = !product.image || product.image.startsWith('/'); 

        const newImage = getRandomImage(product.category.slug);

        await prisma.product.update({
            where: { id: product.id },
            data: { image: newImage }
        })
        console.log(`Updated product: ${product.name} -> ${newImage.substring(0, 30)}...`)
    }

    // Also update Category images if needed
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
