// src/app/(admin)/admin/countries/create/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function CreateCountryPage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
    });
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    // Vérifier si l'utilisateur a le rôle admin ou editor
    const canEdit = hasRole("admin") || hasRole("editor");

    // Gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "code" ? value.toUpperCase() : value, // Forcer le code en majuscules
        });
    };

    // Soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.post(`${API_URL}admin/countries/`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Pays créé avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
            router.push("/admin/countries");
        } catch (error: any) {
            console.error("Erreur lors de la création du pays:", error);
            toast.error(
                error.response?.data?.name?.[0] ||
                error.response?.data?.code?.[0] ||
                error.response?.data?.detail ||
                "Erreur lors de la création du pays.",
                {
                    position: "top-right",
                    autoClose: 5000,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    if (!canEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent créer des pays.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Créer un pays</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium">
                        Nom
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="code" className="block font-medium">
                        Code ISO (3 lettres)
                    </label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        maxLength={3}
                        minLength={3}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Création..." : "Créer"}
                </button>
            </form>
        </div>
    );
}