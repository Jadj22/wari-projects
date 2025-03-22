// src/app/(admin)/admin/programs/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

export default function ProgramsPage() {
    const { user } = useAuth();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    useEffect(() => {
        const fetchPrograms = async () => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken && user) {
                try {
                    const response = await axios.get(`${API_URL}programs/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    setPrograms(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des programmes:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, [user]);

    if (loading) {
        return <p className="text-center text-lg">Chargement des programmes...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des programmes</h1>
            {programs.length === 0 ? (
                <p>Aucun programme trouvé.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nom</th>
                        <th className="p-2 border">Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {programs.map((program: any) => (
                        <tr key={program.id}>
                            <td className="p-2 border">{program.id}</td>
                            <td className="p-2 border">{program.name}</td>
                            <td className="p-2 border">{program.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}