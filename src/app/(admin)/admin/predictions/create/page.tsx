"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface Game {
    id: number;
    name: string;
    slug: string;
}

export default function CreatePredictionPage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
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
        const fetchGames = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken || !user) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${API_URL}admin/games/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setGames(response.data.results);
            } catch (error) {
                console.error("Erreur lors de la récupération des jeux:", error);
                toast.error("Erreur lors de la récupération des jeux.");
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, [user]);

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

        // Validation côté client
        if (!formData.game) {
            toast.error("Veuillez sélectionner un jeu.");
            return;
        }
        if (formData.description.trim().length < 15) {
            toast.error("La description doit contenir au moins 15 caractères.");
            return;
        }

        setLoading(true);
        const accessToken = Cookies.get("accessToken");

        try {
            await axios.post(`${API_URL}admin/predictions/`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Prédiction créée avec succès !");
            router.push("/admin/predictions");
        } catch (error: any) {
            let message = "Erreur lors de la création de la prédiction.";
            if (error.response) {
                const errors = error.response.data;
                message =
                    errors?.description?.[0] ||
                    errors?.game?.[0] ||
                    errors?.detail ||
                    "Une erreur s’est produite sur le serveur.";
            } else if (error.request) {
                message = "Impossible de contacter le serveur. Vérifiez votre connexion.";
            }
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
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent créer des prédictions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Créer une prédiction</h1>
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
                    {loading ? "Création en cours..." : "Créer la prédiction"}
                </button>
            </form>
        </div>
    );
}