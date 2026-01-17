"use client";

import React, { useState } from "react";
import { CheckCircle, Clock, AlertTriangle, Sparkles } from "lucide-react";
import styles from "./QuickReadinessCard.module.css";

interface QuickReadinessProps {
    procedureTitle: string;
    estimatedCost: string;
    estimatedDuration: string;
    documentCount: number;
    onStartFullCheck?: () => void;
}

export default function QuickReadinessCard({ 
    procedureTitle, 
    estimatedCost, 
    estimatedDuration, 
    documentCount,
    onStartFullCheck 
}: QuickReadinessProps) {
    const [quickChecks, setQuickChecks] = useState({
        documents: false,
        money: false,
        time: false
    });

    const handleQuickCheck = (item: keyof typeof quickChecks) => {
        setQuickChecks(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const completedChecks = Object.values(quickChecks).filter(Boolean).length;
    const totalChecks = Object.keys(quickChecks).length;
    const isReady = completedChecks === totalChecks;

    return (
        <div className={styles.quickCard}>
            <div className={styles.cardHeader}>
                <div className={styles.headerIcon}>
                    <Sparkles size={20} />
                </div>
                <div className={styles.headerText}>
                    <h4>Quick Readiness Check</h4>
                    <p>Are you ready for {procedureTitle}?</p>
                </div>
                <div className={`${styles.statusBadge} ${isReady ? styles.ready : styles.pending}`}>
                    {completedChecks}/{totalChecks}
                </div>
            </div>

            <div className={styles.quickChecks}>
                <div 
                    className={`${styles.checkItem} ${quickChecks.documents ? styles.checked : ''}`}
                    onClick={() => handleQuickCheck('documents')}
                >
                    <div className={styles.checkIcon}>
                        <CheckCircle size={16} />
                    </div>
                    <div className={styles.checkContent}>
                        <span className={styles.checkLabel}>Documents Ready</span>
                        <span className={styles.checkDetail}>{documentCount} items needed</span>
                    </div>
                </div>

                <div 
                    className={`${styles.checkItem} ${quickChecks.money ? styles.checked : ''}`}
                    onClick={() => handleQuickCheck('money')}
                >
                    <div className={styles.checkIcon}>
                        <CheckCircle size={16} />
                    </div>
                    <div className={styles.checkContent}>
                        <span className={styles.checkLabel}>Money Ready</span>
                        <span className={styles.checkDetail}>{estimatedCost}</span>
                    </div>
                </div>

                <div 
                    className={`${styles.checkItem} ${quickChecks.time ? styles.checked : ''}`}
                    onClick={() => handleQuickCheck('time')}
                >
                    <div className={styles.checkIcon}>
                        <CheckCircle size={16} />
                    </div>
                    <div className={styles.checkContent}>
                        <span className={styles.checkLabel}>Time Available</span>
                        <span className={styles.checkDetail}>{estimatedDuration}</span>
                    </div>
                </div>
            </div>

            <div className={styles.cardFooter}>
                {isReady ? (
                    <div className={styles.readyState}>
                        <div className={styles.readyIcon}>🎉</div>
                        <span className={styles.readyText}>You're all set!</span>
                    </div>
                ) : (
                    <div className={styles.pendingState}>
                        <Clock size={16} />
                        <span>Complete the checks above</span>
                    </div>
                )}

                {onStartFullCheck && (
                    <button 
                        onClick={onStartFullCheck}
                        className={styles.detailedButton}
                    >
                        Detailed Check
                    </button>
                )}
            </div>
        </div>
    );
}