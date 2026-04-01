"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiRequest, ApiError, fireAndForget } from '../../../src/lib/api';
import { useToast } from '../../../src/components/ui/ToastProvider';
import SidebarArt from '../../../src/components/ui/SidebarArt';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.warning('Email and password are required.');
      return;
    }

    if (password.trim().length < 6) {
      toast.warning('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    fireAndForget(
      apiRequest<{ message: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
      (err) => {
        toast.error(err instanceof ApiError ? err.message : 'Signup failed');
      },
    );

    toast.info('Request sent. We are sending OTP in background.');
    router.push(`/auth/verify?email=${encodeURIComponent(email)}&mode=signup`);
    setLoading(false);
  }

  return (
    <main className="shopping-page">
      <SidebarArt />

      <section className="shopping-card auth-card">
        <h1>Sign Up</h1>
        <p className="auth-subtitle">Create your account and verify OTP.</p>

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
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="loading-label">
                <LoadingSpinner />
                Please wait...
              </span>
            ) : (
              'Signup'
            )}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/auth/login">Already registered? Login</Link>
        </div>
      </section>
    </main>
  );
}
