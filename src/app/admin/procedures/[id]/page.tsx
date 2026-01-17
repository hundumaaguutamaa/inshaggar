import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProcedureForm from "@/components/admin/ProcedureForm";
import styles from "../../admin.module.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

export const dynamic = 'force-dynamic';

async function getProcedureData(id: string) {
    return await prisma.procedure.findUnique({
        where: { id },
        include: {
            steps: { orderBy: { order: 'asc' } },
            requiredDocuments: true,
            officeLocations: true,
            commonMistakes: true,
        }
    });
}

export default async function EditProcedurePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const procedure = await getProcedureData(id);

    if (!procedure) {
        notFound();
    }

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <Link href="/admin" className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-6 hover:text-[hsl(var(--primary))] font-bold">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <ProcedureForm initialData={procedure} isEditing={true} />
            </div>
        </main>
    );
}
