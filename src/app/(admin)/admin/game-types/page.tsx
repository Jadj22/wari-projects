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
    slug: string;
    game_count: number;
    created_at: string;
}

export default function GameTypesPage() {
    const { user, hasRole } = useAuth();
    const [gameTypes, setGameTypes] = useState<GameType[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    const canEdit = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchGameTypes = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken || !user) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}admin/game-types/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { page },
                });
                setGameTypes(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 20));
            } catch (error) {
                console.error("Erreur lors de la récupération des types de jeux:", error);
                toast.error("Erreur lors de la récupération des types de jeux.");
            } finally {
                setLoading(false);
            }
        };
        fetchGameTypes();
    }, [user, page]);

    const deleteGameType = async (gameTypeId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce type de jeu ?")) return;
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.delete(`${API_URL}admin/game-types/${gameTypeId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setGameTypes((prev) => prev.filter((gt) => gt.id !== gameTypeId));
            toast.success("Type de jeu supprimé avec succès !");
        } catch (error: any) {
            const message =
                error.response?.data?.detail || "Erreur lors de la suppression du type de jeu.";
            toast.error(message);
        }
    };

    if (loading) return <p className="text-center text-lg">Chargement des types de jeux...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des types de jeux</h1>
                {canEdit && (
                    <Link
                        href="/admin/game-types/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Créer un type de jeu
                    </Link>
                )}
            </div>
            {gameTypes.length === 0 ? (
                <p className="text-center text-gray-500">Aucun type de jeu trouvé.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nom</th>
                                <th className="p-3 text-left">Slug</th>
                                <th className="p-3 text-left">Nombre de jeux</th>
                                <th className="p-3 text-left">Créé le</th>
                                {canEdit && <th className="p-3 text-left">Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {gameTypes.map((gt) => (
                                <tr key={gt.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{gt.id}</td>
                                    <td className="p-3">{gt.name}</td>
                                    <td className="p-3">{gt.slug}</td>
                                    <td className="p-3">{gt.game_count}</td>
                                    <td className="p-3">{new Date(gt.created_at).toLocaleDateString()}</td>
                                    {canEdit && (
                                        <td className="p-3 flex space-x-2">
                                            <Link
                                                href={`/admin/game-types/edit/${gt.id}`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => deleteGameType(gt.id)}
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