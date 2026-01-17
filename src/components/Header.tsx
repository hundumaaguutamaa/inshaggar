"use client";

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.nav}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoAccent}>GEB</span>ETA
                </Link>
                <div className={styles.actions}>
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
