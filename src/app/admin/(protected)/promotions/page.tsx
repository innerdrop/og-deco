
import { prisma } from "@/lib/prisma";
import PromotionManager from "@/components/admin/promotion-manager";

export default async function PromotionsPage() {
    const promotions = await prisma.promotion.findMany({
        orderBy: { createdAt: "desc" }
    });

    return <PromotionManager promotions={promotions} />;
}

