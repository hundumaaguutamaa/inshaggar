"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, Settings, Menu, X } from "lucide-react";
import styles from "./MobileNavigation.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function MobileNavigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { href: "/", icon: Home, label: "Home", id: "home" },
        { href: "/search", icon: Search, label: "Search", id: "search" },
        { href: "/procedures", icon: BookOpen, label: "Guides", id: "guides" },
        { href: "/admin", icon: Settings, label: "Admin", id: "admin" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className={styles.bottomNav}>
                {navItems.slice(0, 3).map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
                    >
                        <item.icon size={20} />
                        <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                ))}
                <button
                    className={`${styles.navItem} ${styles.menuButton}`}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu size={20} />
                    <span className={styles.navLabel}>Menu</span>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className={styles.menuOverlay}>
                    <div className={styles.menuContent}>
                        <div className={styles.menuHeader}>
                            <h2>Menu</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className={styles.menuItems}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`${styles.menuItem} ${isActive(item.href) ? styles.menuItemActive : ""}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon size={24} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className={styles.menuFooter}>
                            <p className={styles.appInfo}>
                                Gebeta v1.0 - Your trusted guide to Ethiopian procedures
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}