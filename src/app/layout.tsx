// src/app/layout.tsx
import { AuthProvider } from "@/context/AuthContext";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    console.log("RootLayout rendu, children:", children);
    return (
        <html lang="fr">
        <body>
        <AuthProvider>
            <AuthenticatedLayout>
                {children}
            </AuthenticatedLayout>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </AuthProvider>
        </body>
        </html>
    );
}