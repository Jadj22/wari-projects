// src/app/(admin)/admin/countries/page.tsx.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CountriesPage() {
    const { user, hasRole } = useAuth();
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    // Vérifier si l'utilisateur a le rôle admin ou editor
    const canEdit = hasRole("admin") || hasRole("editor");

    // Récupérer les pays
    useEffect(() => {
        const fetchCountries = async () => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken && user) {
                try {
                    const response = await axios.get(`${API_URL}admin/countries/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        params: { page },
                    });
                    setCountries(response.data.results);
                    setTotalPages(Math.ceil(response.data.count / 20));
                } catch (error) {
                    console.error("Erreur lors de la récupération des pays:", error);
                    toast.error("Erreur lors de la récupération des pays.", {
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
        fetchCountries();
    }, [user, page]);

    // Supprimer un pays
    const deleteCountry = async (countryId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce pays ?")) return;
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.delete(`${API_URL}admin/countries/${countryId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setCountries(countries.filter((c: any) => c.id !== countryId));
            toast.success("Pays supprimé avec succès !", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error: any) {
            console.error("Erreur lors de la suppression du pays:", error);
            toast.error(
                error.response?.data?.detail || "Erreur lors de la suppression du pays.",
                {
                    position: "top-right",
                    autoClose: 5000,
                }
            );
        }
    };

    if (loading) {
        return <p className="text-center text-lg">Chargement des pays...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des pays</h1>
            {canEdit && (
                <Link
                    href="/admin/countries/create"
                    className="mb-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Créer un pays
                </Link>
            )}
            {countries.length === 0 ? (
                <p>Aucun pays trouvé.</p>
            ) : (
                <>
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Nom</th>
                            <th className="p-2 border">Code</th>
                            <th className="p-2 border">Slug</th>
                            <th className="p-2 border">Nombre de jeux</th>
                            <th className="p-2 border">Créé le</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {countries.map((c: any) => (
                            <tr key={c.id}>
                                <td className="p-2 border">{c.id}</td>
                                <td className="p-2 border">{c.name}</td>
                                <td className="p-2 border">{c.code}</td>
                                <td className="p-2 border">{c.slug}</td>
                                <td className="p-2 border">{c.game_count}</td>
                                <td className="p-2 border">
                                    {new Date(c.created_at).toLocaleString()}
                                </td>
                                <td className="p-2 border">
                                    {canEdit && (
                                        <>
                                            <Link
                                                href={`/admin/countries/edit/${c.id}`}
                                                className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => deleteCountry(c.id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Supprimer
                                            </button>
                                        </>
                                    )}
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