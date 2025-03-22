// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log("Middleware exécuté pour la route:", pathname);

    if (pathname === "/admin/login") {
        console.log("Route /admin/login, pas de redirection");
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;

        console.log("Middleware: accessToken présent:", !!accessToken);

        if (!accessToken) {
            console.log("Middleware: Aucun token, redirection vers /admin/login");
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";
        try {
            const response = await axios.get(`${API_URL}admin/users/me/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const user = response.data;
            console.log("Middleware: Utilisateur récupéré:", user);

            if (user.role !== "admin" && user.role !== "editor") {
                console.log("Middleware: Rôle non autorisé, redirection vers /admin/login. Rôle actuel:", user.role);
                const loginUrl = new URL("/admin/login", request.url);
                return NextResponse.redirect(loginUrl);
            }

            console.log("Middleware: Utilisateur autorisé, accès accordé");
            return NextResponse.next();
        } catch (error: any) {
            console.error("Middleware: Erreur lors de la vérification du token:", error);
            if (error.response?.status === 401 && refreshToken) {
                try {
                    const refreshResponse = await axios.post(`${API_URL}token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const { access } = refreshResponse.data;

                    const response = NextResponse.next();
                    response.cookies.set("accessToken", access, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        path: "/",
                        maxAge: 60 * 60,
                    });

                    await axios.get(`${API_URL}admin/users/me/`, {
                        headers: { Authorization: `Bearer ${access}` },
                    });

                    console.log("Middleware: Token rafraîchi, accès accordé");
                    return response;
                } catch (refreshError) {
                    console.log("Middleware: Échec du refresh, redirection vers /admin/login");
                    const loginUrl = new URL("/admin/login", request.url);
                    return NextResponse.redirect(loginUrl);
                }
            } else {
                console.log("Middleware: Erreur lors de la vérification du token, redirection vers /admin/login");
                const loginUrl = new URL("/admin/login", request.url);
                return NextResponse.redirect(loginUrl);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};