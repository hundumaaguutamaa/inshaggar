"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

export default function DeleteButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this procedure? This action cannot be undone.")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/procedures/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] rounded-lg transition-colors"
            title="Delete Procedure"
        >
            <Trash size={16} />
        </button>
    );
}
