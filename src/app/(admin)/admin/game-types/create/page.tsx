"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function CreateGameTypePage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    const canEdit = hasRole("admin") || hasRole("editor");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
            await axios.post(`${API_URL}admin/game-types/`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Type de jeu créé avec succès !");
            router.push("/admin/game-types");
        } catch (error: any) {
            const message =
                error.response?.data?.name?.[0] ||
                error.response?.data?.detail ||
                "Erreur lors de la création du type de jeu.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!canEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent créer des types de jeux.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Créer un type de jeu</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block font-medium text-gray-700">
                        Nom du type de jeu
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
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Création en cours..." : "Créer le type de jeu"}
                </button>
            </form>
        </div>
    );
}