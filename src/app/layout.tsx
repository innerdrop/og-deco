import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OG Decoraciones | Tu casa es tu templo",
  description: "Decoración pensada para el clima y la luz de Ushuaia. Cortinas, pisos, plantas y más.",
};

import { CartProvider } from "@/context/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={cn(
          "antialiased bg-beige text-stone-900 min-h-screen font-sans selection:bg-olive selection:text-white",
          outfit.variable,
          playfair.variable
        )}
      >
        <CartProvider>
          {children}
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
