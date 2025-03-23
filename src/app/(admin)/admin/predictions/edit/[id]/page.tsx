"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface Game {
    id: number;
    name: string;
    slug: string;
}

interface Prediction {
    id: number;
    game: string;
    description: string;
    is_published: boolean;
    game_name: string;
}

export default function EditPredictionPage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const { id } = useParams();
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [formData, setFormData] = useState({
        game: "",
        description: "",
        is_published: false,
    });
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    const canEdit = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken || !user) {
                setLoading(false);
                return;
            }

            try {
                const [predictionResponse, gamesResponse] = await Promise.all([
                    axios.get(`${API_URL}admin/predictions/${id}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                    axios.get(`${API_URL}admin/games/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);
                const predictionData = predictionResponse.data;
                setPrediction(predictionData);
                setFormData({
                    game: predictionData.game || "",
                    description: predictionData.description || "",
                    is_published: predictionData.is_published,
                });
                setGames(gamesResponse.data.results);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
                toast.error("Erreur lors de la récupération des données.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const accessToken = Cookies.get("accessToken");

        try {
            await axios.patch(`${API_URL}admin/predictions/${id}/`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Prédiction mise à jour avec succès !");
            router.push("/admin/predictions");
        } catch (error: any) {
            const errors = error.response?.data;
            const message =
                errors?.description?.[0] ||
                errors?.game?.[0] ||
                errors?.detail ||
                "Erreur lors de la mise à jour de la prédiction.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center text-lg">Chargement...</p>;

    if (!canEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent modifier des prédictions.</p>
                </div>
            </div>
        );
    }

    if (!prediction) return <p className="text-center text-lg">Prédiction non trouvée.</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Modifier la prédiction : {prediction.game_name}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="game" className="block font-medium text-gray-700">
                        Jeu
                    </label>
                    <select
                        id="game"
                        name="game"
                        value={formData.game}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        required
                    >
                        <option value="">Sélectionner un jeu</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.slug}>
                                {game.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="description" className="block font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="is_published" className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_published"
                            name="is_published"
                            checked={formData.is_published}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-gray-700">Publié</span>
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Mise à jour en cours..." : "Mettre à jour la prédiction"}
                </button>
            </form>
        </div>
    );
}