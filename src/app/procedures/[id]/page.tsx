import { prisma } from "@/lib/db";
import styles from "./page.module.css";
import Link from "next/link";
import { ArrowLeft, Clock, Banknote, MapPin, AlertTriangle, FileText, CheckCircle, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import ProcedureTabs from "@/components/ProcedureTabs";
import ReadinessWizard from "@/components/ReadinessWizard";
import QuickReadinessCard from "@/components/QuickReadinessCard";
import FeedbackSystem from "@/components/FeedbackSystem";
import CommunityInsights from "@/components/CommunityInsights";
import Header from "@/components/Header";

// Define TypeScript interfaces for our data structure
type DetailPageProps = {
    params: Promise<{ id: string }>;
};

async function getProcedure(id: string) {
    try {
        const procedure = await prisma.procedure.findUnique({
            where: { id },
            include: {
                steps: { orderBy: { order: 'asc' } },
                requiredDocuments: true,
                officeLocations: true,
                commonMistakes: true,
                sourceLinks: true,
            }
        });
        return procedure;
    } catch (error) {
        console.error("Error fetching procedure:", error);
        return null;
    }
}

export default async function ProcedureDetail({ params }: DetailPageProps) {
    const { id } = await params;
    let procedure = await getProcedure(id);

    if (!procedure && id === 'demo') {
        // Mock fallback if needed (simplified)
        procedure = { title: 'Passport Application Demo', category: 'Identity', overview: 'Demo content' } as any;
    }

    if (!procedure) {
        notFound();
    }

    return (
        <main className="animate-fade-in">
            <Header />
            <div className={styles.container} style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to Search
                </Link>

                <header className={styles.header}>
                    <span className={styles.badge}>{procedure.category}</span>
                    <h1 className={styles.title}>{procedure.title}</h1>

                    <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                            <Clock size={16} />
                            <span>{procedure.estimatedDuration}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Banknote size={16} />
                            <span>{procedure.estimatedCost}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <MapPin size={16} />
                            <span>{procedure.city}</span>
                        </div>
                        {/* Inline style for print button since tailwind ml-auto won't work */}
                        <div style={{ marginLeft: 'auto' }} className="print:hidden">
                            <PrintButton />
                        </div>
                    </div>

                    <p className={styles.overview}>
                        {procedure.overview}
                    </p>
                </header>

                <ProcedureTabs
                    steps={procedure.steps || []}
                    documents={procedure.requiredDocuments || []}
                    mistakes={procedure.commonMistakes || []}
                    locations={procedure.officeLocations || []}
                    eligibility={procedure.eligibility || "Open to eligible citizens"}
                    estimatedDuration={procedure.estimatedDuration}
                    estimatedCost={procedure.estimatedCost}
                />

                {/* Community Insights - Layer 3: Local Reality */}
                <CommunityInsights procedureId={procedure.id} />

                {/* Quick Readiness Card - Fast Overview */}
                <QuickReadinessCard
                    procedureTitle={procedure.title}
                    estimatedCost={procedure.estimatedCost}
                    estimatedDuration={procedure.estimatedDuration}
                    documentCount={procedure.requiredDocuments?.length || 0}
                />

                {/* Detailed Readiness Wizard - Interactive & Engaging */}
                <ReadinessWizard
                    documents={procedure.requiredDocuments || []}
                    procedureTitle={procedure.title}
                    estimatedCost={procedure.estimatedCost}
                    estimatedDuration={procedure.estimatedDuration}
                />

                {/* Feedback System - Makes the app "living" */}
                <FeedbackSystem
                    procedureId={procedure.id}
                    procedureTitle={procedure.title}
                />

                <div className="text-center text-sm text-[hsl(var(--muted-foreground))] mt-12 mb-12">
                    <p>Last updated: {procedure.lastUpdated ? procedure.lastUpdated.toISOString().split('T')[0] : 'Recently'}</p>
                    <div className="flex justify-center gap-4 mt-4" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        {(procedure.sourceLinks || []).map(link => (
                            <a key={link.id} href={link.url} target="_blank" className="flex items-center gap-1 hover:underline" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ExternalLink size={12} /> {link.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
