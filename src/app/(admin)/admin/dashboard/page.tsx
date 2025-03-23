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
    const canView = hasRole("admin") || hasRole("editor");

    useEffect(() => {
        const fetchStats = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken) {
                toast.error("Vous devez être connecté pour accéder au tableau de bord.", {
                    position: "top-right",
                    autoClose: 5000,
                });
                setLoading(false);
                return;
            }
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const [
                    usersResponse,
                    gamesResponse,
                    gameTypesResponse,
                    countriesResponse,
                    predictionsResponse,
                    resultsResponse,
                ] = await Promise.all([
                    axios.get(`${API_URL}admin/users/`, { headers: { Authorization: `Bearer ${accessToken}` } }),
                    axios.get(`${API_URL}admin/games/`, { headers: { Authorization: `Bearer ${accessToken}` } }),
                    axios.get(`${API_URL}admin/game-types/`, { headers: { Authorization: `Bearer ${accessToken}` } }),
                    axios.get(`${API_URL}admin/countries/`, { headers: { Authorization: `Bearer ${accessToken}` } }),
                    axios.get(`${API_URL}admin/predictions/`, { headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => ({ data: { count: 0, results: [] } })),
                    axios.get(`${API_URL}admin/results/`, { headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => ({ data: { count: 0, results: [] } })),
                ]);

                const usersByRole = usersResponse.data.results.reduce((acc: any, u: any) => {
                    const role = u.role || "viewer";
                    acc[role] = (acc[role] || 0) + 1;
                    return acc;
                }, { admin: 0, editor: 0, viewer: 0 });

                const gamesByCountry = gamesResponse.data.results.reduce((acc: any, g: any) => {
                    const countryName = g.country?.name || "Inconnu";
                    acc[countryName] = (acc[countryName] || 0) + 1;
                    return acc;
                }, {});

                const predictionsByDay = predictionsResponse.data.results.reduce((acc: any, p: any) => {
                    const date = new Date(p.created_at || new Date()).toLocaleDateString("fr-FR");
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                setStats({
                    usersCount: usersResponse.data.count || 0,
                    gamesCount: gamesResponse.data.count || 0,
                    gameTypesCount: gameTypesResponse.data.count || 0,
                    countriesCount: countriesResponse.data.count || 0,
                    predictionsCount: predictionsResponse.data.count || 0,
                    resultsCount: resultsResponse.data.count || 0,
                    usersByRole,
                    gamesByCountry,
                    predictionsByDay,
                });
            } catch (error: any) {
                console.error("Erreur lors de la récupération des statistiques:", error);
                toast.error(error.response?.data?.detail || "Erreur lors de la récupération des statistiques.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    if (!canView) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
                    <p className="mt-2 text-gray-600">Seuls les administrateurs et éditeurs peuvent accéder au tableau de bord.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-gray-600">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "top" as const, labels: { font: { size: 12 } } },
            tooltip: { enabled: true },
        },
        scales: {
            x: { grid: { display: true, color: "#e5e7eb" } },
            y: { grid: { display: true, color: "#e5e7eb" }, beginAtZero: true },
        },
    };

    const usersByRoleData = {
        labels: ["Administrateurs", "Éditeurs", "Spectateurs"],
        datasets: [
            {
                data: [stats.usersByRole.admin, stats.usersByRole.editor, stats.usersByRole.viewer],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                borderWidth: 0,
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
                borderWidth: 0,
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
                borderWidth: 2,
            },
        ],
    };

    const hasData = stats.usersCount > 0 || stats.gamesCount > 0 || stats.countriesCount > 0 || stats.predictionsCount > 0;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Contenu principal */}
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tableau de bord Admin</h1>
                <p className="mb-6 text-gray-600">Bienvenue, <span className="font-semibold">{user?.username || "admin"}</span> ! Votre rôle est : {user?.role || "admin"}.</p>

                {/* Cartes avec statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a2 2 0 00-2-2h-3m-2-2H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500">Utilisateurs</h2>
                            <p className="text-2xl font-bold text-gray-800">{stats.usersCount}</p>
                            <p className="text-xs text-gray-500">+{Math.round(stats.usersCount * 0.1)}% depuis hier</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500">Jeux</h2>
                            <p className="text-2xl font-bold text-gray-800">{stats.gamesCount}</p>
                            <p className="text-xs text-gray-500">+{Math.round(stats.gamesCount * 0.1)}% depuis hier</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500">Pays</h2>
                            <p className="text-2xl font-bold text-gray-800">{stats.countriesCount}</p>
                            <p className="text-xs text-gray-500">+{Math.round(stats.countriesCount * 0.1)}% depuis hier</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500">Prédictions</h2>
                            <p className="text-2xl font-bold text-gray-800">{stats.predictionsCount}</p>
                            <p className="text-xs text-gray-500">+{Math.round(stats.predictionsCount * 0.1)}% depuis hier</p>
                        </div>
                    </div>
                </div>

                {/* Graphiques */}
                {hasData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white shadow-md rounded-lg p-6 lg:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Prédictions par jour</h2>
                            <div className="h-64">
                                <Line data={predictionsByDayData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Répartition des rôles</h2>
                            <div className="h-64 flex justify-center">
                                <Doughnut data={usersByRoleData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6 lg:col-span-3">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Jeux par pays</h2>
                            <div className="h-64">
                                <Bar data={gamesByCountryData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <p className="text-gray-600">Aucune donnée disponible pour le moment. Ajoutez des utilisateurs, jeux, ou prédictions pour voir les statistiques.</p>
                    </div>
                )}
            </div>
        </div>
    );
}