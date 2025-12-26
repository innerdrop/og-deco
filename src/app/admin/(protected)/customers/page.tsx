import { prisma } from "@/lib/prisma";
import CustomerManager from "@/components/admin/customer-manager";

export default async function CustomersPage() {
    const customers = await prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } } }
    });

    return (
        <div className="animate-fade-in">
            <CustomerManager customers={customers} />
        </div>
    );
}
