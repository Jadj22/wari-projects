// src/services/api/clientApi.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

// Interface pour la réponse paginée
interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Fonction générique pour gérer les erreurs
const handleApiError = (error: any) => {
    console.error("Erreur API:", error);
    throw error;
};

// Récupérer les jeux (actifs uniquement pour les clients)
export const fetchGames = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/games/`, {
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

// Récupérer un jeu spécifique par ID
export const fetchGameById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/games/${id}/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

// Récupérer les types de jeux
export const fetchGameTypes = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/game-types/`, {
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

// Récupérer un type de jeu spécifique par slug
export const fetchGameTypeBySlug = async (slug: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/game-types/`, {
            params: { slug },
        });
        return response.data.results[0] || null;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

// Récupérer les pays
export const fetchCountries = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/countries/`, {
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

// Récupérer un pays spécifique par slug
export const fetchCountryBySlug = async (slug: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/countries/`, {
            params: { slug },
        });
        return response.data.results[0] || null;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

// Récupérer les pronostics publiés (pour les clients)
export const fetchPredictions = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/predictions/`, {
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

// Récupérer un pronostic spécifique par ID
export const fetchPredictionById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/predictions/${id}/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

// Récupérer les programmes publiés (pour les clients)
export const fetchPrograms = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/programs/`, {
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

// Récupérer un programme spécifique par ID
export const fetchProgramById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/programs/${id}/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

// Récupérer les résultats officiels ou contestés (pour les clients)
export const fetchResults = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/results/`, {
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

// Récupérer un résultat spécifique par ID
export const fetchResultById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/results/${id}/`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};