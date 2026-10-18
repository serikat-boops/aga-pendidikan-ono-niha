import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LoadingState } from './components/SharedUI';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4] text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedAdminRoute() {
  const { session, isAdmin, loading, signOut } = useAuth();

  if (loading) return <LoadingState />;

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto my-16 max-w-md bg-white border border-slate-200 border-t-4 border-t-red-600 p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mb-2 font-serif-editorial text-2xl font-bold text-[#002147]">
          Akses Ditolak
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Akun Anda ({session.user.email}) belum didaftarkan sebagai
          Administrator/Pengurus di sistem.
        </p>
        <button
          type="button"
          onClick={signOut}
          className="bg-[#002147] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#eab308] transition hover:bg-[#12355b]"
        >
          Keluar dari Akun
        </button>
      </div>
    );
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Suspense fallback={<LoadingState className="min-h-screen" />}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/kegiatan" element={<Activities />} />
                <Route path="/kegiatan/:id" element={<ActivityDetail />} />
                <Route path="/pengumuman" element={<Announcements />} />
                <Route path="/kontak" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
