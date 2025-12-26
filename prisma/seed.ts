import { PrismaClient } from '@prisma/client'
import { categories, products } from '../src/lib/data'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('password123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ogdecoraciones.com' },
        update: {},
        create: {
            email: 'admin@ogdecoraciones.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
    console.log(`Created admin user: ${admin.email}`)

    // 2. Create Categories
    // Mapping current string IDs to new items
    const catMap = new Map()

    for (const cat of categories) {
        const createdCat = await prisma.category.upsert({
            where: { slug: cat.id },
            update: {},
            create: {
                slug: cat.id,
                name: cat.name,
                image: cat.image,
            },
        })
        catMap.set(cat.id, createdCat.id)
        console.log(`Created category: ${cat.name}`)
    }

    // 3. Create Products
    for (const p of products) {
        // Look up real Category ID from map
        const categoryId = catMap.get(p.category)

        if (categoryId) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    isNew: p.isNew,
                    categoryId: categoryId,
                    stock: 50, // Default stock
                    description: "Descripción simulada del producto..."
                }
            })
            console.log(`Created product: ${p.name}`)
        }
    }

    console.log('Seeding finished.')
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
