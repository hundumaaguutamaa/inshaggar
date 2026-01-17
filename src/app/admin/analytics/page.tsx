import { prisma } from "@/lib/db";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import { BarChart3, TrendingUp, Users, MessageSquare } from "lucide-react";

export const dynamic = 'force-dynamic';

// Mock analytics data - in production this would come from the feedback table
const mockAnalytics = {
    totalFeedback: 127,
    helpfulRate: 84,
    completionRate: 76,
    averageVisits: 1.8,
    procedureStats: [
        {
            id: "1",
            title: "Lost Kebele ID Replacement",
            feedbackCount: 67,
            helpfulRate: 89,
            commonIssues: ["Police station confusion", "Photo requirements vary"]
        },
        {
            id: "2", 
            title: "Passport Application (New)",
            feedbackCount: 45,
            helpfulRate: 82,
            commonIssues: ["Online portal issues", "Appointment booking"]
        },
        {
            id: "3",
            title: "Trade License Renewal", 
            feedbackCount: 15,
            helpfulRate: 73,
            commonIssues: ["Tax clearance delays", "Document requirements"]
        }
    ],
    recentInsights: [
        "80% of Kebele ID users were asked for 2 photos (up from 1)",
        "Processing time for passports increased to 3-4 weeks",
        "Kirkos sub-city requires additional witness letter",
        "Best time to visit: 8:00-10:00 AM (87% success rate)"
    ]
};

export default async function AnalyticsPage() {
    const procedures = await prisma.procedure.findMany({
        select: { id: true, title: true, category: true },
        where: { status: 'PUBLISHED' }
    });

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Community Feedback Analytics</h1>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                            Insights from user experiences to improve procedures
                        </p>
                    </div>
                </header>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <MessageSquare size={20} className="text-[hsl(var(--primary))]" />
                            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Total Feedback</span>
                        </div>
                        <div className="text-2xl font-bold">{mockAnalytics.totalFeedback}</div>
                    </div>

                    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp size={20} className="text-green-600" />
                            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Helpful Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">{mockAnalytics.helpfulRate}%</div>
                    </div>

                    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Users size={20} className="text-blue-600" />
                            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Completion Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{mockAnalytics.completionRate}%</div>
                    </div>

                    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <BarChart3 size={20} className="text-orange-600" />
                            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Avg. Visits</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">{mockAnalytics.averageVisits}</div>
                    </div>
                </div>

                {/* Procedure Performance */}
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Procedure Performance</h2>
                    <div className="space-y-4">
                        {mockAnalytics.procedureStats.map((proc) => (
                            <div key={proc.id} className="border border-[hsl(var(--border))] rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-medium">{proc.title}</h3>
                                    <div className="text-right">
                                        <div className="text-sm text-[hsl(var(--muted-foreground))]">
                                            {proc.feedbackCount} responses
                                        </div>
                                        <div className={`text-sm font-medium ${proc.helpfulRate >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {proc.helpfulRate}% helpful
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">
                                        Common Issues:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {proc.commonIssues.map((issue, index) => (
                                            <span key={index} className="text-xs bg-[hsl(var(--muted))] px-2 py-1 rounded">
                                                {issue}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Insights */}
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Community Insights</h2>
                    <div className="space-y-3">
                        {mockAnalytics.recentInsights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-[hsl(var(--muted)/0.3)] rounded-lg">
                                <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full mt-2 flex-shrink-0"></div>
                                <div className="text-sm">{insight}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 <strong>Recommendation:</strong> Consider updating the Lost Kebele ID guide to mention 
                            the 2-photo requirement and add Kirkos-specific requirements.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}