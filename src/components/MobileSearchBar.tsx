"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import styles from "./MobileSearchBar.module.css";

interface SearchSuggestion {
    id: string;
    text: string;
    type: 'recent' | 'popular' | 'suggestion';
}

export default function MobileSearchBar({ placeholder }: { placeholder?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Mock suggestions - in production, these would come from API/analytics
    const mockSuggestions: SearchSuggestion[] = [
        { id: '1', text: 'Lost Kebele ID', type: 'popular' },
        { id: '2', text: 'Passport application', type: 'popular' },
        { id: '3', text: 'Birth certificate', type: 'recent' },
        { id: '4', text: 'Trade license renewal', type: 'suggestion' },
        { id: '5', text: 'Marriage certificate', type: 'suggestion' },
    ];

    useEffect(() => {
        if (isFocused) {
            setSuggestions(mockSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [isFocused]);

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setQuery(suggestion.text);
        handleSearch(suggestion.text);
    };

    const clearSearch = () => {
        setQuery("");
        inputRef.current?.focus();
    };

    return (
        <div className={styles.searchContainer}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
                <div className={`${styles.searchBox} ${isFocused ? styles.focused : ""}`}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder || "What do you want to do?"}
                        className={styles.searchInput}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                    />
                    {query && (
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={clearSearch}
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </form>

            {/* Search Suggestions Overlay */}
            {isFocused && suggestions.length > 0 && (
                <div className={styles.suggestionsOverlay}>
                    <div className={styles.suggestionsContent}>
                        <div className={styles.suggestionsHeader}>
                            <h3>Quick Search</h3>
                        </div>
                        <div className={styles.suggestionsList}>
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.id}
                                    className={styles.suggestionItem}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <div className={styles.suggestionIcon}>
                                        {suggestion.type === 'recent' && <Clock size={16} />}
                                        {suggestion.type === 'popular' && <TrendingUp size={16} />}
                                        {suggestion.type === 'suggestion' && <Search size={16} />}
                                    </div>
                                    <span className={styles.suggestionText}>{suggestion.text}</span>
                                    <span className={styles.suggestionType}>
                                        {suggestion.type === 'recent' && 'Recent'}
                                        {suggestion.type === 'popular' && 'Popular'}
                                        {suggestion.type === 'suggestion' && 'Suggested'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}