// src/app/pronostics/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchPredictionById } from "@/services/api/clientApi";
import { Prediction } from "@/types/model";

export default function PredictionDetailPage() {
    const { id } = useParams();
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPredictionDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchPredictionById(Number(id));
                if (data) {
                    setPrediction(data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails du pronostic:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPredictionDetails();
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

    if (!prediction) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p>Pronostic non trouvé.</p>
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
                    Pronostic : {prediction.game_name}
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <p className="text-gray-300 mb-4">
                        <strong>Date de prédiction :</strong>{" "}
                        {new Date(prediction.predicted_at).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <p className="text-gray-300 mb-4">
                        <strong>Auteur :</strong> {prediction.author_display}
                    </p>
                    <p className="text-gray-300 mb-4">
                        <strong>Description :</strong> {prediction.description}
                    </p>
                    <p className="text-gray-300">
                        <strong>Statut :</strong> {prediction.is_published ? "Publié" : "Non publié"}
                    </p>
                </motion.div>
            </div>
        </main>
    );
}