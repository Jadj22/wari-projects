// src/app/categories/page.tsx
"use client";

import { motion } from "framer-motion";
import { useClient } from "@/context/ClientContext";
import Card from "@/components/client/Card";
import SkeletonCard from "@/components/client/SkeletonCard";
import { Game } from "@/types/model";

export default function CategoriesPage() {
    const { games, loading } = useClient();

    return (
        <main className="bg-gray-900 text-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold tracking-wide uppercase text-center mb-12"
                >
                    Toutes les catégories
                </motion.h1>
                {loading || games.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {games.map((game: Game, index: number) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card type="game" data={game} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}