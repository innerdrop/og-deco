import { prisma } from "@/lib/prisma";
import SettingsManager from "@/components/admin/settings-manager";

export default async function SettingsPage() {
    // 1. Fetch Global Settings
    let settings = await prisma.globalSetting.findUnique({
        where: { id: "settings" }
    });

    // Create default if not exists
    if (!settings) {
        settings = await prisma.globalSetting.create({
            data: { id: "settings" }
        });
    }

    // 2. Fetch Categories & Options
    const categories = await prisma.quoterCategory.findMany({
        include: { options: true }
    });

    return (
        <div className="animate-fade-in">
            <SettingsManager settings={settings} categories={categories} />
        </div>
    );
}
