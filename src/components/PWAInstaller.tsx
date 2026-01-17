"use client";

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import styles from './PWAInstaller.module.css';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className={styles.installPrompt}>
      <div className={styles.promptContent}>
        <div className={styles.promptText}>
          <h3>Install Gebeta</h3>
          <p>Get quick access to Ethiopian procedures on your home screen</p>
        </div>
        <div className={styles.promptActions}>
          <button onClick={handleInstallClick} className={styles.installButton}>
            <Download size={18} />
            Install
          </button>
          <button onClick={handleDismiss} className={styles.dismissButton}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}