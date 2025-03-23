// src/app/programmes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchProgramById } from "@/services/api/clientApi";
import { Program } from "@/types/model";

export default function ProgramDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgramDetails = async () => {
            // Vérifier si id est un nombre valide
            const programId = parseInt(id as string, 10);
            if (isNaN(programId)) {
                setError("ID de programme invalide.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await fetchProgramById(programId);
                if (data) {
                    setProgram(data);
                } else {
                    setError("Programme non trouvé.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails du programme:", error);
                setError("Impossible de charger le programme. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProgramDetails();
        } else {
            setError("Aucun ID de programme fourni.");
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p>Chargement...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </main>
        );
    }

    if (!program) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p>Programme non trouvé.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-900 text-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold tracking-wide uppercase mb-6"
                >
                    Programme : {program.game_name || "Programme inconnu"}
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <p className="text-gray-300 mb-4">
                        <strong>Date de l'événement :</strong>{" "}
                        {new Date(program.event_date).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p className="text-gray-300 mb-4">
                        <strong>Détails :</strong> {program.details || "Aucun détail disponible."}
                    </p>
                    <p className="text-gray-300">
                        <strong>Statut :</strong> {program.is_published ? "Publié" : "Non publié"}
                    </p>
                </motion.div>
            </div>
        </main>
    );
}