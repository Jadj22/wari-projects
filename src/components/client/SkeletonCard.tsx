// src/components/client/SkeletonCard.tsx
export default function SkeletonCard() {
    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-full"></div>
        </div>
    );
}