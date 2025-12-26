"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Global Settings ---
export async function updateGlobalSettings(formData: FormData) {
    const minWidth = parseFloat(formData.get("minWidth") as string);
    const maxWidth = parseFloat(formData.get("maxWidth") as string);
    const minHeight = parseFloat(formData.get("minHeight") as string);
    const maxHeight = parseFloat(formData.get("maxHeight") as string);
    const baseMargin = parseFloat(formData.get("baseMargin") as string);

    await prisma.globalSetting.upsert({
        where: { id: "settings" },
        update: { minWidth, maxWidth, minHeight, maxHeight, baseMargin },
        create: { id: "settings", minWidth, maxWidth, minHeight, maxHeight, baseMargin }
    });

    revalidatePath("/admin/settings");
}

// --- Quoter Categories ---
export async function createQuoterCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/\s/g, "-");

    await prisma.quoterCategory.create({
        data: { name, slug }
    });
    revalidatePath("/admin/settings");
}

export async function deleteQuoterCategory(id: string) {
    await prisma.quoterCategory.delete({ where: { id } });
    revalidatePath("/admin/settings");
}

// --- Quoter Options ---
export async function createQuoterOption(formData: FormData) {
    const name = formData.get("name") as string;
    const priceMod = parseFloat(formData.get("priceMod") as string) || 0;
    const isPercentage = formData.get("isPercentage") === "on";
    const categoryId = formData.get("categoryId") as string;
    const image = formData.get("image") as string;

    await prisma.quoterOption.create({
        data: {
            name,
            priceMod,
            isPercentage,
            categoryId,
            image: image || null
        }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/cotizador"); // Update public page too
}

export async function deleteQuoterOption(id: string) {
    await prisma.quoterOption.delete({ where: { id } });
    revalidatePath("/admin/settings");
}
