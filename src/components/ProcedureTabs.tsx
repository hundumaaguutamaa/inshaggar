"use client";

import React, { useState } from 'react';
import { CheckCircle, FileText, MapPin, AlertTriangle, Clock, Banknote } from "lucide-react";
import styles from "@/app/procedures/[id]/page.module.css";
import { ExternalLink } from "lucide-react";

interface Step {
    id: string;
    order: number;
    title: string;
    description: string;
}

interface Document {
    id: string;
    name: string;
    type: string;
    count: number;
    notes: string | null;
}

interface Location {
    id: string;
    name: string;
    subCity: string | null;
    woreda: string | null;
    mapLink: string | null;
    workingHours: string | null;
}

interface Mistake {
    id: string;
    description: string;
}

interface ProcedureTabsProps {
    steps: Step[];
    documents: Document[];
    locations: Location[];
    mistakes: Mistake[];
    eligibility: string;
    estimatedDuration: string;
    estimatedCost: string;
}

export default function ProcedureTabs({
    steps,
    documents,
    locations,
    mistakes,
    eligibility,
    estimatedDuration,
    estimatedCost
}: ProcedureTabsProps) {
    const [activeTab, setActiveTab] = useState('steps');

    const tabs = [
        { id: 'steps', label: 'Steps', icon: CheckCircle },
        { id: 'docs', label: 'What', icon: FileText },
        { id: 'timeline', label: 'When', icon: Clock },
        { id: 'locations', label: 'Where', icon: MapPin },
    ];

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabsHeader}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'steps' && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <CheckCircle className={styles.primaryIcon} />
                            How to Do It (Steps)
                        </h2>
                        <div className={styles.stepList}>
                            {steps.length > 0 ? (
                                steps.map((step) => (
                                    <div key={step.id} className={styles.step}>
                                        <div className={styles.stepNumber}>{step.order}</div>
                                        <div className={styles.stepContent}>
                                            <h4>{step.title}</h4>
                                            <p>{step.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No specific steps recorded.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <FileText className={styles.secondaryIcon} />
                            What You Need (Requirements)
                        </h2>
                        <div className={styles.docGrid}>
                            {documents.map((doc) => (
                                <div key={doc.id} className={styles.docCard}>
                                    <FileText size={20} className={styles.docIcon} />
                                    <div className={styles.docInfo}>
                                        <h4>{doc.name}</h4>
                                        <p>{doc.type} • {doc.count}x</p>
                                        {doc.notes && <span className="text-xs text-[hsl(var(--destructive))]">{doc.notes}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Avoid Common Mistakes</h3>
                            <ul className={styles.mistakeList}>
                                {mistakes.map((mistake) => (
                                    <li key={mistake.id} className={styles.mistakeItem}>
                                        <AlertTriangle size={14} className="text-[hsl(var(--destructive))] shrink-0 mt-1" />
                                        <span>{mistake.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.infoBox}>
                            <strong>Who is Eligible: </strong> {eligibility}
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Clock className={styles.secondaryIcon} />
                            When & How Long?
                        </h2>

                        <div className="grid gap-6">
                            <div className="flex items-center gap-4 bg-[hsl(var(--muted)/0.3)] p-6 rounded-2xl border border-[hsl(var(--muted))]">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Clock size={24} className="text-[hsl(var(--primary))]" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase opacity-60">Estimated Processing Time</p>
                                    <p className="text-xl font-black">{estimatedDuration}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-[hsl(var(--muted)/0.3)] p-6 rounded-2xl border border-[hsl(var(--muted))]">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Banknote size={24} className="text-[hsl(var(--secondary))]" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase opacity-60">Estimated Cost</p>
                                    <p className="text-xl font-black">{estimatedCost}</p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-6 text-sm text-[hsl(var(--muted-foreground))] italic">
                            * Times and costs are estimates and may vary based on specific office conditions and individual cases.
                        </p>
                    </div>
                )}

                {activeTab === 'locations' && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <MapPin className={styles.primaryIcon} />
                            Where to Go
                        </h2>
                        {locations.length > 0 ? (
                            locations.map((office) => (
                                <div key={office.id} className={styles.locationCard}>
                                    <div className={styles.locationHeader}>
                                        <span className={styles.locationTitle}>{office.name}</span>
                                        {office.mapLink && (
                                            <a href={office.mapLink} target="_blank" rel="noreferrer" className={styles.mapLink}>
                                                View Map <ExternalLink size={12} style={{ display: 'inline' }} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                        {office.subCity && `Sub-city: ${office.subCity}`}
                                        {office.woreda && ` • Woreda: ${office.woreda}`}
                                    </p>
                                    {office.workingHours && (
                                        <p className="text-sm mt-3 flex items-center gap-2 text-[hsl(var(--foreground))] font-semibold">
                                            <Clock size={14} /> {office.workingHours}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No office locations specified.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
