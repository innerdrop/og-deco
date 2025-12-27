import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/admin",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            // 1. If at root /admin
            if (nextUrl.pathname === "/admin") {
                // If logged in, go to dashboard
                if (isLoggedIn) return Response.redirect(new URL("/admin/dashboard", nextUrl));
                // If not logged in, allow access (so page.tsx renders login form)
                return true;
            }

            // 2. If at other /admin routes (e.g. /admin/dashboard)
            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirects to signIn page (now /admin)
            }

            return true;
        },
    },
    providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
