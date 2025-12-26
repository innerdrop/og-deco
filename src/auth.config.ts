import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            console.log("Middleware Auth Check:", { path: nextUrl.pathname, user: auth?.user, isLoggedIn });

            // Allow access to login page
            if (nextUrl.pathname === "/admin/login") return true;

            // Restrict admin routes
            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }
            return true;
        },
    },
    providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
