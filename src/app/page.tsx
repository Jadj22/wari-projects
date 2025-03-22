// src/app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useClient } from "@/context/ClientContext";
import Card from "@/components/client/Card";
import SkeletonCard from "@/components/client/SkeletonCard";
import { Game, Prediction, Program, Result } from "@/types/model";

export default function Home() {
    const { games, programs, predictions, results, loading } = useClient();

    return (
        <main className="bg-gray-900 text-white min-h-screen">
            {/* Section Jeux disponibles */}
            <section className="py-16 bg-gray-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-4xl font-bold tracking-wide uppercase mb-6"
                    >
                        Jeux disponibles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg font-medium tracking-wide mb-12"
                    >
                        Découvrez nos sports et compétitions par catégorie.
                    </motion.p>
                    {loading || games.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {games.slice(0, 3).map((game: Game, index: number) => (
                                <motion.div
                                    key={game.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Card type="game" data={game} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/categories"
                            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group shadow-md"
                        >
                            Explorer toutes les catégories
                            <FaArrowRight className="text-black text-lg transition-transform duration-300 group-hover:translate-x-2" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Section Programme */}
            <section className="py-16 bg-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-4xl font-bold tracking-wide uppercase text-center mb-12"
                    >
                        Programme
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center text-lg font-medium tracking-wide mb-12"
                    >
                        Consultez les matchs à venir et leurs horaires.
                    </motion.p>
                    {loading || programs.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {programs.slice(0, 4).map((program: Program) => (
                                <Card
                                    key={program.id}
                                    date={new Date(program.event_date).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "short",
                                    })}
                                    location={program.game_name}
                                    description={program.details || "Match à venir"}
                                    type="program"
                                />
                            ))}
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/programmes"
                            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group shadow-md"
                        >
                            Voir tous les matchs
                            <FaArrowRight className="text-black text-lg transition-transform duration-300 group-hover:translate-x-2" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Section Pronostique */}
            <section className="py-16 bg-gray-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-4xl font-bold tracking-wide uppercase mb-6"
                    >
                        Pronostique
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg font-medium tracking-wide mb-12"
                    >
                        Bénéficiez de pronostics détaillés et fiables.
                    </motion.p>
                    {loading || predictions.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {predictions.slice(0, 3).map((prediction: Prediction, index: number) => (
                                <motion.div
                                    key={prediction.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Card type="prediction" data={prediction} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/pronostics"
                            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group shadow-md"
                        >
                            Découvrir nos pronostics
                            <FaArrowRight className="text-black text-lg transition-transform duration-300 group-hover:translate-x-2" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Section Résultats */}
            <section className="py-16 bg-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-4xl font-bold tracking-wide uppercase text-center mb-12"
                    >
                        Résultats
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center text-lg font-medium tracking-wide mb-12"
                    >
                        Consultez les résultats officiels et contestés des matchs.
                    </motion.p>
                    {loading || results.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {results.slice(0, 4).map((result: Result) => (
                                <Card
                                    key={result.id}
                                    date={new Date(result.result_date).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "short",
                                    })}
                                    location={result.game} // Note: Ajouter game_name dans ResultSerializer serait idéal
                                    description={
                                        result.outcome_details?.score
                                            ? `Score: ${result.outcome_details.score}`
                                            : result.outcome || "Résultat non détaillé"
                                    }
                                    type="result"
                                />
                            ))}
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/resultats"
                            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group shadow-md"
                        >
                            Voir tous les résultats
                            <FaArrowRight className="text-black text-lg transition-transform duration-300 group-hover:translate-x-2" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}