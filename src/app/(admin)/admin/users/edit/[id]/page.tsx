// src/app/(admin)/admin/users/edit/[id]/page.tsx.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function EditUserPage() {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const { id } = useParams();
    const [userData, setUserData] = useState<any>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "",
        is_active: false,
    });
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    // Vérifier si l'utilisateur a le rôle admin
    const isAdmin = hasRole("admin");

    // Récupérer les données de l'utilisateur
    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken && user) {
                try {
                    const response = await axios.get(`${API_URL}admin/users/${id}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    const userData = response.data;
                    setUserData(userData);
                    setFormData({
                        username: userData.username,
                        email: userData.email,
                        role: userData.role,
                        is_active: userData.is_active,
                    });
                } catch (error) {
                    console.error("Erreur lors de la récupération de l'utilisateur:", error);
                    toast.error("Erreur lors de la récupération de l'utilisateur.", {
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
        fetchUser();
    }, [user, id]);

    // Gérer les changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
    };

    // Soumettre le formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.patch(
                `${API_URL}admin/users/${id}/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            toast.success("Utilisateur mis à jour avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
            router.push("/admin/users");
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            toast.error(
                error.response?.data?.username?.[0] ||
                error.response?.data?.email?.[0] ||
                "Erreur lors de la mise à jour de l'utilisateur.",
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

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Seuls les administrateurs peuvent modifier des utilisateurs.</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return <p className="text-center text-lg">Utilisateur non trouvé.</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block font-medium">
                        Nom d'utilisateur
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role" className="block font-medium">
                        Rôle
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="admin">Administrateur</option>
                        <option value="editor">Éditeur</option>
                        <option value="viewer">Spectateur</option>
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
                        Actif
                    </label>
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