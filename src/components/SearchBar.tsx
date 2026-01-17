"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ placeholder }: { placeholder?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={styles.searchBox}>
            <Search className={styles.icon} />
            <input
                type="text"
                placeholder={placeholder || "What do you want to do? (e.g., Passport, ID)"}
                className={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.button}>
                Search
            </button>
        </form>
    );
}
