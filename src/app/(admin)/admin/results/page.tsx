"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";

interface Result {
    id: number;
    game_name: string;
    result_date: string;
    outcome: string;
    status: "pending" | "official" | "disputed";
    validated_by: string | null;
}

export default function ResultsPage() {
    const { user, hasRole } = useAuth();
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";
    const canEdit = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchResults = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken || !user) {
                setLoading(false);
                toast.error("Veuillez vous connecter pour voir les résultats.");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}admin/results/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { page },
                });
                setResults(response.data.results || []);
                setTotalPages(Math.ceil(response.data.count / 20) || 1);
            } catch (error) {
                console.error("Erreur lors de la récupération des résultats:", error);
                toast.error("Erreur lors de la récupération des résultats.");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user, page]);

    const updateStatus = async (resultId: number, newStatus: "official" | "pending") => {
        const accessToken = Cookies.get("accessToken");
        try {
            const response = await axios.patch(
                `${API_URL}admin/results/${resultId}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setResults((prev) =>
                prev.map((result) =>
                    result.id === resultId
                        ? { ...result, status: newStatus, validated_by: response.data.validated_by }
                        : result
                )
            );
            toast.success(`Résultat marqué comme ${newStatus === "official" ? "officiel" : "en attente"} !`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
            toast.error("Erreur lors de la mise à jour du statut.");
        }
    };

    const deleteResult = async (resultId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce résultat ?")) return;
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.delete(`${API_URL}admin/results/${resultId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setResults((prev) => prev.filter((result) => result.id !== resultId));
            toast.success("Résultat supprimé avec succès !");
        } catch (error: any) {
            const message =
                error.response?.data?.detail || "Erreur lors de la suppression du résultat.";
            toast.error(message);
        }
    };

    if (loading) return <p className="text-center text-lg">Chargement des résultats...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des résultats</h1>
                {canEdit && (
                    <Link
                        href="/admin/results/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Créer un résultat
                    </Link>
                )}
            </div>
            {results.length === 0 ? (
                <p className="text-center text-gray-500">Aucun résultat trouvé.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Jeu</th>
                                <th className="p-3 text-left">Date du résultat</th>
                                <th className="p-3 text-left">Résultat</th>
                                <th className="p-3 text-left">Statut</th>
                                <th className="p-3 text-left">Validé par</th>
                                {canEdit && <th className="p-3 text-left">Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((result) => (
                                <tr key={result.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{result.id}</td>
                                    <td className="p-3">{result.game_name}</td>
                                    <td className="p-3">
                                        {new Date(result.result_date).toLocaleString()}
                                    </td>
                                    <td className="p-3">{result.outcome.slice(0, 50)}...</td>
                                    <td className="p-3">{result.status}</td>
                                    <td className="p-3">{result.validated_by || "N/A"}</td>
                                    {canEdit && (
                                        <td className="p-3 flex space-x-2">
                                            {result.status !== "official" && (
                                                <button
                                                    onClick={() => updateStatus(result.id, "official")}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Marquer officiel
                                                </button>
                                            )}
                                            {result.status !== "pending" && (
                                                <button
                                                    onClick={() => updateStatus(result.id, "pending")}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                >
                                                    Marquer en attente
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/results/edit/${result.id}`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => deleteResult(result.id)}
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
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="text-gray-700">
              Page {page} sur {totalPages}
            </span>
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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