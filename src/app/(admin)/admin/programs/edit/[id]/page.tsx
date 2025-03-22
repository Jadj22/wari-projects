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

interface Program {
    id: number;
    game: string;
    event_date: string;
    details: string;
    is_published: boolean;
    game_name: string;
}

export default function EditProgramPage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const { id } = useParams();
    const [program, setProgram] = useState<Program | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [formData, setFormData] = useState({
        game: "",
        event_date: "",
        details: "",
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
                const [programResponse, gamesResponse] = await Promise.all([
                    axios.get(`${API_URL}admin/programs/${id}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                    axios.get(`${API_URL}admin/games/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);
                const programData = programResponse.data;
                setProgram(programData);
                setFormData({
                    game: programData.game || "",
                    event_date: new Date(programData.event_date).toISOString().slice(0, 16),
                    details: programData.details || "",
                    is_published: programData.is_published,
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
            await axios.patch(`${API_URL}admin/programs/${id}/`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Programme mis à jour avec succès !");
            router.push("/admin/programs");
        } catch (error: any) {
            const message =
                error.response?.data?.event_date?.[0] ||
                error.response?.data?.details?.[0] ||
                error.response?.data?.detail ||
                "Erreur lors de la mise à jour du programme.";
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
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent modifier des programmes.</p>
                </div>
            </div>
        );
    }

    if (!program) return <p className="text-center text-lg">Programme non trouvé.</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Modifier le programme : {program.game_name}</h1>
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
                    <label htmlFor="event_date" className="block font-medium text-gray-700">
                        Date de l’événement
                    </label>
                    <input
                        type="datetime-local"
                        id="event_date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className="w-full border rounded p-2 mt-1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="details" className="block font-medium text-gray-700">
                        Détails
                    </label>
                    <textarea
                        id="details"
                        name="details"
                        value={formData.details}
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
                    {loading ? "Mise à jour en cours..." : "Mettre à jour le programme"}
                </button>
            </form>
        </div>
    );
}