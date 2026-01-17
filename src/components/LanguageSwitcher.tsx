"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === "en" ? "am" : "en")}
            className={styles.button}
            title="Switch Language / ቋንቋ ቀይር"
        >
            <Globe size={18} className={styles.icon} />
            <span className={styles.text}>{language === "en" ? "አማ" : "EN"}</span>
        </button>
    );
}
