"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createCustomer(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    // Check if exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("Ya existe un cliente con este email.");
    }

    // Default password for manual users (they should reset it later)
    const hashedPassword = await bcrypt.hash("OGDeco2025!", 10);

    await prisma.user.create({
        data: {
            name,
            email,
            phone,
            password: hashedPassword,
            role: "USER"
        }
    });

    revalidatePath("/admin/customers");
}
