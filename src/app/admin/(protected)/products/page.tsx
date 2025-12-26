import { prisma } from "@/lib/prisma";
import ProductManager from "@/components/admin/product-manager";

export default async function ProductsAdminPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" }
    });

    const categories = await prisma.category.findMany();

    return <ProductManager products={products} categories={categories} />;
}
