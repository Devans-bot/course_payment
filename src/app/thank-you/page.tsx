'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './thankYou.module.css';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  
  const [receiptSent, setReceiptSent] = useState(false);

  useEffect(() => {
    // Send email receipt on load if we have the details
    const sendReceipt = async () => {
      if (email && name && orderId && !receiptSent) {
        try {
          await fetch('/api/send-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, orderId }),
          });
          setReceiptSent(true);
        } catch (error) {
          console.error('Failed to send receipt:', error);
        }
      }
    };

    sendReceipt();
  }, [email, name, orderId, receiptSent]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>You&apos;re In!</h1>
        <p className={styles.subtitle}>
          Payment successful. We&apos;ve secured your spot for the 21-Day Health Action Journey.
        </p>

        <div className={styles.billingSummary}>
          <div className={styles.billingRow}>
            <span className={styles.label}>Name</span>
            <span className={styles.value}>{name || '-'}</span>
          </div>
          <div className={styles.billingRow}>
            <span className={styles.label}>Order ID</span>
            <span className={styles.value}>{orderId || '-'}</span>
          </div>
          <div className={styles.billingRow}>
            <span className={styles.label}>Amount Paid</span>
            <span className={styles.value}>₹2</span>
          </div>
        </div>

        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Join our official WhatsApp group for all important updates and community access.
        </p>

        <a 
          href={process.env.NEXT_PUBLIC_WHATSAPP_INVITE_URL || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.whatsappBtn}
        >
          Join WhatsApp Group
        </a>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
