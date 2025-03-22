// src/constants/api.ts

// Base URL pour l'API, récupérée depuis les variables d'environnement
// On supprime les slashes finaux pour éviter les doubles slashes lors de la concaténation
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

// URL pour les appels API côté client (par exemple, pour récupérer des programmes, prédictions, etc.)
const CLIENT_API_URL = `${API_URL}/api/client`;

// Export des constantes pour une utilisation dans d'autres fichiers
export { API_URL, CLIENT_API_URL};