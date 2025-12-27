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

// --- Updates & Seeding ---
export async function updateQuoterCategory(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/\s/g, "-");

    await prisma.quoterCategory.update({
        where: { id },
        data: { name, slug }
    });
    revalidatePath("/admin/settings");
}

export async function updateQuoterOption(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const priceMod = parseFloat(formData.get("priceMod") as string) || 0;
    const isPercentage = formData.get("isPercentage") === "on";
    const image = formData.get("image") as string;

    await prisma.quoterOption.update({
        where: { id },
        data: {
            name,
            priceMod,
            isPercentage,
            image: image || null
        }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/cotizador");
}

export async function initializeQuoterDefaults() {
    // 1. Ambientes
    let envCat = await prisma.quoterCategory.findUnique({ where: { slug: "ambiente" } });
    if (!envCat) {
        envCat = await prisma.quoterCategory.create({
            data: { name: "Ambiente", slug: "ambiente" }
        });
    }

    // Add default options if empty
    const envCount = await prisma.quoterOption.count({ where: { categoryId: envCat.id } });
    if (envCount === 0) {
        await prisma.quoterOption.createMany({
            data: [
                { categoryId: envCat.id, name: "Living / Comedor", priceMod: 0 },
                { categoryId: envCat.id, name: "Dormitorio", priceMod: 0 },
                { categoryId: envCat.id, name: "Cocina", priceMod: 0 },
                { categoryId: envCat.id, name: "Oficina", priceMod: 0 },
            ]
        });
    }

    // 2. Telas
    let fabricCat = await prisma.quoterCategory.findUnique({ where: { slug: "tela" } });
    if (!fabricCat) {
        fabricCat = await prisma.quoterCategory.create({
            data: { name: "Tela", slug: "tela" }
        });
    }

    const fabricCount = await prisma.quoterOption.count({ where: { categoryId: fabricCat.id } });
    if (fabricCount === 0) {
        await prisma.quoterOption.createMany({
            data: [
                { categoryId: fabricCat.id, name: "Blackout Premium", priceMod: 15000, isPercentage: false },
                { categoryId: fabricCat.id, name: "Sunscreen 5%", priceMod: 18000, isPercentage: false },
                { categoryId: fabricCat.id, name: "Voile Simple", priceMod: 8500, isPercentage: false },
                { categoryId: fabricCat.id, name: "Lino Rústico", priceMod: 22000, isPercentage: false },
            ]
        });
    }

    // 3. Sistemas (Optional extra)
    let sysCat = await prisma.quoterCategory.findUnique({ where: { slug: "sistema" } });
    if (!sysCat) {
        sysCat = await prisma.quoterCategory.create({
            data: { name: "Sistema", slug: "sistema" }
        });
    }

    const sysCount = await prisma.quoterOption.count({ where: { categoryId: sysCat.id } });
    if (sysCount === 0) {
        await prisma.quoterOption.createMany({
            data: [
                { categoryId: sysCat.id, name: "Roller Manual", priceMod: 0, isPercentage: false },
                { categoryId: sysCat.id, name: "Roller Motorizado", priceMod: 150000, isPercentage: false }, // Fixed cost adder example
                { categoryId: sysCat.id, name: "Riel Americano", priceMod: 12000, isPercentage: false },
            ]
        });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/cotizador");
}
