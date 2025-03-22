// src/app/not-found.tsx
export default function NotFoundPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600">Page non trouvée</p>
                <a href="/" className="mt-4 inline-block text-blue-500 hover:underline">
                    Retour à l'accueil
                </a>
            </div>
        </div>
    );
}