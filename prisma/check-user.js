
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:c:/Users/Mauro/Desktop/OG Deco/prisma/dev.db"
        }
    }
});

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@ogdecoraciones.com' }
    });
    console.log('Admin user found:', user ? 'YES' : 'NO');
    if (user) console.log('User Role:', user.role);
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
