"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import styles from "./ReadinessChecklist.module.css";

interface RequiredDocument {
    id: string;
    name: string;
    type: string;
    count: number;
    notes?: string | null;
}

interface ReadinessChecklistProps {
    documents: RequiredDocument[];
    procedureTitle: string;
    estimatedCost: string;
    estimatedDuration: string;
}

interface ChecklistItem {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    required: boolean;
}

export default function ReadinessChecklist({ 
    documents, 
    procedureTitle, 
    estimatedCost, 
    estimatedDuration 
}: ReadinessChecklistProps) {
    const [showChecklist, setShowChecklist] = useState(false);
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
        const items: ChecklistItem[] = documents.map(doc => ({
            id: doc.id,
            label: `${doc.name} (${doc.type})`,
            description: doc.notes || `You need ${doc.count} ${doc.name}`,
            checked: false,
            required: true
        }));

        // Add common preparation items
        items.push(
            {
                id: 'money',
                label: 'Enough money for fees',
                description: `Bring ${estimatedCost} in cash`,
                checked: false,
                required: true
            },
            {
                id: 'time',
                label: 'Available time',
                description: `Process takes ${estimatedDuration}`,
                checked: false,
                required: true
            },
            {
                id: 'office-hours',
                label: 'Know office hours',
                description: 'Best to go early morning (8:00-10:00 AM)',
                checked: false,
                required: false
            }
        );

        return items;
    });

    const toggleItem = (id: string) => {
        setChecklistItems(prev => 
            prev.map(item => 
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const requiredItems = checklistItems.filter(item => item.required);
    const checkedRequired = requiredItems.filter(item => item.checked);
    const isReady = checkedRequired.length === requiredItems.length;
    const missingCount = requiredItems.length - checkedRequired.length;

    if (!showChecklist) {
        return (
            <div className={styles.checklistTrigger}>
                <button 
                    onClick={() => setShowChecklist(true)}
                    className={styles.checkButton}
                >
                    <CheckCircle size={20} />
                    Am I ready to go?
                </button>
                <p className={styles.checkDescription}>
                    Check if you have everything needed before visiting the office
                </p>
            </div>
        );
    }

    return (
        <div className={styles.checklist}>
            <div className={styles.checklistHeader}>
                <h3>Readiness Check: {procedureTitle}</h3>
                <p>Make sure you have everything before you go</p>
            </div>

            <div className={styles.checklistItems}>
                {checklistItems.map(item => (
                    <div key={item.id} className={styles.checklistItem}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleItem(item.id)}
                                className={styles.checkbox}
                            />
                            <div className={styles.checkboxCustom}>
                                {item.checked && <CheckCircle size={16} />}
                            </div>
                            <div className={styles.itemContent}>
                                <span className={styles.itemLabel}>
                                    {item.label}
                                    {item.required && <span className={styles.required}>*</span>}
                                </span>
                                <span className={styles.itemDescription}>
                                    {item.description}
                                </span>
                            </div>
                        </label>
                    </div>
                ))}
            </div>

            <div className={styles.result}>
                {isReady ? (
                    <div className={styles.ready}>
                        <CheckCircle size={24} className={styles.readyIcon} />
                        <div>
                            <h4>✅ You are ready to go!</h4>
                            <p>You have everything needed. Best time to visit: early morning (8:00-10:00 AM)</p>
                            <div className={styles.tips}>
                                <p><strong>Reminder:</strong> Office hours are typically 8:00 AM - 5:00 PM</p>
                                <p><strong>Tip:</strong> Go early to avoid crowds</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.notReady}>
                        <AlertTriangle size={24} className={styles.notReadyIcon} />
                        <div>
                            <h4>⚠️ You're missing {missingCount} item{missingCount > 1 ? 's' : ''}</h4>
                            <p>Complete the checklist above before visiting the office</p>
                            <div className={styles.missingItems}>
                                {requiredItems
                                    .filter(item => !item.checked)
                                    .map(item => (
                                        <div key={item.id} className={styles.missingItem}>
                                            • {item.label}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button 
                    onClick={() => setShowChecklist(false)}
                    className={styles.backButton}
                >
                    Back to Guide
                </button>
                {isReady && (
                    <button className={styles.proceedButton}>
                        I'm Ready - Show Directions <ArrowRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}