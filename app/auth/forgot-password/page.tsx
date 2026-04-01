"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiRequest, ApiError, fireAndForget } from '../../../src/lib/api';
import { useToast } from '../../../src/components/ui/ToastProvider';
import SidebarArt from '../../../src/components/ui/SidebarArt';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.warning('Email is required.');
      return;
    }

    setLoading(true);

    fireAndForget(
      apiRequest<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
      (err) => {
        toast.error(err instanceof ApiError ? err.message : 'Request failed');
      },
    );

    toast.info('Request sent. We are sending OTP in background.');
    router.push(`/auth/verify?email=${encodeURIComponent(email)}&mode=reset`);
    setLoading(false);
  }

  return (
    <main className="shopping-page">
      <SidebarArt />

      <section className="shopping-card auth-card">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">Request OTP to reset your password.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Send OTP'}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/auth/login">Back to login</Link>
        </div>
      </section>
    </main>
  );
}
