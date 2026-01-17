import ProcedureForm from "@/components/admin/ProcedureForm";
import styles from "../../admin.module.css";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function NewProcedurePage() {
    return (
        <main>
            <Header />
            <div className={styles.container}>
                <Link href="/admin" className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-6 hover:text-[hsl(var(--primary))] font-bold">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <ProcedureForm />
            </div>
        </main>
    );
}
