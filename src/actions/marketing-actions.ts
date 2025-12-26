"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendBroadcast(formData: FormData) {
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const mode = formData.get("mode") as string; // 'all' or 'select'
    const recipientIdsString = formData.get("recipientIds") as string;

    let targetCount = 0;

    if (mode === "select" && recipientIdsString) {
        const ids = JSON.parse(recipientIdsString);
        targetCount = ids.length;
        // Logic to send to specific IDs would go here
    } else {
        targetCount = await prisma.user.count({
            where: { role: "USER" }
        });
    }

    if (targetCount === 0) {
        throw new Error("No hay destinatarios seleccionados.");
    }

    // 2. Log Broadcast in DB
    await prisma.broadcast.create({
        data: {
            subject,
            message,
            recipients: targetCount
        }
    });

    console.log(`[BROADCAST] Sending "${subject}" to ${targetCount} users (Mode: ${mode}).`);

    revalidatePath("/admin/marketing");
}
