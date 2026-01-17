"use client";

import React from "react";
import styles from "./HeroBanner.module.css";

export default function HeroBanner() {
    return (
        <div className={styles.bannerContainer}>
            {/* Left decorative element */}
            <div className={styles.leftDecor}>
                <svg 
                    viewBox="0 0 100 200" 
                    className={styles.decorSvg}
                    preserveAspectRatio="none"
                >
                    <path 
                        d="M20,0 Q80,50 20,100 Q80,150 20,200 L0,200 L0,0 Z" 
                        fill="url(#leftGradient)"
                        opacity="0.6"
                    />
                    <defs>
                        <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Right decorative element */}
            <div className={styles.rightDecor}>
                <svg 
                    viewBox="0 0 100 200" 
                    className={styles.decorSvg}
                    preserveAspectRatio="none"
                >
                    <path 
                        d="M80,0 Q20,50 80,100 Q20,150 80,200 L100,200 L100,0 Z" 
                        fill="url(#rightGradient)"
                        opacity="0.6"
                    />
                    <defs>
                        <linearGradient id="rightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Background pattern */}
            <div className={styles.backgroundPattern}>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
            </div>
        </div>
    );
}