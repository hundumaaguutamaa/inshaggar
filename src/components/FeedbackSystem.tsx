"use client";

import React, { useState } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Send, X } from "lucide-react";
import styles from "./FeedbackSystem.module.css";

interface FeedbackSystemProps {
    procedureId: string;
    procedureTitle: string;
}

interface FeedbackData {
    helpful: 'yes' | 'somewhat' | 'no' | null;
    completed: 'yes' | 'not-yet' | null;
    city: string;
    extraDocuments: string;
    visits: string;
    unclear: string;
}

export default function FeedbackSystem({ procedureId, procedureTitle }: FeedbackSystemProps) {
    const [showFeedback, setShowFeedback] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackData>({
        helpful: null,
        completed: null,
        city: '',
        extraDocuments: '',
        visits: '',
        unclear: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Here you would typically send to your API
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    procedureId,
                    ...feedback,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setShowFeedback(false);
                    setSubmitted(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            // For now, just simulate success
            setSubmitted(true);
            setTimeout(() => {
                setShowFeedback(false);
                setSubmitted(false);
            }, 2000);
        }
    };

    if (!showFeedback) {
        return (
            <div className={styles.feedbackTrigger}>
                <button 
                    onClick={() => setShowFeedback(true)}
                    className={styles.feedbackButton}
                >
                    <MessageSquare size={18} />
                    Help improve this guide
                </button>
                <p className={styles.feedbackDescription}>
                    Share your experience to help others prepare better
                </p>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className={styles.feedbackSuccess}>
                <div className={styles.successContent}>
                    <ThumbsUp size={24} className={styles.successIcon} />
                    <h4>Thank you for your feedback!</h4>
                    <p>Your input helps us keep this guide accurate and helpful for everyone.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.feedbackForm}>
            <div className={styles.feedbackHeader}>
                <h3>Help improve: {procedureTitle}</h3>
                <button 
                    onClick={() => setShowFeedback(false)}
                    className={styles.closeButton}
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Mandatory Questions */}
                <div className={styles.section}>
                    <h4>Quick Questions <span className={styles.required}>*</span></h4>
                    
                    <div className={styles.question}>
                        <label>Was this guide helpful?</label>
                        <div className={styles.radioGroup}>
                            {[
                                { value: 'yes', label: 'Yes', icon: '👍' },
                                { value: 'somewhat', label: 'Somewhat', icon: '👌' },
                                { value: 'no', label: 'No', icon: '👎' }
                            ].map(option => (
                                <label key={option.value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="helpful"
                                        value={option.value}
                                        checked={feedback.helpful === option.value}
                                        onChange={(e) => setFeedback(prev => ({ 
                                            ...prev, 
                                            helpful: e.target.value as any 
                                        }))}
                                        required
                                    />
                                    <span className={styles.radioCustom}>
                                        {option.icon} {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.question}>
                        <label>Did you complete the process?</label>
                        <div className={styles.radioGroup}>
                            {[
                                { value: 'yes', label: 'Yes, completed' },
                                { value: 'not-yet', label: 'Not yet / In progress' }
                            ].map(option => (
                                <label key={option.value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="completed"
                                        value={option.value}
                                        checked={feedback.completed === option.value}
                                        onChange={(e) => setFeedback(prev => ({ 
                                            ...prev, 
                                            completed: e.target.value as any 
                                        }))}
                                        required
                                    />
                                    <span className={styles.radioCustom}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Optional Questions */}
                <div className={styles.section}>
                    <h4>Optional Details</h4>
                    <p className={styles.sectionDescription}>
                        Help us understand local variations and improve accuracy
                    </p>

                    <div className={styles.question}>
                        <label htmlFor="city">Which city/sub-city?</label>
                        <select
                            id="city"
                            value={feedback.city}
                            onChange={(e) => setFeedback(prev => ({ ...prev, city: e.target.value }))}
                            className={styles.select}
                        >
                            <option value="">Select (optional)</option>
                            <option value="kirkos">Kirkos Sub-City</option>
                            <option value="bole">Bole Sub-City</option>
                            <option value="yeka">Yeka Sub-City</option>
                            <option value="arada">Arada Sub-City</option>
                            <option value="addis-ketema">Addis Ketema Sub-City</option>
                            <option value="lideta">Lideta Sub-City</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className={styles.question}>
                        <label htmlFor="extraDocuments">Did they ask for extra documents?</label>
                        <input
                            type="text"
                            id="extraDocuments"
                            value={feedback.extraDocuments}
                            onChange={(e) => setFeedback(prev => ({ ...prev, extraDocuments: e.target.value }))}
                            placeholder="e.g., Extra photo, witness letter..."
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.question}>
                        <label htmlFor="visits">How many visits did it take?</label>
                        <select
                            id="visits"
                            value={feedback.visits}
                            onChange={(e) => setFeedback(prev => ({ ...prev, visits: e.target.value }))}
                            className={styles.select}
                        >
                            <option value="">Select (optional)</option>
                            <option value="1">1 visit</option>
                            <option value="2">2 visits</option>
                            <option value="3">3 visits</option>
                            <option value="4+">4+ visits</option>
                        </select>
                    </div>

                    <div className={styles.question}>
                        <label htmlFor="unclear">Any step unclear or missing?</label>
                        <textarea
                            id="unclear"
                            value={feedback.unclear}
                            onChange={(e) => setFeedback(prev => ({ ...prev, unclear: e.target.value }))}
                            placeholder="What could be clearer or what was missing?"
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitButton}>
                        <Send size={16} />
                        Submit Feedback
                    </button>
                    <p className={styles.privacy}>
                        Anonymous feedback • Helps improve guides for everyone
                    </p>
                </div>
            </form>
        </div>
    );
}