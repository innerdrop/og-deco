import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveFile(file: File | null): Promise<string | null> {
    if (!file || file.size === 0 || file.name === "undefined") return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore error if dir exists
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return `/uploads/${filename}`;
}
