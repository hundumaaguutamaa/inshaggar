"use client";

import React from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import styles from "./ProgressTracker.module.css";

interface ProgressStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    current?: boolean;
}

interface ProgressTrackerProps {
    steps: ProgressStep[];
    title: string;
    subtitle?: string;
}

export default function ProgressTracker({ steps, title, subtitle }: ProgressTrackerProps) {
    const completedCount = steps.filter(step => step.completed).length;
    const progressPercentage = (completedCount / steps.length) * 100;
    const currentStepIndex = steps.findIndex(step => step.current);

    return (
        <div className={styles.tracker}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                
                <div className={styles.progressSummary}>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <span className={styles.progressText}>
                        {completedCount} of {steps.length} completed
                    </span>
                </div>
            </div>

            <div className={styles.steps}>
                {steps.map((step, index) => (
                    <div key={step.id} className={styles.stepContainer}>
                        <div 
                            className={`${styles.step} ${
                                step.completed ? styles.completed : 
                                step.current ? styles.current : styles.pending
                            }`}
                        >
                            <div className={styles.stepIcon}>
                                {step.completed ? (
                                    <CheckCircle size={20} />
                                ) : (
                                    <Circle size={20} />
                                )}
                            </div>
                            
                            <div className={styles.stepContent}>
                                <h4 className={styles.stepTitle}>{step.title}</h4>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>

                            {step.current && (
                                <div className={styles.currentIndicator}>
                                    <span>Current</span>
                                </div>
                            )}
                        </div>

                        {index < steps.length - 1 && (
                            <div className={styles.connector}>
                                <ArrowRight size={16} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {progressPercentage === 100 && (
                <div className={styles.celebration}>
                    <div className={styles.celebrationIcon}>🎉</div>
                    <h4>Congratulations!</h4>
                    <p>You've completed all the steps. You're ready to go!</p>
                </div>
            )}
        </div>
    );
}