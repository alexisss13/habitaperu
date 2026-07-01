import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider"

import { headers } from "next/headers";

// Outfit → Para toda la tipografía (moderna y versátil)
const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Habita Perú — Plataforma de Arrendadores",
  description: "Gestiona contratos, verifica inquilinos y controla tus pagos desde un solo lugar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "es";

  return (
    <html lang={locale} suppressHydrationWarning className={`${outfit.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={outfit.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
