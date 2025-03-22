// src/app/(admin)/admin/countries/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function EditCountryPage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const { id } = useParams();
    const [country, setCountry] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
    });
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    // Vérifier si l'utilisateur a le rôle admin ou editor
    const canEdit = hasRole("admin") || hasRole("editor");

    // Récupérer les données du pays
    useEffect(() => {
        const fetchCountry = async () => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken && user) {
                try {
                    const response = await axios.get(`${API_URL}admin/countries/${id}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    const data = response.data;
                    setCountry(data);
                    setFormData({
                        name: data.name,
                        code: data.code,
                    });
                } catch (error) {
                    console.error("Erreur lors de la récupération du pays:", error);
                    toast.error("Erreur lors de la récupération du pays.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchCountry();
    }, [user, id]);

    // Gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "code" ? value.toUpperCase() : value,
        });
    };

    // Soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.patch(`${API_URL}admin/countries/${id}/`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            toast.success("Pays mis à jour avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
            router.push("/admin/countries");
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour du pays:", error);
            toast.error(
                error.response?.data?.name?.[0] ||
                error.response?.data?.code?.[0] ||
                error.response?.data?.detail ||
                "Erreur lors de la mise à jour du pays.",
                {
                    position: "top-right",
                    autoClose: 5000,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center text-lg">Chargement...</p>;
    }

    if (!canEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent modifier des pays.</p>
                </div>
            </div>
        );
    }

    if (!country) {
        return <p className="text-center text-lg">Pays non trouvé.</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Modifier le pays</h1>
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
                    {loading ? "Mise à jour..." : "Mettre à jour"}
                </button>
            </form>
        </div>
    );
}