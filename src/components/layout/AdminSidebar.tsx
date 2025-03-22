// src/components/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminSidebar() {
    const { logoutUser } = useAuth();

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <h2 className="text-xl font-bold mb-6">Administration</h2>
            <nav>
                <ul>
                    <li className="mb-2">
                        <Link href="/admin/dashboard" className="block p-2 hover:bg-gray-700 rounded">
                            Tableau de bord
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link href="/admin/programs" className="block p-2 hover:bg-gray-700 rounded">
                            Programmes
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link href="/admin/games" className="block p-2 hover:bg-gray-700 rounded">
                            Jeux
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link href="/admin/predictions" className="block p-2 hover:bg-gray-700 rounded">
                            Prédictions
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link href="/admin/results" className="block p-2 hover:bg-gray-700 rounded">
                            Résultats
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link href="/admin/users" className="block p-2 hover:bg-gray-700 rounded">
                            Utilisateurs
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link href="/admin/game-types" className="block p-2 hover:bg-gray-700 rounded">
                            Types de jeux
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link href="/admin/countries" className="block p-2 hover:bg-gray-700 rounded">
                            Pays
                        </Link>
                    </li>
                    <li className="mt-4">
                        <button
                            onClick={logoutUser}
                            className="w-full text-left p-2 hover:bg-red-600 rounded"
                        >
                            Déconnexion
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}