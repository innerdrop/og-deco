"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

import { authenticate } from "@/actions/auth-actions";
import { Lock } from "lucide-react";

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            className="w-full bg-olive hover:bg-olive-dark text-white"
            disabled={pending}
        >
            {pending ? "Ingresando..." : "Iniciar Sesión"}
        </Button>
    );
}

export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-olive h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-stone-800">OG Decoraciones</h1>
                    <p className="text-stone-500">Panel de Administración</p>
                </div>

                <form action={dispatch} className="space-y-4" autoComplete="off">
                    {/* Dummy inputs to trick browser autofill */}
                    <input type="text" name="fake_email_to_prevent_autofill" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} tabIndex={-1} autoComplete="off" />
                    <input type="password" name="fake_password_to_prevent_autofill" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }} tabIndex={-1} autoComplete="off" />

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            autoComplete="off"
                            readOnly
                            onFocus={(e) => e.target.readOnly = false}
                            className="w-full h-10 rounded-md border border-stone-200 px-3 focus:outline-none focus:ring-1 focus:ring-olive"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            readOnly
                            onFocus={(e) => e.target.readOnly = false}
                            className="w-full h-10 rounded-md border border-stone-200 px-3 focus:outline-none focus:ring-1 focus:ring-olive"
                        />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md">
                            <p>{errorMessage}</p>
                        </div>
                    )}

                    <LoginButton />
                </form>
            </div>
        </div>
    );
}
