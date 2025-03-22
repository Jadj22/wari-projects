// src/components/NoHeaderFooterLayout.tsx
import { ReactNode } from "react";

export default function NoHeaderFooterLayout({ children }: { children: ReactNode }) {
    return <main>{children}</main>;
}