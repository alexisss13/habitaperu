import type { Metadata } from "next";
import { Baloo_2, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider"

// Baloo 2 → Para títulos (más gruesa y amigable)
const baloo2 = Baloo_2({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap"
});

// M PLUS Rounded 1c → Para cuerpo de texto (estilo japonés minimalista)
const mPlusRounded = M_PLUS_Rounded_1c({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-mplus",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Habita Perú — Plataforma de Arrendadores",
  description: "Gestiona contratos, verifica inquilinos y controla tus pagos desde un solo lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${baloo2.variable} ${mPlusRounded.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={mPlusRounded.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
