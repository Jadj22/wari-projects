// src/components/client/Card.tsx
import Link from "next/link";
import { motion } from "framer-motion";
import { Prediction, Game, Program, Result } from "@/types/model";

interface CardProps {
    type: "game" | "prediction" | "result" | "program";
    data?: Prediction | Game | Program | Result | any;
    date?: string;
    location?: string;
    description?: string;
}

export default function Card({ type, data, date, location, description }: CardProps) {
    const content = data || { date, location, description };
    let title = "";
    let link = "";

    switch (type) {
        case "game":
            title = content.name;
            link = `/categories/${content.slug}`;
            break;
        case "prediction":
            title = `Prédiction: ${content.game_name}`;
            link = `/pronostics/${content.id}`;
            break;
        case "result":
            title = `${content.date} - ${content.location}`;
            link = `/resultats/${content.id || content.date}`;
            break;
        case "program":
            title = `${content.date} - ${content.location}`;
            link = `/programmes/${content.id || content.date}`;
            break;
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 transition-all duration-300 hover:border-yellow-400"
        >
            <Link href={link}>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">{title}</h3>
                <p className="text-gray-300">{content.description || "Détails à venir..."}</p>
            </Link>
        </motion.div>
    );
}