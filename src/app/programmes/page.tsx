// src/app/programmes/page.tsx
"use client";

import { motion } from "framer-motion";
import { useClient } from "@/context/ClientContext";
import Card from "@/components/client/Card";
import SkeletonCard from "@/components/client/SkeletonCard";
import { Program } from "@/types/model";

export default function ProgrammesPage() {
    const { programs, loading } = useClient();

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
                {loading || programs.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {programs.map((program: Program, index: number) => (
                            <motion.div
                                key={program.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card
                                    date={new Date(program.event_date).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "short",
                                    })}
                                    location={program.game_name}
                                    description={program.details || "Match à venir"}
                                    type="program"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}