"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en, am } from "@/locales/dictionary";

type Language = "en" | "am";
type Dictionary = typeof en;

interface LanguageContextType {
    language: Language;
    t: Dictionary;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLangState] = useState<Language>("en");

    // Load language from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("gebeta-lang") as Language;
        if (saved && (saved === "en" || saved === "am")) {
            setLangState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLangState(lang);
        localStorage.setItem("gebeta-lang", lang);
        // Optional: Set dir="rtl" if we ever add RTL languages, though Amharic is LTR
    };

    const t = language === "am" ? am : en;

    return (
        <LanguageContext.Provider value={{ language, t, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
