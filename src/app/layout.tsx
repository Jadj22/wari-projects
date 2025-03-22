// src/app/layout.tsx
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ReactNode } from "react";
import ClientLayout from "@/components/client/ClientLayout";
import { LayoutProvider } from "@/context/LayoutContext";
import {AuthProvider} from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Wariprono",
    description: "Application de paris sports, programmes, pronostics et résultats",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fr">
        <body className={inter.className}>
        <LayoutProvider>
            <AuthProvider>
                <ClientLayout>{children}</ClientLayout>
            </AuthProvider>
        </LayoutProvider>
        </body>
        </html>
    );
}