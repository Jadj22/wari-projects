// src/app/resultats/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchResultById } from "@/services/api/clientApi";
import { Result } from "@/types/model";

export default function ResultDetailPage() {
    const { id } = useParams();
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResultDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchResultById(Number(id));
                if (data) {
                    setResult(data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails du résultat:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResultDetails();
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

    if (!result) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p>Résultat non trouvé.</p>
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
                    Résultat : {result.game} {/* Note: Utiliser game_name si ajouté dans ResultSerializer */}
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <p className="text-gray-300 mb-4">
                        <strong>Date du résultat :</strong>{" "}
                        {new Date(result.result_date).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p className="text-gray-300 mb-4">
                        <strong>Résultat :</strong> {result.outcome || "Non spécifié"}
                    </p>
                    {result.outcome_details && Object.keys(result.outcome_details).length > 0 && (
                        <div className="text-gray-300 mb-4">
                            <strong>Détails structurés :</strong>
                            <ul className="list-disc list-inside ml-4">
                                {Object.entries(result.outcome_details).map(([key, value]) => (
                                    <li key={key}>
                                        {key}: {value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p className="text-gray-300 mb-4">
                        <strong>Statut :</strong> {result.status === "official" ? "Officiel" : "Contesté"}
                    </p>
                    <p className="text-gray-300">
                        <strong>Validé par :</strong> {result.validated_by || "Non validé"}
                    </p>
                </motion.div>
            </div>
        </main>
    );
}