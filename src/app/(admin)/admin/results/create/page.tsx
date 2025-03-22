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

export default function CreateResultPage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const [games, setGames] = useState<Game[]>([]);
    const [formData, setFormData] = useState({
        game: "",
        result_date: "",
        outcome: "",
        outcome_details: "",
        status: "pending" as "pending" | "official" | "disputed",
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
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const accessToken = Cookies.get("accessToken");

        try {
            // Validation JSON pour outcome_details
            let outcomeDetails = {};
            if (formData.outcome_details) {
                try {
                    outcomeDetails = JSON.parse(formData.outcome_details);
                    if (typeof outcomeDetails !== "object" || Array.isArray(outcomeDetails)) {
                        throw new Error("Les détails structurés doivent être un objet JSON valide.");
                    }
                } catch (jsonError) {
                    toast.error("Les détails structurés doivent être un objet JSON valide.");
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                ...formData,
                outcome_details: outcomeDetails,
            };

            await axios.post(`${API_URL}admin/results/`, payload, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Résultat créé avec succès !");
            router.push("/admin/results");
        } catch (error: any) {
            const message =
                error.response?.data?.outcome?.[0] ||
                error.response?.data?.result_date?.[0] ||
                error.response?.data?.game?.[0] ||
                error.response?.data?.detail ||
                "Erreur lors de la création du résultat.";
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
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent créer des résultats.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Créer un résultat</h1>
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
                    <label htmlFor="result_date" className="block font-medium text-gray-700">
                        Date du résultat
                    </label>
                    <input
                        type="datetime-local"
                        id="result_date"
                        name="result_date"
                        value={formData.result_date}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="outcome" className="block font-medium text-gray-700">
                        Résultat (texte libre)
                    </label>
                    <textarea
                        id="outcome"
                        name="outcome"
                        value={formData.outcome}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="outcome_details" className="block font-medium text-gray-700">
                        Détails structurés (JSON)
                    </label>
                    <textarea
                        id="outcome_details"
                        name="outcome_details"
                        value={formData.outcome_details}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        rows={4}
                        placeholder='Exemple : {"score": "2-1", "winner": "Équipe A"}'
                    />
                </div>
                <div>
                    <label htmlFor="status" className="block font-medium text-gray-700">
                        Statut
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                    >
                        <option value="pending">En attente</option>
                        <option value="official">Officiel</option>
                        <option value="disputed">Contesté</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Création en cours..." : "Créer le résultat"}
                </button>
            </form>
        </div>
    );
}