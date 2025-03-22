"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface User {
    id: number;
    username: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    is_active: boolean;
    date_joined: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoggingOut: boolean;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => void;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };

    const loginUser = async (username: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}token/`, { username, password });
            const { access, refresh } = response.data;
            Cookies.set("accessToken", access, { expires: 1 / 24 }); // 1 heure
            Cookies.set("refreshToken", refresh, { expires: 7 }); // 7 jours

            const userResponse = await axios.get(`${API_URL}admin/users/me/`, {
                headers: { Authorization: `Bearer ${access}` },
            });
            setUser(userResponse.data);
            toast.success("Connexion réussie !");
            router.push("/admin/dashboard");
        } catch (error) {
            console.error("Échec de la connexion:", error);
            throw error; // Laissez l'appelant gérer l'erreur
        }
    };

    const logoutUser = () => {
        setIsLoggingOut(true);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        setIsLoggingOut(false);
        router.push("/admin/login");
        toast.success("Déconnexion réussie.");
    };

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = Cookies.get("accessToken");
            if (!accessToken) {
                setLoading(false);
                if (pathname !== "/admin/login" && pathname.startsWith("/admin")) {
                    router.replace("/admin/login");
                }
                return;
            }

            try {
                const response = await axios.get(`${API_URL}admin/users/me/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'utilisateur:", error);
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                setUser(null);
                if (pathname !== "/admin/login") {
                    toast.error("Session invalide. Veuillez vous reconnecter.");
                    router.replace("/admin/login");
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{ user, loading, isLoggingOut, loginUser, logoutUser, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};