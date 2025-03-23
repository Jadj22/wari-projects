// src/app/programmes/page.tsx
"use client";

import { motion } from "framer-motion";
import { useClient } from "@/context/ClientContext";
import Card from "@/components/client/Card";
import SkeletonCard from "@/components/client/SkeletonCard";
import { Program } from "@/types/model";
import Link from "next/link";

export default function ProgrammesPage() {
    const { programs, loading, error, hasMorePrograms, programsPage, fetchProgramsData } = useClient();

    const loadMore = () => {
        if (hasMorePrograms && !loading) {
            fetchProgramsData({ is_published: true }, programsPage + 1);
        }
    };

    if (error) {
        return (
            <main className="bg-gray-900 text-white min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold tracking-wide uppercase text-center mb-12">Tous les programmes</h1>
                    <p className="text-red-500">{error}</p>
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
                    className="text-4xl font-bold tracking-wide uppercase text-center mb-12"
                >
                    Tous les programmes
                </motion.h1>
                {loading && programs.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : programs.length === 0 ? (
                    <div className="text-center">
                        <p>Aucun programme disponible pour le moment....</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {programs.map((program: Program, index: number) => (
                                <Link href={`/programmes/${program.id}`} key={program.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card
                                            date={new Date(program.event_date).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "short",
                                            })}
                                            location={program.game_name || "Jeu inconnu"}
                                            description={program.details || "Match à venir"}
                                            type="program"
                                        />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                        {hasMorePrograms && (
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
        </main>
    );
}