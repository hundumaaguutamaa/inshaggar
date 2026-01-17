"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Sparkles, Target, Clock, Banknote, X } from "lucide-react";
import styles from "./ReadinessWizard.module.css";

interface RequiredDocument {
    id: string;
    name: string;
    type: string;
    count: number;
    notes?: string | null;
}

interface ReadinessWizardProps {
    documents: RequiredDocument[];
    procedureTitle: string;
    estimatedCost: string;
    estimatedDuration: string;
}

interface WizardStep {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'preparation' | 'knowledge';
    required: boolean;
    checked: boolean;
    emoji: string;
}

export default function ReadinessWizard({ 
    documents, 
    procedureTitle, 
    estimatedCost, 
    estimatedDuration 
}: ReadinessWizardProps) {
    const [showWizard, setShowWizard] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<WizardStep[]>([]);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [showResults, setShowResults] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before rendering portals
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Create wizard steps from documents and preparation items
        const wizardSteps: WizardStep[] = [
            // Document steps
            ...documents.map(doc => ({
                id: doc.id,
                title: `${doc.name}`,
                description: `You need ${doc.count} ${doc.name} (${doc.type})${doc.notes ? ` - ${doc.notes}` : ''}`,
                type: 'document' as const,
                required: true,
                checked: false,
                emoji: '📄'
            })),
            // Preparation steps
            {
                id: 'money',
                title: 'Money Ready',
                description: `Have ${estimatedCost} in cash or mobile money`,
                type: 'preparation' as const,
                required: true,
                checked: false,
                emoji: '💰'
            },
            {
                id: 'time',
                title: 'Time Available',
                description: `Process takes ${estimatedDuration} - plan accordingly`,
                type: 'preparation' as const,
                required: true,
                checked: false,
                emoji: '⏰'
            },
            {
                id: 'office-hours',
                title: 'Know Office Hours',
                description: 'Best time: 8:00-10:00 AM (less crowded)',
                type: 'knowledge' as const,
                required: false,
                checked: false,
                emoji: '🏢'
            },
            {
                id: 'backup-plan',
                title: 'Backup Plan',
                description: 'Know what to do if something goes wrong',
                type: 'knowledge' as const,
                required: false,
                checked: false,
                emoji: '🛡️'
            }
        ];
        setSteps(wizardSteps);
    }, [documents, estimatedCost, estimatedDuration]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && (showWizard || showResults)) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showWizard, showResults]);

    // Handle body scroll locking and ensure modal appears on active screen
    useEffect(() => {
        if (showWizard || showResults) {
            // Lock body scroll
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = '0';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.bottom = '0';
            
            // Ensure modal appears on current viewport
            window.scrollTo(0, 0);
        } else {
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.bottom = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.bottom = '';
        };
    }, [showWizard, showResults]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleStepToggle = (stepId: string) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(stepId)) {
            newCompleted.delete(stepId);
        } else {
            newCompleted.add(stepId);
        }
        setCompletedSteps(newCompleted);
    };

    const handleClose = () => {
        setShowWizard(false);
        setShowResults(false);
        setCurrentStep(0);
        setCompletedSteps(new Set());
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setShowResults(true);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const requiredSteps = steps.filter(step => step.required);
    const completedRequired = requiredSteps.filter(step => completedSteps.has(step.id));
    const isReady = completedRequired.length === requiredSteps.length;
    const progress = (completedSteps.size / steps.length) * 100;

    if (!showWizard) {
        return (
            <div className={styles.wizardTrigger}>
                <div className={styles.triggerCard}>
                    <div className={styles.triggerIcon}>
                        <Sparkles size={24} />
                    </div>
                    <div className={styles.triggerContent}>
                        <h3>Ready to Go?</h3>
                        <p>Let's check if you have everything needed in just 2 minutes</p>
                    </div>
                    <button 
                        onClick={() => setShowWizard(true)}
                        className={styles.startButton}
                    >
                        Start Check
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    if (showResults) {
        const resultsModal = (
            <div className={styles.resultsContainer} onClick={handleBackdropClick}>
                <div className={styles.resultsCard}>
                    {/* Close Button */}
                    <button 
                        onClick={handleClose}
                        className={styles.closeButton}
                        aria-label="Close readiness check"
                    >
                        <X size={20} />
                    </button>

                    <div className={styles.resultsHeader}>
                        <div className={`${styles.resultsIcon} ${isReady ? styles.ready : styles.notReady}`}>
                            {isReady ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                        </div>
                        <h2>{isReady ? "You're All Set! 🎉" : "Almost There! 💪"}</h2>
                        <div className={styles.progressRing}>
                            <svg className={styles.progressSvg} viewBox="0 0 36 36">
                                <path
                                    className={styles.progressBg}
                                    d="M18 2.0845
                                       a 15.9155 15.9155 0 0 1 0 31.831
                                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className={styles.progressBar}
                                    strokeDasharray={`${progress}, 100`}
                                    d="M18 2.0845
                                       a 15.9155 15.9155 0 0 1 0 31.831
                                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className={styles.progressText}>{Math.round(progress)}%</div>
                        </div>
                    </div>

                    <div className={styles.resultsSummary}>
                        <div className={styles.summaryStats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{completedSteps.size}</span>
                                <span className={styles.statLabel}>Items Ready</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{steps.length - completedSteps.size}</span>
                                <span className={styles.statLabel}>Still Needed</span>
                            </div>
                        </div>

                        {!isReady && (
                            <div className={styles.missingItems}>
                                <h4>Still Need:</h4>
                                {requiredSteps
                                    .filter(step => !completedSteps.has(step.id))
                                    .map(step => (
                                        <div key={step.id} className={styles.missingItem}>
                                            <span className={styles.missingEmoji}>{step.emoji}</span>
                                            <span>{step.title}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        )}

                        {isReady && (
                            <div className={styles.readyMessage}>
                                <h4>Perfect! Here's your game plan:</h4>
                                <div className={styles.gameplan}>
                                    <div className={styles.tip}>
                                        <Clock size={16} />
                                        <span>Go early (8:00-10:00 AM) for shorter queues</span>
                                    </div>
                                    <div className={styles.tip}>
                                        <Target size={16} />
                                        <span>Double-check documents before leaving</span>
                                    </div>
                                    <div className={styles.tip}>
                                        <Banknote size={16} />
                                        <span>Bring exact change if possible</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.resultsActions}>
                        <button 
                            onClick={() => {
                                setShowResults(false);
                                setCurrentStep(0);
                            }}
                            className={styles.reviewButton}
                        >
                            Review Items
                        </button>
                        {isReady && (
                            <button className={styles.proceedButton}>
                                I'm Ready - Let's Go! 🚀
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );

        return mounted ? createPortal(resultsModal, document.body) : null;
    }

    const currentStepData = steps[currentStep];
    if (!currentStepData) return null;

    const wizardModal = (
        <div className={styles.wizardContainer} onClick={handleBackdropClick}>
            <div className={styles.wizardCard}>
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className={styles.closeButton}
                    aria-label="Close readiness check"
                >
                    <X size={20} />
                </button>

                {/* Progress Header */}
                <div className={styles.wizardHeader}>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className={styles.stepCounter}>
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </div>

                {/* Current Step */}
                <div className={styles.stepContent}>
                    <div className={styles.stepEmoji}>{currentStepData.emoji}</div>
                    <h3 className={styles.stepTitle}>{currentStepData.title}</h3>
                    <p className={styles.stepDescription}>{currentStepData.description}</p>

                    <div className={styles.stepActions}>
                        <button
                            className={`${styles.checkButton} ${
                                completedSteps.has(currentStepData.id) ? styles.checked : ''
                            }`}
                            onClick={() => handleStepToggle(currentStepData.id)}
                        >
                            <CheckCircle size={20} />
                            {completedSteps.has(currentStepData.id) ? "Got it! ✓" : "I have this"}
                        </button>

                        {!currentStepData.required && (
                            <button
                                className={styles.skipButton}
                                onClick={() => nextStep()}
                            >
                                Skip for now
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className={styles.wizardNavigation}>
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={styles.navButton}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <button
                        onClick={nextStep}
                        className={styles.navButton}
                        disabled={currentStepData.required && !completedSteps.has(currentStepData.id)}
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

    return mounted ? createPortal(wizardModal, document.body) : null;
}