// src/context/ClientContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchGames, fetchGameTypes, fetchCountries, fetchPredictions, fetchPrograms, fetchResults } from "@/services/api/clientApi";
import { Game, GameType, Country, Prediction, Program, Result } from "@/types/model";

interface ClientContextType {
    games: Game[];
    gameTypes: GameType[];
    countries: Country[];
    predictions: Prediction[];
    programs: Program[];
    results: Result[];
    loading: boolean;
    error: string | null; // Ajout d'un état pour les erreurs
    fetchGamesData: (filters?: any) => Promise<void>;
    fetchGameTypesData: (filters?: any) => Promise<void>;
    fetchCountriesData: (filters?: any) => Promise<void>;
    fetchPredictionsData: (filters?: any) => Promise<void>;
    fetchProgramsData: (filters?: any) => Promise<void>;
    fetchResultsData: (filters?: any) => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [gameTypes, setGameTypes] = useState<GameType[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // État pour les erreurs

    const fetchGamesData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null); // Réinitialiser l'erreur
            const response = await fetchGames(filters);
            setGames(response.results);
        } catch (error) {
            console.error("Erreur lors de la récupération des jeux:", error);
            setError("Impossible de charger les jeux. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchGameTypesData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchGameTypes(filters);
            setGameTypes(response.results);
        } catch (error) {
            console.error("Erreur lors de la récupération des types de jeux:", error);
            setError("Impossible de charger les types de jeux. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCountriesData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchCountries(filters);
            setCountries(response.results);
        } catch (error) {
            console.error("Erreur lors de la récupération des pays:", error);
            setError("Impossible de charger les pays. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPredictionsData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchPredictions(filters);
            setPredictions(response.results);
        } catch (error) {
            console.error("Erreur lors de la récupération des pronostics:", error);
            setError("Impossible de charger les pronostics. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProgramsData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchPrograms(filters);
            setPrograms(response.results);
        } catch (error) {
            console.error("Erreur lors de la récupération des programmes:", error);
            setError("Impossible de charger les programmes. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchResultsData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchResults(filters);
            setResults(response.results);
        } catch (error) {
            console.error("Erreur lors de la récupération des résultats:", error);
            setError("Impossible de charger les résultats. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Charger les données initiales au montage
        Promise.all([
            fetchGamesData({ is_active: true }),
            fetchGameTypesData(),
            fetchCountriesData(),
            fetchPredictionsData({ is_published: true }),
            fetchProgramsData({ is_published: true }),
            fetchResultsData({ status__in: ["official", "disputed"] }),
        ]);
    }, []);

    return (
        <ClientContext.Provider
            value={{
                games,
                gameTypes,
                countries,
                predictions,
                programs,
                results,
                loading,
                error, // Ajout de l'erreur au contexte
                fetchGamesData,
                fetchGameTypesData,
                fetchCountriesData,
                fetchPredictionsData,
                fetchProgramsData,
                fetchResultsData,
            }}
        >
            {children}
        </ClientContext.Provider>
    );
};

export const useClient = () => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error("useClient must be used within a ClientProvider");
    }
    return context;
};