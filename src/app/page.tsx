import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Testimonials } from "@/components/home/testimonials";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh data

export default async function Home() {
  const newProducts = await prisma.product.findMany({
    where: { isNew: true },
    take: 4,
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  const categories = await prisma.category.findMany({
    take: 6,
    orderBy: { name: "asc" }
  });

  return (
    <main className="min-h-screen flex flex-col bg-beige" >
      <Navbar />
      <Hero />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={newProducts} />
      <Testimonials />
      <Footer />
    </main >
  );
}
