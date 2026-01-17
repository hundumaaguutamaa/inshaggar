"use client";

import { Printer } from "lucide-react";
import styles from "./PrintButton.module.css";

export default function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button onClick={handlePrint} className={styles.printBtn}>
            <Printer size={18} />
            Print Checklist
        </button>
    );
}
