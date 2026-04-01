"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { apiRequest, ApiError } from '../../../src/lib/api';
import { useToast } from '../../../src/components/ui/ToastProvider';
import SidebarArt from '../../../src/components/ui/SidebarArt';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';

function ResetPasswordForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const seededEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(seededEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      toast.warning('Email, OTP, and new password are required.');
      return;
    }

    if (otp.trim().length !== 6) {
      toast.warning('OTP must be exactly 6 digits.');
      return;
    }

    if (newPassword.trim().length < 6) {
      toast.warning('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });

      toast.success(response.message);
      setTimeout(() => router.push('/auth/login'), 1000);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shopping-page">
      <SidebarArt />

      <section className="shopping-card auth-card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Use OTP and set your new password.</p>

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

          <input
            type="password"
            className="auth-input"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="loading-label">
                <LoadingSpinner />
                Please wait...
              </span>
            ) : (
              'Reset Password'
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
