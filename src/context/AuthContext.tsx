// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface User {
    id: number;
    username: string;
    role: "admin" | "editor" | "viewer" | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoggingOut: boolean;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

// src/context/AuthContext.tsx
    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        console.log("AuthContext: Vérification initiale des cookies, accessToken:", !!accessToken);
        if (accessToken) {
            axios
                .get(`${API_URL}admin/users/me/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((response) => {
                    console.log("AuthContext: Utilisateur récupéré avec succès:", response.data);
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("AuthContext: Erreur lors de la récupération de l'utilisateur:", error);
                    Cookies.remove("accessToken");
                    Cookies.remove("refreshToken");
                    toast.error("Session invalide. Veuillez vous reconnecter.", {
                        position: "top-right",
                        autoClose: 5000,
                    });
                })
                .finally(() => {
                    console.log("AuthContext: Fin de la vérification initiale, loading -> false");
                    setLoading(false);
                });
        } else {
            console.log("AuthContext: Aucun accessToken, loading -> false");
            setLoading(false);
        }
    }, [pathname]); // Ajout de pathname comme dépendance

    useEffect(() => {
        console.log("AuthContext useEffect - user:", user, "loading:", loading, "isLoggingOut:", isLoggingOut, "pathname:", pathname);
        if (!loading && !user && pathname !== "/admin/login") {
            console.log("Utilisateur non connecté, redirection vers /admin/login depuis AuthContext");
            router.replace("/admin/login");
        } else if (!loading && user && pathname === "/admin/login") {
            console.log("Utilisateur connecté, redirection vers /admin/dashboard depuis AuthContext");
            router.replace("/admin/dashboard");
        }
    }, [user, loading, isLoggingOut, pathname, router]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const accessToken = Cookies.get("accessToken");
            const refreshToken = Cookies.get("refreshToken");

            if (accessToken) {
                try {
                    await axios.get(`${API_URL}admin/users/me/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                } catch (error: any) {
                    if (error.response?.status === 401 && refreshToken) {
                        try {
                            const response = await axios.post(`${API_URL}token/refresh/`, {
                                refresh: refreshToken,
                            });
                            const { access } = response.data;
                            Cookies.set("accessToken", access, { expires: 1 / 24 });
                        } catch (refreshError) {
                            Cookies.remove("accessToken");
                            Cookies.remove("refreshToken");
                            setUser(null);
                            toast.error("Session expirée. Veuillez vous reconnecter.", {
                                position: "top-right",
                                autoClose: 5000,
                            });
                            router.replace("/admin/login");
                        }
                    }
                }
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [router]);

    const loginUser = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}token/`, { username, password });
            const { access, refresh } = response.data;
            Cookies.set("accessToken", access, { expires: 1 / 24 });
            Cookies.set("refreshToken", refresh, { expires: 7 });
            const userResponse = await axios.get(`${API_URL}admin/users/me/`, {
                headers: { Authorization: `Bearer ${access}` },
            });
            setUser(userResponse.data);
            toast.success(`Bienvenue, ${userResponse.data.username} !`, {
                position: "top-right",
                autoClose: 3000,
            });
            router.replace("/admin/dashboard");
        } catch (error) {
            throw new Error("Échec de la connexion");
        }
    };

    const logoutUser = () => {
        console.log("Déconnexion en cours...");
        setIsLoggingOut(true);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        toast.info("Vous avez été déconnecté.", {
            position: "top-right",
            autoClose: 3000,
        });
        setIsLoggingOut(false);
        router.replace("/admin/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, isLoggingOut, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l’intérieur d’un AuthProvider");
    }
    return context;
};