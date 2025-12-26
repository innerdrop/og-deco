
import { prisma } from "@/lib/prisma";
import OrderManager from "@/components/admin/order-manager";

export default async function OrdersAdmin() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { name: true, email: true }
            },
            items: {
                include: {
                    product: {
                        select: { name: true, image: true }
                    }
                }
            }
        }
    });

    return <OrderManager orders={orders} />;
}

