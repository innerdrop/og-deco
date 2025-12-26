"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPromotion(formData: FormData) {
    const title = formData.get("title") as string;
    const code = (formData.get("code") as string).toUpperCase().replace(/\s/g, "");
    const discount = parseFloat(formData.get("discount") as string);
    const type = formData.get("type") as string || "PERCENTAGE";

    try {
        await prisma.promotion.create({
            data: {
                title,
                code,
                discount,
                type,
                isActive: true
            }
        });
    } catch (e) {
        // Handle Unique Constraint on Code
        throw new Error("El código de promoción ya existe.");
    }

    revalidatePath("/admin/promotions");
}

export async function deletePromotion(formData: FormData) {
    const id = formData.get("id") as string;
    await prisma.promotion.delete({ where: { id } });
    revalidatePath("/admin/promotions");
}

export async function togglePromotionStatus(id: string, currentStatus: boolean) {
    await prisma.promotion.update({
        where: { id },
        data: { isActive: !currentStatus }
    });
    revalidatePath("/admin/promotions");
}

export async function validateCoupon(code: string) {
    const promotion = await prisma.promotion.findUnique({
        where: { code: code.toUpperCase() }
    });

    if (!promotion) {
        return { valid: false, error: "Cupón inválido." };
    }

    if (!promotion.isActive) {
        return { valid: false, error: "Este cupón ha expirado." };
    }

    return {
        valid: true,
        discount: promotion.discount,
        type: promotion.type,
        code: promotion.code
    };
}
