// src/context/LayoutContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
    showHeaderFooter: boolean;
    setShowHeaderFooter: (show: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const [showHeaderFooter, setShowHeaderFooter] = useState(true);

    return (
        <LayoutContext.Provider value={{ showHeaderFooter, setShowHeaderFooter }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
};