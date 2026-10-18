import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  BTN_PRIMARY_GOLD,
  ErrorAlert,
  INPUT_CLASS,
  LogoBrand,
} from '../components/SharedUI';

export default function AdminLogin() {
  const { session, isAdmin, loading } = useAuth();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'Supabase belum dihubungkan. Silakan isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.local terlebih dahulu.'
      );
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message || 'Email atau kata sandi tidak sesuai.');
      }
    } catch {
      setErrorMsg('Terjadi kendala saat menghubungi server autentikasi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[88vh] items-center justify-center bg-[#f8f7f4] px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 border-t-4 border-t-[#002147] p-8 shadow-lg">
        <div className="text-center mb-6 border-b border-slate-100 pb-5">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center bg-[#002147] shadow-md">
            <LogoBrand className="h-11 w-11" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b48a1e]">
            Sistem Informasi Internal
          </span>
          <h1 className="mt-1 font-serif-editorial text-2xl font-bold text-[#002147]">
            Portal Pengurus
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {settings.org_name} · {settings.cabinet_name}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4">
            <ErrorAlert message={errorMsg} />
          </div>
        )}

        {session && !loading && !isAdmin && (
          <div className="mb-4">
            <ErrorAlert message="Akun Anda berhasil masuk namun belum terdaftar di tabel admin_users. Hubungi administrator sistem." />
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Alamat Email Pengurus
            </label>
            <input
              type="email"
              required
              placeholder="admin@organisasi.id"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`${BTN_PRIMARY_GOLD} w-full py-3`}
          >
            <LogIn className="h-4 w-4" />
            <span>
              {submitting ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard'}
            </span>
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#002147] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Depan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
