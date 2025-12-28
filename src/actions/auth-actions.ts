"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        console.log("Authenticate action called with:", Object.fromEntries(formData)); // WARNING: PROD UNSAFE
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/admin/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Credenciales inválidas.";
                default:
                    return "Algo salió mal.";
            }
        }
        throw error;
    }
}

export async function signOutAction() {
    await signOut();
}
