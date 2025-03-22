// src/components/client/ClientLayout.tsx
"use client";

import { ReactNode } from "react";
import { useLayout } from "@/context/LayoutContext";
import Header from "@/components/client/Header";
import Footer from "@/components/client/Footer";
import { ClientProvider } from "@/context/ClientContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
    const { showHeaderFooter } = useLayout();

    return (
        <ClientProvider>
            {showHeaderFooter && <Header />}
            <main>{children}</main>
            {showHeaderFooter && <Footer />}
        </ClientProvider>
    );
}