// src/app/(admin)/admin/dashboard/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();

    console.log("DashboardPage rendu, user:", user);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tableau de bord Admin</h1>
            <p>Bienvenue, {user?.username} ! Votre rôle est : {user?.role}.</p>
            <p>Ceci est votre tableau de bord. Vous pouvez gérer les programmes, jeux, prédictions, et résultats depuis ici.</p>
        </div>
    );
}