import { prisma } from "@/lib/prisma";
import QuoterClient from "@/components/quoter/quoter-client";

export default async function CotizadorPage() {
    // Fetch Settings
    const globalSettings = await prisma.globalSetting.findUnique({ where: { id: "settings" } });

    // Fetch Categories with Options
    const categories = await prisma.quoterCategory.findMany({
        include: { options: true }
    });

    return (
        <QuoterClient categories={categories} globalSettings={globalSettings} />
    );
}
