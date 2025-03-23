// src/services/api/clientApi.ts
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

const handleApiError = (error: any) => {
    console.error("Erreur API:", error);
    throw error;
};

const getAuthHeaders = () => {
    const accessToken = Cookies.get("accessToken");
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const fetchGames = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/games/`, {
            headers: getAuthHeaders(),
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

export const fetchGameById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/games/${id}/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

export const fetchGameTypes = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/game-types/`, {
            headers: getAuthHeaders(),
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

export const fetchGameTypeBySlug = async (slug: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/game-types/`, {
            headers: getAuthHeaders(),
            params: { slug },
        });
        return response.data.results[0] || null;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

export const fetchCountries = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/countries/`, {
            headers: getAuthHeaders(),
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

export const fetchCountryBySlug = async (slug: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/countries/`, {
            headers: getAuthHeaders(),
            params: { slug },
        });
        return response.data.results[0] || null;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

export const fetchPredictions = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/predictions/`, {
            headers: getAuthHeaders(),
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

export const fetchPredictionById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/predictions/${id}/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

export const fetchPrograms = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/programs/`, {
            headers: getAuthHeaders(),
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

export const fetchProgramById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/programs/${id}/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

export const fetchResults = async (filters: any = {}, page: number = 1): Promise<PaginatedResponse<any>> => {
    try {
        const response = await axios.get(`${API_URL}client/results/`, {
            headers: getAuthHeaders(),
            params: { ...filters, page },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return { count: 0, next: null, previous: null, results: [] };
    }
};

export const fetchResultById = async (id: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}client/results/${id}/`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        return null;
    }
};