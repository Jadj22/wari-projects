// src/app/(admin)/admin/predictions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";

export default function PredictionsPage() {
    const { user, hasRole } = useAuth();
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";
    const canView = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchPredictions = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken) {
                toast.error("Vous devez être connecté pour accéder à cette page.", {
                    position: "top-right",
                    autoClose: 5000,
                });
                setLoading(false);
                return;
            }
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}admin/predictions/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { page },
                });
                setPredictions(response.data.results || []);
            } catch (error: any) {
                console.error("Erreur lors de la récupération des pronostics:", error);
                setError(error.response?.data?.detail || "Erreur lors de la récupération des pronostics.");
                toast.error(error.response?.data?.detail || "Erreur lors de la récupération des pronostics.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPredictions();
    }, [user, page]);

    if (!canView) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2 text-gray-600">Seuls les administrateurs et éditeurs peuvent accéder à cette page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-gray-600">Chargement des pronostics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-900 text-white p-6">
                <h2 className="text-xl font-bold mb-6">Admin</h2>
                <nav>
                    <ul className="space-y-2">
                        <li><Link href="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Tableau de bord</Link></li>
                        <li><Link href="/admin/programs" className="block py-2 px-4 hover:bg-gray-700 rounded">Programmes</Link></li>
                        <li><Link href="/admin/games" className="block py-2 px-4 hover:bg-gray-700 rounded">Jeux</Link></li>
                        <li><Link href="/admin/predictions" className="block py-2 px-4 bg-gray-700 rounded">Prédictions</Link></li>
                        <li><Link href="/admin/results" className="block py-2 px-4 hover:bg-gray-700 rounded">Résultats</Link></li>
                        <li><Link href="/admin/users" className="block py-2 px-4 hover:bg-gray-700 rounded">Utilisateurs</Link></li>
                        <li><Link href="/admin/game-types" className="block py-2 px-4 hover:bg-gray-700 rounded">Types de jeu</Link></li>
                        <li><Link href="/admin/countries" className="block py-2 px-4 hover:bg-gray-700 rounded">Pays</Link></li>
                        <li><Link href="/logout" className="block py-2 px-4 hover:bg-gray-700 rounded">Déconnexion</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des Pronostics</h1>
                {error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                ) : predictions.length === 0 ? (
                    <p className="text-gray-600">Aucun pronostic disponible pour le moment.</p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jeu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {predictions.map((prediction) => (
                                <tr key={prediction.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{prediction.game?.name || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{prediction.author?.username || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{prediction.description || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {prediction.is_published ? "Publié" : "Non publié"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/admin/predictions/edit/${prediction.id}`} className="text-blue-600 hover:underline">
                                            Modifier
                                        </Link>
                                        <button className="ml-4 text-red-600 hover:underline">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}