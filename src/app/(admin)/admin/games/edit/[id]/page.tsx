"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
}

export default function EditGamePage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const { id } = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [gameTypes, setGameTypes] = useState<GameType[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        game_type_id: "",
        country_id: "",
        is_active: true,
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
                const [gameResponse, gameTypesResponse, countriesResponse] = await Promise.all([
                    axios.get(`${API_URL}admin/games/${id}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                    axios.get(`${API_URL}admin/game-types/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                    axios.get(`${API_URL}admin/countries/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);
                const gameData = gameResponse.data;
                setGame(gameData);
                setFormData({
                    name: gameData.name,
                    game_type_id: gameData.game_type.id,
                    country_id: gameData.country.id,
                    is_active: gameData.is_active,
                });
                setGameTypes(gameTypesResponse.data.results);
                setCountries(countriesResponse.data.results);
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
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
            await axios.patch(`${API_URL}admin/games/${id}/`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Jeu mis à jour avec succès !");
            router.push("/admin/games");
        } catch (error: any) {
            const message =
                error.response?.data?.name?.[0] ||
                error.response?.data?.country_id?.[0] ||
                error.response?.data?.game_type_id?.[0] ||
                error.response?.data?.detail ||
                "Erreur lors de la mise à jour du jeu.";
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
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent modifier des jeux.</p>
                </div>
            </div>
        );
    }

    if (!game) return <p className="text-center text-lg">Jeu non trouvé.</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Modifier le jeu : {game.name}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block font-medium text-gray-700">
                        Nom du jeu
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="game_type_id" className="block font-medium text-gray-700">
                        Type de jeu
                    </label>
                    <select
                        id="game_type_id"
                        name="game_type_id"
                        value={formData.game_type_id}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        required
                    >
                        <option value="">Sélectionner un type</option>
                        {gameTypes.map((gt) => (
                            <option key={gt.id} value={gt.id}>
                                {gt.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="country_id" className="block font-medium text-gray-700">
                        Pays
                    </label>
                    <select
                        id="country_id"
                        name="country_id"
                        value={formData.country_id}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        required
                    >
                        <option value="">Sélectionner un pays</option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="is_active" className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-gray-700">Actif</span>
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Mise à jour en cours..." : "Mettre à jour le jeu"}
                </button>
            </form>
        </div>
    );
}