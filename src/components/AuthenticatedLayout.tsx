// src/components/AuthenticatedLayout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { loading, isLoggingOut, user } = useAuth();
    const pathname = usePathname();

    console.log("AuthenticatedLayout rendu, loading:", loading, "isLoggingOut:", isLoggingOut, "user:", user, "pathname:", pathname);

    if (pathname === "/admin/login") {
        console.log("Route /admin/login détectée, rendu direct de children");
        return <>{children ? children : null}</>;
    }

    if (loading || isLoggingOut || !user) {
        console.log("AuthenticatedLayout: Chargement ou utilisateur non connecté, affichage de l'écran de chargement");
        return (
            <div className="flex items-center justify-center min-h-screen bg-blue-500 text-white">
                <p className="text-2xl font-bold">Chargement en cours...</p>
            </div>
        );
    }

    console.log("AuthenticatedLayout: Utilisateur connecté, rendu de children");
    return <>{children ? children : null}</>;
}