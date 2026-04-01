"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiRequest, ApiError } from '../../../src/lib/api';
import { AuthResponse } from '../../../src/types';
import { saveAuth } from '../../../src/lib/storage';
import { setAuth } from '../../../src/store/slices/authSlice';
import { useAppDispatch } from '../../../src/store';
import { useToast } from '../../../src/components/ui/ToastProvider';
import SidebarArt from '../../../src/components/ui/SidebarArt';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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

    setLoading(true);

    try {
      const data = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      saveAuth(data.accessToken, data.user);
      dispatch(setAuth({ token: data.accessToken, user: data.user }));
      toast.success('Login successful.');
      router.push('/todos');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Login failed';
      if (message.toLowerCase().includes('not verified')) {
        toast.info('Your account is not verified. Please verify OTP.');
        router.push(`/auth/verify?email=${encodeURIComponent(email)}&mode=signup`);
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shopping-page">
      <SidebarArt />

      <section className="shopping-card auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">Welcome back. Login to manage your to-dos.</p>

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
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <Link href="/auth/forgot-password">Forgot password?</Link>
          <Link href="/auth/signup">New user? Create account</Link>
        </div>
      </section>
    </main>
  );
}
