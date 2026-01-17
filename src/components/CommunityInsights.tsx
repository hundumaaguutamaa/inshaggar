"use client";

import React from "react";
import { TrendingUp, Users, Clock, AlertCircle } from "lucide-react";
import styles from "./CommunityInsights.module.css";

interface InsightData {
    totalFeedback: number;
    helpfulPercentage: number;
    averageVisits: string;
    recentChanges: string[];
    commonIssues: string[];
}

interface CommunityInsightsProps {
    procedureId: string;
    insights?: InsightData;
}

// Mock data - in production this would come from aggregated feedback
const mockInsights: InsightData = {
    totalFeedback: 127,
    helpfulPercentage: 84,
    averageVisits: "1-2",
    recentChanges: [
        "80% were asked for 2 photos (increased from 1)",
        "Processing time recently increased to 5-7 days"
    ],
    commonIssues: [
        "Police station location confusion",
        "Photo background requirements vary by kebele"
    ]
};

export default function CommunityInsights({ procedureId, insights = mockInsights }: CommunityInsightsProps) {
    if (insights.totalFeedback < 10) {
        return null; // Don't show insights until we have enough data
    }

    return (
        <div className={styles.insights}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <TrendingUp size={20} className={styles.icon} />
                    <h3>Community Insights</h3>
                </div>
                <p className={styles.subtitle}>
                    Based on {insights.totalFeedback} recent experiences
                </p>
            </div>

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <div className={styles.statValue}>{insights.helpfulPercentage}%</div>
                    <div className={styles.statLabel}>Found this guide helpful</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statValue}>{insights.averageVisits}</div>
                    <div className={styles.statLabel}>Average visits needed</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statValue}>
                        <Users size={16} />
                    </div>
                    <div className={styles.statLabel}>{insights.totalFeedback} people helped</div>
                </div>
            </div>

            {insights.recentChanges.length > 0 && (
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>
                        <Clock size={16} />
                        Recent Changes
                    </h4>
                    <div className={styles.changesList}>
                        {insights.recentChanges.map((change, index) => (
                            <div key={index} className={styles.change}>
                                <div className={styles.changeDot}></div>
                                {change}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {insights.commonIssues.length > 0 && (
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>
                        <AlertCircle size={16} />
                        Common Issues
                    </h4>
                    <div className={styles.issuesList}>
                        {insights.commonIssues.map((issue, index) => (
                            <div key={index} className={styles.issue}>
                                ⚠️ {issue}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.footer}>
                <p className={styles.disclaimer}>
                    Insights are based on anonymous community feedback and may vary by location
                </p>
            </div>
        </div>
    );
}