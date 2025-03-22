// src/app/(admin)/admin/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, isLoggingOut } = useAuth();
    const pathname = usePathname();

    console.log("AdminLayout rendu, user:", user, "loading:", loading, "isLoggingOut:", isLoggingOut, "pathname:", pathname);

    if (pathname === "/admin/login") {
        console.log("Route /admin/login détectée, rendu direct de children sans sidebar");
        return <>{children}</>;
    }

    if (loading || isLoggingOut || !user) {
        console.log("AdminLayout: Chargement, déconnexion ou utilisateur non connecté, rien n'est rendu");
        return null;
    }

    if (user.role !== "admin" && user.role !== "editor") {
        console.log("AdminLayout: Rôle non autorisé, affichage d'un message d'erreur. Rôle actuel:", user.role);
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Votre rôle ({user.role}) ne vous permet pas d'accéder à cette page.</p>
                    <p className="mt-2">
                        <a href="/admin/login" className="text-blue-500 hover:underline">
                            Retour à la connexion
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    console.log("AdminLayout: Utilisateur autorisé, rendu de la sidebar et des children");
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}