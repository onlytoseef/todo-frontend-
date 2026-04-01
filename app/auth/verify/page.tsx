"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { apiRequest, ApiError } from '../../../src/lib/api';
import { useToast } from '../../../src/components/ui/ToastProvider';
import SidebarArt from '../../../src/components/ui/SidebarArt';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';

function VerifyForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';
  const seededEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(seededEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const endpoint = useMemo(
    () => (mode === 'reset' ? '/auth/verify-reset-otp' : '/auth/verify-otp'),
    [mode],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !otp.trim()) {
      toast.warning('Email and OTP are required.');
      return;
    }

    if (otp.trim().length !== 6) {
      toast.warning('OTP must be exactly 6 digits.');
      return;
    }

    setLoading(true);

    try {
      await apiRequest<{ message: string }>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      if (mode === 'reset') {
        toast.success('OTP verified. You can now reset your password.');
        router.push(`/auth/reset?email=${encodeURIComponent(email)}`);
        return;
      }

      toast.success('Account verified successfully.');
      router.push('/auth/login');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shopping-page">
      <SidebarArt />

      <section className="shopping-card auth-card">
        <h1>Verify OTP</h1>
        <p className="auth-subtitle">Enter the OTP sent to your email.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            className="auth-input"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            required
          />

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="loading-label">
                <LoadingSpinner />
                Please wait...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/auth/login">Back to login</Link>
        </div>
      </section>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
