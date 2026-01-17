"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeSwitcher.module.css";

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={styles.toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <Moon size={20} className={styles.icon} />
            ) : (
                <Sun size={20} className={styles.icon} />
            )}
            <span className={styles.text}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
        </button>
    );
}
