// src/app/(admin)/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Enregistrer les composants de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement);

interface DashboardStats {
    usersCount: number;
    gamesCount: number;
    gameTypesCount: number;
    countriesCount: number;
    predictionsCount: number;
    resultsCount: number;
    usersByRole: { [key: string]: number };
    gamesByCountry: { [key: string]: number };
    predictionsByDay: { [key: string]: number };
}

export default function DashboardPage() {
    const { user, hasRole } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        usersCount: 0,
        gamesCount: 0,
        gameTypesCount: 0,
        countriesCount: 0,
        predictionsCount: 0,
        resultsCount: 0,
        usersByRole: { admin: 0, editor: 0, viewer: 0 },
        gamesByCountry: {},
        predictionsByDay: {},
    });
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    // Vérifier si l'utilisateur a le rôle admin ou editor
    const canView = hasRole("admin") || hasRole("editor");

    // Récupérer les statistiques
    useEffect(() => {
        const fetchStats = async () => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken && user) {
                try {
                    const [
                        usersResponse,
                        gamesResponse,
                        gameTypesResponse,
                        countriesResponse,
                        predictionsResponse,
                        resultsResponse,
                    ] = await Promise.all([
                        axios.get(`${API_URL}admin/users/`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }),
                        axios.get(`${API_URL}admin/games/`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }),
                        axios.get(`${API_URL}admin/game-types/`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }),
                        axios.get(`${API_URL}admin/countries/`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }),
                        axios.get(`${API_URL}admin/predictions/`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }),
                        axios.get(`${API_URL}admin/results/`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }),
                    ]);

                    // Calculer les utilisateurs par rôle
                    const usersByRole = usersResponse.data.results.reduce((acc: any, u: any) => {
                        acc[u.role] = (acc[u.role] || 0) + 1;
                        return acc;
                    }, { admin: 0, editor: 0, viewer: 0 });

                    // Calculer les jeux par pays
                    const gamesByCountry = gamesResponse.data.results.reduce((acc: any, g: any) => {
                        const countryName = g.country.name;
                        acc[countryName] = (acc[countryName] || 0) + 1;
                        return acc;
                    }, {});

                    // Calculer les prédictions par jour (simplifié)
                    const predictionsByDay = predictionsResponse.data.results.reduce((acc: any, p: any) => {
                        const date = new Date(p.created_at).toLocaleDateString();
                        acc[date] = (acc[date] || 0) + 1;
                        return acc;
                    }, {});

                    setStats({
                        usersCount: usersResponse.data.count,
                        gamesCount: gamesResponse.data.count,
                        gameTypesCount: gameTypesResponse.data.count,
                        countriesCount: countriesResponse.data.count,
                        predictionsCount: predictionsResponse.data.count,
                        resultsCount: resultsResponse.data.count,
                        usersByRole,
                        gamesByCountry,
                        predictionsByDay,
                    });
                } catch (error) {
                    console.error("Erreur lors de la récupération des statistiques:", error);
                    toast.error("Erreur lors de la récupération des statistiques.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    if (!canView) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2">Seuls les administrateurs et éditeurs peuvent accéder au tableau de bord.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <p className="text-center text-lg p-6">Chargement des statistiques...</p>;
    }

    // Données pour les graphiques
    const usersByRoleData = {
        labels: ["Administrateurs", "Éditeurs", "Spectateurs"],
        datasets: [
            {
                data: [stats.usersByRole.admin, stats.usersByRole.editor, stats.usersByRole.viewer],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    const gamesByCountryData = {
        labels: Object.keys(stats.gamesByCountry),
        datasets: [
            {
                label: "Jeux par pays",
                data: Object.values(stats.gamesByCountry),
                backgroundColor: "#36A2EB",
                borderColor: "#36A2EB",
                borderWidth: 1,
            },
        ],
    };

    const predictionsByDayData = {
        labels: Object.keys(stats.predictionsByDay),
        datasets: [
            {
                label: "Prédictions par jour",
                data: Object.values(stats.predictionsByDay),
                fill: false,
                borderColor: "#FF6384",
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Tableau de bord Admin</h1>
            <p className="mb-6 text-gray-600">Bienvenue, {user?.username} ! Votre rôle est : {user?.role}.</p>

            {/* Cards avec statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a2 2 0 00-2-2h-3m-2-2H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">Utilisateurs</h2>
                        <p className="text-2xl font-bold text-gray-800">{stats.usersCount}</p>
                        <p className="text-xs text-green-500">+{Math.round(stats.usersCount * 0.1)}% depuis hier</p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">Jeux</h2>
                        <p className="text-2xl font-bold text-gray-800">{stats.gamesCount}</p>
                        <p className="text-xs text-green-500">+{Math.round(stats.gamesCount * 0.1)}% depuis hier</p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">Pays</h2>
                        <p className="text-2xl font-bold text-gray-800">{stats.countriesCount}</p>
                        <p className="text-xs text-green-500">+{Math.round(stats.countriesCount * 0.1)}% depuis hier</p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500">Prédictions</h2>
                        <p className="text-2xl font-bold text-gray-800">{stats.predictionsCount}</p>
                        <p className="text-xs text-green-500">+{Math.round(stats.predictionsCount * 0.1)}% depuis hier</p>
                    </div>
                </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique en ligne : Prédictions par jour */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Prédictions par jour</h2>
                    <div className="h-64">
                        <Line data={predictionsByDayData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Histogramme : Jeux par pays */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Jeux par pays</h2>
                    <div className="h-64">
                        <Bar data={gamesByCountryData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Donut chart : Répartition des rôles */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Répartition des rôles</h2>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={usersByRoleData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
}