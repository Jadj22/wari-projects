"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";

interface GameType {
    id: number;
    name: string;
}

interface Country {
    id: number;
    name: string;
}

interface Game {
    id: number;
    name: string;
    game_type: GameType;
    country: Country;
    is_active: boolean;
    created_at: string;
    description: string;
}

export default function GamesPage() {
    const { user, hasRole } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    const canEdit = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchGames = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken || !user) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}admin/games/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { page },
                });
                setGames(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 20));
            } catch (error) {
                console.error("Erreur lors de la récupération des jeux:", error);
                toast.error("Erreur lors de la récupération des jeux.");
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, [user, page]);

    const toggleActive = async (gameId: number, isActive: boolean) => {
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.patch(
                `${API_URL}admin/games/${gameId}/`,
                { is_active: !isActive },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setGames((prev) =>
                prev.map((g) => (g.id === gameId ? { ...g, is_active: !isActive } : g))
            );
            toast.success(`Jeu ${isActive ? "désactivé" : "activé"} avec succès !`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du jeu:", error);
            toast.error("Erreur lors de la mise à jour du jeu.");
        }
    };

    const deleteGame = async (gameId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) return;
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.delete(`${API_URL}admin/games/${gameId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setGames((prev) => prev.filter((g) => g.id !== gameId));
            toast.success("Jeu supprimé avec succès !");
        } catch (error: any) {
            const message =
                error.response?.data?.detail || "Erreur lors de la suppression du jeu.";
            toast.error(message);
        }
    };

    if (loading) return <p className="text-center text-lg">Chargement des jeux...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des jeux</h1>
                {canEdit && (
                    <Link
                        href="/admin/games/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Créer un jeu
                    </Link>
                )}
            </div>
            {games.length === 0 ? (
                <p className="text-center text-gray-500">Aucun jeu trouvé.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nom</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Pays</th>
                                <th className="p-3 text-left">Actif</th>
                                <th className="p-3 text-left">Créé le</th>
                                {canEdit && <th className="p-3 text-left">Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {games.map((g) => (
                                <tr key={g.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{g.id}</td>
                                    <td className="p-3">{g.name}</td>
                                    <td className="p-3">{g.game_type.name}</td>
                                    <td className="p-3">{g.country.name}</td>
                                    <td className="p-3">{g.is_active ? "Oui" : "Non"}</td>
                                    <td className="p-3">
                                        {new Date(g.created_at).toLocaleDateString()}
                                    </td>
                                    {canEdit && (
                                        <td className="p-3 flex space-x-2">
                                            <button
                                                onClick={() => toggleActive(g.id, g.is_active)}
                                                className={`px-3 py-1 rounded text-white ${
                                                    g.is_active
                                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                }`}
                                            >
                                                {g.is_active ? "Désactiver" : "Activer"}
                                            </button>
                                            <Link
                                                href={`/admin/games/edit/${g.id}`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => deleteGame(g.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="text-gray-700">
              Page {page} sur {totalPages}
            </span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}