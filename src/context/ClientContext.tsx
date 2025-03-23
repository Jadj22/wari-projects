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
    error: string | null;
    predictionsPage: number;
    hasMorePredictions: boolean;
    programsPage: number;
    hasMorePrograms: boolean;
    fetchGamesData: (filters?: any) => Promise<void>;
    fetchGameTypesData: (filters?: any) => Promise<void>;
    fetchCountriesData: (filters?: any) => Promise<void>;
    fetchPredictionsData: (filters?: any, page?: number) => Promise<void>;
    fetchProgramsData: (filters?: any, page?: number) => Promise<void>;
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
    const [error, setError] = useState<string | null>(null);
    const [predictionsPage, setPredictionsPage] = useState(1);
    const [hasMorePredictions, setHasMorePredictions] = useState(true);
    const [programsPage, setProgramsPage] = useState(1);
    const [hasMorePrograms, setHasMorePrograms] = useState(true);

    const fetchGamesData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchGames(filters);
            setGames(response.results || []);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des jeux:", error);
            setError(error.response?.data?.detail || "Impossible de charger les jeux. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchGameTypesData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchGameTypes(filters);
            setGameTypes(response.results || []);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des types de jeux:", error);
            setError(error.response?.data?.detail || "Impossible de charger les types de jeux. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCountriesData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchCountries(filters);
            setCountries(response.results || []);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des pays:", error);
            setError(error.response?.data?.detail || "Impossible de charger les pays. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPredictionsData = async (filters = {}, page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchPredictions({ ...filters, page });
            if (page === 1) {
                setPredictions(response.results || []);
            } else {
                setPredictions((prev) => [...prev, ...(response.results || [])]);
            }
            setPredictionsPage(page);
            setHasMorePredictions(!!response.next);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des pronostics:", error);
            setError(error.response?.data?.detail || "Impossible de charger les pronostics. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProgramsData = async (filters = {}, page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchPrograms({ ...filters, page });
            if (page === 1) {
                setPrograms(response.results || []);
            } else {
                setPrograms((prev) => [...prev, ...(response.results || [])]);
            }
            setProgramsPage(page);
            setHasMorePrograms(!!response.next);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des programmes:", error);
            setError(error.response?.data?.detail || "Impossible de charger les programmes. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const fetchResultsData = async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchResults(filters);
            setResults(response.results || []);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des résultats:", error);
            setError(error.response?.data?.detail || "Impossible de charger les résultats. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Promise.all([
            fetchGamesData({ is_active: true }),
            fetchGameTypesData(),
            fetchCountriesData(),
            fetchPredictionsData({ is_published: true }, 1),
            fetchProgramsData({ is_published: true }, 1),
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
                error,
                predictionsPage,
                hasMorePredictions,
                programsPage,
                hasMorePrograms,
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