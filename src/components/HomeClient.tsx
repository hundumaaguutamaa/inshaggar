"use client";

import React from "react";
import styles from "@/app/page.module.css";
import MobileSearchBar from "@/components/MobileSearchBar";
import MobileProcedureCard from "@/components/MobileProcedureCard";
import HeroBanner from "@/components/HeroBanner";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";

interface Procedure {
    id: string;
    title: string;
    category: string;
    overview: string;
    estimatedCost: string;
    estimatedDuration: string;
}

export default function HomeClient({ initialProcedures }: { initialProcedures: Procedure[] }) {
    const { t } = useLanguage();

    return (
        <main className="animate-fade-in">
            <Header />

            {/* Hero Section with Banner */}
            <section className={styles.hero}>
                <HeroBanner />
                <div className={styles.heroContent}>
                    <div className={styles.pill}>{t.home.editionBadge}</div>
                    <h1 className={styles.title}>{t.home.heroTitle}</h1>
                    <p className={styles.subtitle}>{t.home.heroSubtitle}</p>

                    <div className={styles.searchWrapper}>
                        <MobileSearchBar placeholder={t.home.searchPlaceholder} />
                        <div className={styles.trustRow}>
                            <div className={styles.trustItem}>
                                <ShieldCheck size={16} className={styles.trustIcon} /> {t.home.updatedRegularly}
                            </div>
                            <div className={styles.trustItem}>
                                <Check size={16} className={styles.trustIcon} /> {t.home.officesVerified}
                            </div>
                        </div>
                    </div>

                    <div className={styles.quickAccessContainer}>
                        <p className={styles.quickAccessTitle}>Quick Access</p>
                        <div className={styles.quickActions}>
                            {[
                                { name: "Passport", q: "passport" },
                                { name: "Kebele ID", q: "kebele" },
                                { name: "Birth Cert", q: "birth" },
                                { name: "Business", q: "trade" }
                            ].map(item => (
                                <Link
                                    key={item.q}
                                    href={`/search?q=${item.q}`}
                                    className={styles.quickActionButton}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Procedures */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t.home.popularProcedures}</h2>
                        <Link href="/search?q=" className={styles.link}>
                            {t.home.viewAll} <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className={styles.grid}>
                        {initialProcedures.map((proc) => (
                            <MobileProcedureCard 
                                key={proc.id} 
                                procedure={proc} 
                                showReadinessIndicator={true}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
