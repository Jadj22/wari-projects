// src/app/categories/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchGames } from "@/services/api/clientApi";
import { Game } from "@/types/model";

export default function CategoryDetailPage() {
    const { slug } = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                setLoading(true);
                const response = await fetchGames({ slug });
                if (response.results.length > 0) {
                    setGame(response.results[0]);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails du jeu:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchGameDetails();
        }
    }, [slug]);

    if (loading) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p>Chargement...</p>
                </div>
            </main>
        );
    }

    if (!game) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p>Jeu non trouvé.</p>
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
                    {game.name}
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <p className="text-gray-300 mb-4">
                        <strong>Type de jeu :</strong> {game.game_type.name}
                    </p>
                    <p className="text-gray-300 mb-4">
                        <strong>Pays :</strong> {game.country.name}
                    </p>
                    <p className="text-gray-300 mb-4">
                        <strong>Description :</strong> {game.description || "Aucune description disponible."}
                    </p>
                    <p className="text-gray-300">
                        <strong>Statut :</strong> {game.is_active ? "Actif" : "Inactif"}
                    </p>
                </motion.div>
            </div>
        </main>
    );
}