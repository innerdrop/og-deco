"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveFile } from "@/lib/file-upload";

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const stock = parseInt(formData.get("stock") as string) || 0;

    const imageFile = formData.get("image") as File;
    const imagePath = await saveFile(imageFile);

    await prisma.product.create({
        data: {
            name,
            description,
            price,
            categoryId,
            image: imagePath,
            stock,
            isNew: true,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
}

export async function updateProduct(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const stock = parseInt(formData.get("stock") as string) || 0;

    const imageFile = formData.get("image") as File;
    const newImagePath = await saveFile(imageFile);

    const dataToUpdate: any = {
        name,
        description,
        price,
        categoryId,
        stock,
    };

    if (newImagePath) {
        dataToUpdate.image = newImagePath;
    }

    await prisma.product.update({
        where: { id },
        data: dataToUpdate,
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
}

export async function deleteProduct(formData: FormData) {
    const id = formData.get("id") as string;
    await prisma.product.delete({
        where: { id }
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
}
