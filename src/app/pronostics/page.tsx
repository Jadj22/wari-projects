// src/app/pronostics/page.tsx
"use client";

import { useEffect } from "react";
import { useClient } from "@/context/ClientContext";
import SkeletonCard from "@/components/SkeletonCard";
import Link from "next/link";

export default function Pronostics() {
    const { predictions, loading, error, hasMorePredictions, fetchPredictionsData, predictionsPage } = useClient();

    useEffect(() => {
        fetchPredictionsData({ is_published: true }, 1);
    }, [fetchPredictionsData]);

    const loadMore = () => {
        if (hasMorePredictions && !loading) {
            fetchPredictionsData({ is_published: true }, predictionsPage + 1);
        }
    };

    if (loading && predictions.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Pronostics</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Pronostics</h1>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Pronostics</h1>
            {predictions.length === 0 ? (
                <p>Aucun pronostic disponible pour le moment.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {predictions.map((prediction) => (
                            <Link href={`/pronostics/${prediction.id}`} key={prediction.id}>
                                <div className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                                    <h2 className="text-xl font-semibold">{prediction.game?.name || "Jeu inconnu"}</h2>
                                    <p>Prédiction : {prediction.description || "N/A"}</p>
                                    <p>Par : {prediction.author?.username || "Anonyme"}</p>
                                    <p>Date : {new Date(prediction.predicted_at).toLocaleDateString("fr-FR")}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {hasMorePredictions && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {loading ? "Chargement..." : "Charger plus"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}