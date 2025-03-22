// src/types/model.ts
export interface User {
    id: number;
    username: string;
    role: "admin" | "editor" | "viewer" | null;
}