"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import { User } from "@/types/model"; // Importer le type User depuis model.ts

// Étendre l'interface User pour inclure les champs supplémentaires de l'API
interface ExtendedUser extends User {
    email: string;
    is_active: boolean;
    date_joined: string;
}

export default function UsersPage() {
    const { user, hasRole } = useAuth();
    const [users, setUsers] = useState<ExtendedUser[]>([]); // Typage explicite avec ExtendedUser
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://93.127.203.229:8000/api/"; // URL mise à jour pour le serveur

    const isAdmin = hasRole("admin");

    useEffect(() => {
        const fetchUsers = async () => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken && user) {
                try {
                    const response = await axios.get(`${API_URL}admin/users/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        params: { page },
                    });
                    setUsers(response.data.results);
                    setTotalPages(Math.ceil(response.data.count / 20));
                } catch (error) {
                    console.error("Erreur lors de la récupération des utilisateurs:", error);
                    toast.error("Erreur lors de la récupération des utilisateurs.", {
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
        fetchUsers();
    }, [user, page]);

    const toggleActive = async (userId: number, isActive: boolean) => {
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.patch(
                `${API_URL}admin/users/${userId}/`,
                { is_active: !isActive },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            setUsers(
                users.map((u) =>
                    u.id === userId ? { ...u, is_active: !isActive } : u
                )
            );
            toast.success(`Utilisateur ${isActive ? "désactivé" : "activé"} avec succès !`, {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            toast.error("Erreur lors de la mise à jour de l'utilisateur.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const deleteUser = async (userId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.delete(`${API_URL}admin/users/${userId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setUsers(users.filter((u) => u.id !== userId));
            toast.success("Utilisateur supprimé avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error: any) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error);
            toast.error(
                error.response?.data?.detail || "Erreur lors de la suppression de l'utilisateur.",
                {
                    position: "top-right",
                    autoClose: 5000,
                }
            );
        }
    };

    if (loading) {
        return <p className="text-center text-lg">Chargement des utilisateurs...</p>;
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Seuls les administrateurs peuvent gérer les utilisateurs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
            <Link
                href="/admin/users/create"
                className="mb-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Créer un utilisateur
            </Link>
            {users.length === 0 ? (
                <p>Aucun utilisateur trouvé.</p>
            ) : (
                <>
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Nom d'utilisateur</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Rôle</th>
                            <th className="p-2 border">Actif</th>
                            <th className="p-2 border">Date d'inscription</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="p-2 border">{u.id}</td>
                                <td className="p-2 border">{u.username}</td>
                                <td className="p-2 border">{u.email}</td>
                                <td className="p-2 border">{u.role || "N/A"}</td>
                                <td className="p-2 border">{u.is_active ? "Oui" : "Non"}</td>
                                <td className="p-2 border">
                                    {new Date(u.date_joined).toLocaleString()}
                                </td>
                                <td className="p-2 border">
                                    <button
                                        onClick={() => toggleActive(u.id, u.is_active)}
                                        className={`mr-2 px-2 py-1 rounded ${
                                            u.is_active
                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                : "bg-green-500 hover:bg-green-600"
                                        } text-white`}
                                    >
                                        {u.is_active ? "Désactiver" : "Activer"}
                                    </button>
                                    <Link
                                        href={`/admin/users/edit/${u.id}`}
                                        className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        onClick={() => deleteUser(u.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span>
                            Page {page} sur {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}