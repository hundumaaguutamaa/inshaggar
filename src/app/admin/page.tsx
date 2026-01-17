import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./admin.module.css";
import { Plus, Edit, ExternalLink, BarChart3, FileText, Clock, Eye, Settings } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import Header from "@/components/Header";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const procedures = await prisma.procedure.findMany({
        orderBy: { lastUpdated: 'desc' }
    });

    const stats = {
        total: procedures.length,
        published: procedures.filter(p => p.status === 'PUBLISHED').length,
        draft: procedures.filter(p => p.status === 'DRAFT').length,
        recentlyUpdated: procedures.filter(p => {
            const daysSinceUpdate = Math.floor((Date.now() - p.lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
            return daysSinceUpdate <= 7;
        }).length
    };

    return (
        <main>
            <Header />
            <div className={styles.container}>
                {/* Enhanced Header */}
                <header className={styles.header}>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Settings size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className={styles.title}>System Administration</h1>
                            <p className="text-[hsl(var(--muted-foreground))] font-medium text-lg">
                                Manage Ethiopian government service procedures
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link 
                            href="/admin/analytics" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-xl hover:bg-[hsl(var(--secondary)/0.8)] transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <BarChart3 size={20} /> Analytics
                        </Link>
                        <Link href="/admin/procedures/new" className={styles.createButton}>
                            <Plus size={20} /> New Procedure
                        </Link>
                    </div>
                </header>

                {/* Enhanced Statistics Cards */}
                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.blue}`}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statCardInfo}>
                                <h3>Total Procedures</h3>
                                <div className={styles.statNumber}>{stats.total}</div>
                            </div>
                            <div className={styles.statCardIcon}>
                                <FileText size={28} />
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.green}`}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statCardInfo}>
                                <h3>Published</h3>
                                <div className={styles.statNumber}>{stats.published}</div>
                            </div>
                            <div className={styles.statCardIcon}>
                                <Eye size={28} />
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.orange}`}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statCardInfo}>
                                <h3>Draft</h3>
                                <div className={styles.statNumber}>{stats.draft}</div>
                            </div>
                            <div className={styles.statCardIcon}>
                                <Edit size={28} />
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.purple}`}>
                        <div className={styles.statCardContent}>
                            <div className={styles.statCardInfo}>
                                <h3>Recent Updates</h3>
                                <div className={styles.statNumber}>{stats.recentlyUpdated}</div>
                            </div>
                            <div className={styles.statCardIcon}>
                                <Clock size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Procedures Table */}
                <div className={styles.tableContainer}>
                    {procedures.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyStateIcon}>
                                <FileText size={36} className="text-[hsl(var(--muted-foreground))]" />
                            </div>
                            <h3 className={styles.emptyStateTitle}>No Procedures Yet</h3>
                            <p className={styles.emptyStateDescription}>
                                Get started by creating your first government service procedure. 
                                This will help Ethiopian citizens navigate bureaucratic processes more easily.
                            </p>
                            <Link 
                                href="/admin/procedures/new" 
                                className={styles.emptyStateButton}
                            >
                                <Plus size={20} />
                                Create First Procedure
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className={styles.tableHeader}>
                                <div className={styles.tableTitle}>
                                    <div className={styles.tableTitleIcon}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h2>All Procedures ({procedures.length})</h2>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                                            Manage government service procedures
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.tableMetadata}>
                                    <Clock size={16} />
                                    <span>Last updated: {procedures[0]?.lastUpdated.toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '40%' }}>Service Name</th>
                                        <th style={{ width: '15%' }}>Category</th>
                                        <th style={{ width: '12%' }}>Status</th>
                                        <th style={{ width: '15%' }}>Cost & Duration</th>
                                        <th style={{ width: '12%' }}>Modified</th>
                                        <th style={{ width: '6%', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {procedures.map((proc) => (
                                        <tr key={proc.id} className="hover:bg-[hsl(var(--muted)/0.1)] transition-colors">
                                            <td>
                                                <div>
                                                    <div className="font-bold text-[hsl(var(--foreground))] mb-1">
                                                        {proc.title}
                                                    </div>
                                                    <div className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                                                        {proc.overview}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                                    {proc.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${proc.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                                                    {proc.status === 'PUBLISHED' ? (
                                                        <><Eye size={12} className="mr-1" /> Published</>
                                                    ) : (
                                                        <><Edit size={12} className="mr-1" /> Draft</>
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <span className="text-green-600">💰</span>
                                                        <span className="font-medium">{proc.estimatedCost || 'Free'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
                                                        <span>⏱️</span>
                                                        <span>{proc.estimatedDuration || 'Same day'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-sm text-[hsl(var(--muted-foreground))]">
                                                <div>{proc.lastUpdated.toLocaleDateString()}</div>
                                                <div className="text-xs opacity-75">
                                                    {proc.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex justify-end items-center gap-1">
                                                    <Link 
                                                        href={`/admin/procedures/${proc.id}`} 
                                                        className="p-2 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)] rounded-lg transition-colors" 
                                                        title="Edit procedure"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <Link 
                                                        href={`/procedures/${proc.id}`} 
                                                        target="_blank" 
                                                        className="p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] rounded-lg transition-colors" 
                                                        title="View public page"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                    <DeleteButton id={proc.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>

                {/* Quick Actions Footer */}
                {procedures.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Ready to add more procedures?</h3>
                                <p className="text-gray-600 text-sm">
                                    Help Ethiopian citizens by documenting more government services
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link 
                                    href="/admin/analytics" 
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <BarChart3 size={16} />
                                    View Analytics
                                </Link>
                                <Link 
                                    href="/admin/procedures/new" 
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
                                >
                                    <Plus size={16} />
                                    Add New Procedure
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
