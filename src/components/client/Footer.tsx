// src/components/client/Footer.tsx
import Link from "next/link";
import Image from "next/image"; // Ajout pour gérer l'image du logo
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-black to-gray-900 py-12 text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Logo et description */}
                <div>
                    <Link href="/" className="flex items-center mb-6">
                        <Image
                            src="https://leparle.com/wp-content/uploads/2025/01/logo2-1-150x43.png"
                            alt="Wariprono Logo"
                            width={150}
                            height={43}
                            className="object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </Link>
                    <p className="text-sm text-gray-400">
                        Wariprono, votre partenaire pour des pronostics fiables et des paris réussis. Rejoignez-nous et maximisez vos gains dès aujourd'hui !
                    </p>
                    {/* Icônes sociales */}
                    <div className="flex space-x-4 mt-4">
                        {[
                            { icon: <FaFacebook />, href: "https://facebook.com" },
                            { icon: <FaTwitter />, href: "https://twitter.com" },
                            { icon: <FaInstagram />, href: "https://instagram.com" },
                            { icon: <FaYoutube />, href: "https://youtube.com" },
                        ].map((social, index) => (
                            <Link
                                key={index}
                                href={social.href}
                                target="_blank"
                                className="text-gray-400 hover:text-yellow-400 transition-all duration-300 transform hover:scale-110"
                            >
                                <div className="text-2xl">{social.icon}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Navigation rapide */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4 uppercase tracking-wide">Liens rapides</h3>
                    <ul className="space-y-2">
                        {[
                            { label: "Accueil", href: "/" },
                            { label: "Pays", href: "/pays" },
                            { label: "Paris", href: "/pari-sportif" }, // Ajusté pour pointer vers une page existante ou à créer
                            { label: "Résultats", href: "/resultats" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4 uppercase tracking-wide">Contactez-nous</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            Email: <a href="mailto:support@wariprono.com" className="hover:text-yellow-400">support@wariprono.com</a>
                        </li>
                        <li>
                            Téléphone: <a href="tel:+228 XXXXXXX" className="hover:text-yellow-400">+228 XXXXXXXX</a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-4 uppercase tracking-wide">Newsletter</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Inscrivez-vous pour recevoir les dernières nouvelles et pronostics directement dans votre boîte de réception.
                    </p>
                    <form className="flex flex-col space-y-2">
                        <input
                            type="email"
                            placeholder="Votre email"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold uppercase tracking-wide hover:bg-yellow-300 transition-all duration-300"
                        >
                            S'abonner
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Wariprono. Tous droits réservés.
            </div>
        </footer>
    );
};

export default Footer;