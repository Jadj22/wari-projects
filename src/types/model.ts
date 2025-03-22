// src/types/model.ts
export interface User {
    id: number;
    username: string;
    role: "admin" | "editor" | "viewer" | null;
}


export interface Country {
    id: number;
    name: string;
    code: string;
    slug: string;
    game_count: number;
    created_at: string;
}

// Type pour un type de jeu (basé sur GameTypeSerializer)
export interface GameType {
    id: number;
    name: string;
    slug: string;
    game_count: number;
    created_at: string;
    updated_at: string;
}

// Type pour un jeu (basé sur GameSerializer)
export interface Game {
    id: number;
    name: string;
    slug: string;
    game_type: GameType;
    game_type_id?: number; // Utilisé pour les formulaires (write_only)
    country: Country;
    country_id?: number; // Utilisé pour les formulaires (write_only)
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Type pour un pronostic (basé sur PredictionSerializer)
export interface Prediction {
    id: number;
    game: string; // Slug du jeu (via SlugRelatedField)
    game_name: string; // Nom du jeu ajouté via to_representation
    description: string;
    predicted_at: string;
    is_published: boolean;
    author: string; // Username de l'auteur (via SlugRelatedField)
    author_display: string; // Nom complet ou username de l'auteur ajouté via to_representation
    updated_at: string;
}

// Type pour un programme (basé sur ProgramSerializer)
export interface Program {
    id: number;
    game: string; // Slug du jeu (via SlugRelatedField)
    game_name: string; // Nom du jeu ajouté via to_representation
    event_date: string;
    details: string;
    is_published: boolean;
    created_at: string;
}

// Type pour un résultat (basé sur ResultSerializer)
export interface Result {
    id: number;
    game: string; // Slug du jeu (via SlugRelatedField)
    result_date: string;
    outcome: string;
    outcome_details: { [key: string]: string }; // JSONField (ex. {"score": "2-1", "winner": "Équipe A"})
    status: "pending" | "official" | "disputed";
    validated_by: string | null; // Username de l'utilisateur (via SlugRelatedField)
    created_at: string;
}