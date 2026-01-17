"use client";

import React from "react";
import Link from "next/link";
import { Clock, Banknote, ArrowRight, CheckCircle } from "lucide-react";
import styles from "./MobileProcedureCard.module.css";

interface Procedure {
    id: string;
    title: string;
    category: string;
    overview: string;
    estimatedCost: string;
    estimatedDuration: string;
}

interface MobileProcedureCardProps {
    procedure: Procedure;
    showReadinessIndicator?: boolean;
}

export default function MobileProcedureCard({ 
    procedure, 
    showReadinessIndicator = false 
}: MobileProcedureCardProps) {
    return (
        <Link href={`/procedures/${procedure.id}`} className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.category}>{procedure.category}</span>
                {showReadinessIndicator && (
                    <div className={styles.readinessIndicator}>
                        <CheckCircle size={16} />
                        <span>Check Ready</span>
                    </div>
                )}
            </div>

            <h3 className={styles.title}>{procedure.title}</h3>
            
            <p className={styles.overview}>{procedure.overview}</p>

            <div className={styles.metadata}>
                <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>{procedure.estimatedDuration}</span>
                </div>
                <div className={styles.metaItem}>
                    <Banknote size={16} />
                    <span>{procedure.estimatedCost}</span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <span className={styles.actionText}>View Guide</span>
                <ArrowRight size={18} className={styles.arrow} />
            </div>
        </Link>
    );
}