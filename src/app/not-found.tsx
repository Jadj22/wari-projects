// src/app/not-found.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLayout } from "@/context/LayoutContext";
import { useEffect } from "react";

export default function NotFound() {
    const { setShowHeaderFooter } = useLayout();

    useEffect(() => {
        setShowHeaderFooter(false); // Désactive le Header et le Footer
        return () => setShowHeaderFooter(true); // Réactive pour les autres pages
    }, [setShowHeaderFooter]);

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
            <div className="text-center">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl font-bold tracking-wide uppercase mb-6"
                >
                    404
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg font-medium tracking-wide mb-8"
                >
                    Page non trouvée.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Link
                        href="/"
                        className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold text-lg uppercase tracking-wide hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        Retour à l'accueil
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}