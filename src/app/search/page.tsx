import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import styles from "../page.module.css";
import { prisma } from "@/lib/db";
import Header from "@/components/Header";

type SearchPageProps = {
    searchParams: Promise<{ q: string }>;
};

async function searchProcedures(query: string) {
    try {
        const results = await prisma.procedure.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                    { overview: { contains: query, mode: 'insensitive' } },
                ],
                status: 'PUBLISHED'
            },
            select: {
                id: true,
                title: true,
                category: true,
                overview: true,
                estimatedCost: true,
                estimatedDuration: true
            }
        });
        return results;
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const searchTerm = q || "";
    const results = await searchProcedures(searchTerm);

    return (
        <main className="animate-fade-in">
            <Header />
            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
                <Link href="/" className={styles.link} style={{ marginBottom: '2.5rem' }}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div style={{ marginBottom: '3rem' }}>
                    <h1 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Search Results</h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                        Found {results.length} result{results.length !== 1 && 's'} for "{searchTerm}"
                    </p>
                </div>

                {results.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'hsl(var(--card))', border: '1px solid hsl(var(--muted))', borderRadius: 'var(--radius)' }}>
                        <p style={{ fontSize: '1.25rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', fontWeight: 600 }}>No procedures matching "{searchTerm}".</p>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Try searching for "Passport", "ID", or "Business"</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {results.map((proc) => (
                            <Link href={`/procedures/${proc.id}`} key={proc.id} className="card">
                                <span className="badge badge-primary">{proc.category}</span>
                                <h3 className="mt-4 mb-2 text-xl font-extrabold">{proc.title}</h3>
                                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 line-clamp-2">
                                    {proc.overview}
                                </p>
                                <div className={styles.procedureMeta}>
                                    <div className={styles.metaItem}>⏱ {proc.estimatedDuration}</div>
                                    <div className={styles.metaItem}>💰 {proc.estimatedCost}</div>
                                </div>
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid hsl(var(--muted))' }}>
                                    <span className={styles.link}>
                                        See Requirements <ArrowRight size={18} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
