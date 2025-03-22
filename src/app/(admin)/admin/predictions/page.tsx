"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";

interface Prediction {
    id: number;
    game_name: string;
    description: string;
    predicted_at: string;
    author_display: string;
    is_published: boolean;
}

export default function PredictionsPage() {
    const { user, hasRole } = useAuth();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    const canEdit = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchPredictions = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken || !user) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}admin/predictions/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { page },
                });
                setPredictions(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 20));
            } catch (error) {
                console.error("Erreur lors de la récupération des prédictions:", error);
                toast.error("Erreur lors de la récupération des prédictions.");
            } finally {
                setLoading(false);
            }
        };
        fetchPredictions();
    }, [user, page]);

    const togglePublish = async (predictionId: number, isPublished: boolean) => {
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.patch(
                `${API_URL}admin/predictions/${predictionId}/`,
                { is_published: !isPublished },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setPredictions((prev) =>
                prev.map((p) => (p.id === predictionId ? { ...p, is_published: !isPublished } : p))
            );
            toast.success(`Prédiction ${isPublished ? "dépubliée" : "publiée"} avec succès !`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la prédiction:", error);
            toast.error("Erreur lors de la mise à jour de la prédiction.");
        }
    };

    const deletePrediction = async (predictionId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette prédiction ?")) return;
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.delete(`${API_URL}admin/predictions/${predictionId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setPredictions((prev) => prev.filter((p) => p.id !== predictionId));
            toast.success("Prédiction supprimée avec succès !");
        } catch (error: any) {
            const message =
                error.response?.data?.detail || "Erreur lors de la suppression de la prédiction.";
            toast.error(message);
        }
    };

    if (loading) return <p className="text-center text-lg">Chargement des prédictions...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des prédictions</h1>
                {canEdit && (
                    <Link
                        href="/admin/predictions/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Créer une prédiction
                    </Link>
                )}
            </div>
            {predictions.length === 0 ? (
                <p className="text-center text-gray-500">Aucune prédiction trouvée.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Jeu</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Date de prédiction</th>
                                <th className="p-3 text-left">Auteur</th>
                                <th className="p-3 text-left">Publié</th>
                                {canEdit && <th className="p-3 text-left">Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {predictions.map((prediction) => (
                                <tr key={prediction.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{prediction.id}</td>
                                    <td className="p-3">{prediction.game_name}</td>
                                    <td className="p-3">{prediction.description.slice(0, 50)}...</td>
                                    <td className="p-3">
                                        {new Date(prediction.predicted_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">{prediction.author_display}</td>
                                    <td className="p-3">{prediction.is_published ? "Oui" : "Non"}</td>
                                    {canEdit && (
                                        <td className="p-3 flex space-x-2">
                                            <button
                                                onClick={() => togglePublish(prediction.id, prediction.is_published)}
                                                className={`px-3 py-1 rounded text-white ${
                                                    prediction.is_published
                                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                }`}
                                            >
                                                {prediction.is_published ? "Dépublier" : "Publier"}
                                            </button>
                                            <Link
                                                href={`/admin/predictions/edit/${prediction.id}`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => deletePrediction(prediction.id)}
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