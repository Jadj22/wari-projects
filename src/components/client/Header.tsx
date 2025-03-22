// src/components/client/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    // Gestion de la soumission de la recherche
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery(""); // Réinitialise la barre après recherche
            setIsMobileMenuOpen(false); // Ferme le menu mobile après recherche (si ouvert)
        }
    };

    return (
        <header className="bg-gradient-to-r from-black to-gray-900 shadow-lg sticky top-0 z-50">
            {/* Desktop Header */}
            <div className="hidden md:flex max-w-7xl mx-auto px-6 py-5 items-center justify-between">
                {/* Left Section - Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-4">
                        <Image
                            src="https://leparle.com/wp-content/uploads/2025/01/logo2-1-150x43.png"
                            alt="Wariprono Logo"
                            width={150}
                            height={43}
                            className="object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </Link>
                </div>

                {/* Center Section - Navigation */}
                <nav aria-label="Site Navigation: Main menu" className="flex items-center space-x-8">
                    <ul className="flex items-center space-x-8 list-none m-0 p-0">
                        <li>
                            <Link
                                href="/"
                                className="text-white text-lg font-medium tracking-wide uppercase hover:text-yellow-300 transition-colors duration-300 py-2 px-4 block relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
                            >
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/pays"
                                className="text-white text-lg font-medium tracking-wide uppercase hover:text-yellow-300 transition-colors duration-300 py-2 px-4 block relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
                            >
                                Pays
                            </Link>
                        </li>
                        {/* Dropdown for Paris */}
                        <li className="relative group">
                            <button className="flex items-center justify-between w-full py-2 px-4 text-white text-lg font-medium tracking-wide uppercase transition-all duration-300 ease-in-out group-hover:text-yellow-300 group-hover:scale-105 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 group-hover:after:w-full">
                                Paris
                                <svg
                                    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:rotate-180 fill-current"
                                    viewBox="57 35.171 26 16.043"
                                >
                                    <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                                </svg>
                            </button>
                            <div className="absolute left-0 z-20 hidden group-hover:block bg-black border border-yellow-500 rounded-lg shadow-2xl w-56 mt-2 origin-top transition-all duration-500 ease-out transform opacity-0 group-hover:opacity-100 group-hover:scale-y-100">
                                <ul className="py-3 text-sm">
                                    <li>
                                        <Link
                                            href="/pari-hippique"
                                            className="block px-6 py-3 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:translate-x-2 font-medium tracking-wide"
                                        >
                                            Pari Hippique
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/pari-sportif"
                                            className="block px-6 py-3 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:translate-x-2 font-medium tracking-wide"
                                        >
                                            Pari sportif
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/loto"
                                            className="block px-6 py-3 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:translate-x-2 font-medium tracking-wide"
                                        >
                                            Loto
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <Link
                                href="/resultats"
                                className="text-white text-lg font-medium tracking-wide uppercase hover:text-yellow-300 transition-colors duration-300 py-2 px-4 block relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full"
                            >
                                Résultats
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Right Section - Search Bar */}
                <div className="flex items-center">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="w-64 py-2 pl-4 pr-10 text-white bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 placeholder-gray-400 hover:bg-gray-700"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 p-2 text-gray-400 hover:text-yellow-300 transition-colors duration-300"
                            aria-label="Rechercher"
                        >
                            <FaSearch size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-4">
                        <Image
                            src="https://leparle.com/wp-content/uploads/2025/01/logo2-1-150x43.png"
                            alt="Wariprono Logo"
                            width={150}
                            height={43}
                            className="object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white hover:text-yellow-300 focus:outline-none transition-colors duration-300"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : ""}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z" />
                            ) : (
                                <path d="M3 13h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 7h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1zM3 19h18c0.552 0 1-0.448 1-1s-0.448-1-1-1h-18c-0.552 0-1 0.448-1 1s0.448 1 1 1z" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Content */}
                {isMobileMenuOpen && (
                    <div className="bg-black px-6 py-4 transition-all duration-300 ease-in-out">
                        {/* Mobile Search Bar */}
                        <form onSubmit={handleSearch} className="relative flex items-center mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-full py-2 pl-4 pr-10 text-white bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 placeholder-gray-400 hover:bg-gray-700"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 p-2 text-gray-400 hover:text-yellow-300 transition-colors duration-300"
                                aria-label="Rechercher"
                            >
                                <FaSearch size={18} />
                            </button>
                        </form>

                        <nav aria-label="Mobile Navigation">
                            <ul className="space-y-3 list-none m-0 p-0">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-white text-lg font-medium tracking-wide uppercase hover:text-yellow-300 block py-2 px-4 transition-colors duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Accueil
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/pays"
                                        className="text-white text-lg font-medium tracking-wide uppercase hover:text-yellow-300 block py-2 px-4 transition-colors duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pays
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/pari-hippique"
                                        className="text-white text-lg font-medium tracking-wide hover:text-yellow-300 block py-2 px-4 transition-colors duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pari Hippique
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/pari-sportif"
                                        className="text-white text-lg font-medium tracking-wide hover:text-yellow-300 block py-2 px-4 transition-colors duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pari sportif
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/loto"
                                        className="text-white text-lg font-medium tracking-wide hover:text-yellow-300 block py-2 px-4 transition-colors duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Loto
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/resultats"
                                        className="text-white text-lg font-medium tracking-wide uppercase hover:text-yellow-300 block py-2 px-4 transition-colors duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Résultats
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;