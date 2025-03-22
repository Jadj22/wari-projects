"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";

interface Program {
    id: number;
    game_name: string;
    event_date: string;
    details: string;
    is_published: boolean;
}

export default function ProgramsPage() {
    const { user, hasRole } = useAuth();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    const canEdit = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchPrograms = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken || !user) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}admin/programs/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { page },
                });
                setPrograms(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 20));
            } catch (error) {
                console.error("Erreur lors de la récupération des programmes:", error);
                toast.error("Erreur lors de la récupération des programmes.");
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, [user, page]);

    const togglePublish = async (programId: number, isPublished: boolean) => {
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.patch(
                `${API_URL}admin/programs/${programId}/`,
                { is_published: !isPublished },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setPrograms((prev) =>
                prev.map((p) => (p.id === programId ? { ...p, is_published: !isPublished } : p))
            );
            toast.success(`Programme ${isPublished ? "dépublié" : "publié"} avec succès !`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du programme:", error);
            toast.error("Erreur lors de la mise à jour du programme.");
        }
    };

    const deleteProgram = async (programId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) return;
        const accessToken = Cookies.get("accessToken");
        try {
            await axios.delete(`${API_URL}admin/programs/${programId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setPrograms((prev) => prev.filter((p) => p.id !== programId));
            toast.success("Programme supprimé avec succès !");
        } catch (error: any) {
            const message =
                error.response?.data?.detail || "Erreur lors de la suppression du programme.";
            toast.error(message);
        }
    };

    if (loading) return <p className="text-center text-lg">Chargement des programmes...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Liste des programmes</h1>
                {canEdit && (
                    <Link
                        href="/admin/programs/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Créer un programme
                    </Link>
                )}
            </div>
            {programs.length === 0 ? (
                <p className="text-center text-gray-500">Aucun programme trouvé.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Jeu</th>
                                <th className="p-3 text-left">Date de l’événement</th>
                                <th className="p-3 text-left">Détails</th>
                                <th className="p-3 text-left">Publié</th>
                                {canEdit && <th className="p-3 text-left">Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {programs.map((program) => (
                                <tr key={program.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{program.id}</td>
                                    <td className="p-3">{program.game_name}</td>
                                    <td className="p-3">
                                        {new Date(program.event_date).toLocaleString()}
                                    </td>
                                    <td className="p-3">{program.details.slice(0, 50)}...</td>
                                    <td className="p-3">{program.is_published ? "Oui" : "Non"}</td>
                                    {canEdit && (
                                        <td className="p-3 flex space-x-2">
                                            <button
                                                onClick={() => togglePublish(program.id, program.is_published)}
                                                className={`px-3 py-1 rounded text-white ${
                                                    program.is_published
                                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                }`}
                                            >
                                                {program.is_published ? "Dépublier" : "Publier"}
                                            </button>
                                            <Link
                                                href={`/admin/programs/edit/${program.id}`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => deleteProgram(program.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="text-gray-700">
              Page {page} sur {totalPages}
            </span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}