import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Menu,
  Phone,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { LogoBrand } from './SharedUI';

const NAV_LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil & Struktur' },
  { to: '/kegiatan', label: 'Kegiatan & Galeri' },
  { to: '/pengumuman', label: 'Pengumuman' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSettings();
  const { isAdmin } = useAuth();

  const closeMobile = () => setMobileOpen(false);

  const desktopNavLinkClass = ({ isActive }) =>
    `relative px-3.5 py-5 text-xs lg:text-[13px] font-bold uppercase tracking-[0.08em] transition-colors duration-200 ${
      isActive
        ? 'text-[#eab308] after:absolute after:inset-x-2 after:bottom-0 after:h-1 after:bg-[#eab308]'
        : 'text-slate-100 hover:text-[#eab308]'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between border-l-4 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
      isActive
        ? 'border-[#eab308] bg-[#12355b]/60 text-[#eab308]'
        : 'border-transparent text-slate-200 hover:border-slate-500 hover:bg-[#12355b]/30 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Tier 1: Oxford Top Utility Bar (Information for stakeholders + Admin Portal) */}
      <div className="border-b border-white/10 bg-[#00152e] text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8 text-[11px]">
          <div className="flex items-center gap-2 truncate">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#eab308]" />
            <span className="font-medium tracking-wide text-slate-300 truncate">
              Lembaga & Gerakan Sosial Perjuangan Pendidikan Kepulauan Nias
            </span>
            <span className="hidden text-slate-600 md:inline">|</span>
            <span className="hidden font-semibold text-[#eab308] md:inline">
              {settings.cabinet_name}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/profil#dokumen-resmi"
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-[#eab308] transition-colors"
            >
              <FileText className="h-3 w-3 text-[#eab308]" />
              <span>Konstitusi & AD/ART</span>
            </Link>
            <Link
              to="/kontak"
              className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-[#eab308] transition-colors"
            >
              <Phone className="h-3 w-3 text-[#eab308]" />
              <span>Layanan Sekretariat</span>
            </Link>
            <span className="hidden sm:inline text-slate-600">|</span>
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 bg-[#eab308] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#002147] transition hover:bg-[#d4af37]"
              >
                <ShieldCheck className="h-3 w-3" />
                <span>Panel Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 font-semibold text-slate-200 hover:text-[#eab308] transition-colors"
              >
                <Shield className="h-3 w-3 text-[#eab308]" />
                <span>Portal Pengurus</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: Main Oxford Blue Institutional Header Bar */}
      <div className="border-b-2 border-[#eab308] bg-[#002147] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Official Crest + Institutional Name */}
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3.5 py-3.5 group"
          >
            <LogoBrand className="h-12 w-12 sm:h-13 sm:w-13 shrink-0 group-hover:scale-105" />
            <div className="border-l border-white/20 pl-3.5 leading-tight">
              <span className="block font-serif-editorial text-base sm:text-xl font-bold tracking-wide text-white group-hover:text-[#eab308] transition-colors">
                {settings.org_name}
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#eab308]/90 line-clamp-1">
                Ono Niha · Kepulauan Nias
              </span>
            </div>
          </Link>

          {/* Primary Academic Navigation */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-1"
          >
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={desktopNavLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-sm border border-white/20 p-2 text-slate-200 hover:border-[#eab308] hover:text-[#eab308] transition md:hidden"
            aria-label="Buka menu navigasi"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="border-t border-white/15 bg-[#001a38] px-4 pt-3 pb-6 md:hidden">
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={closeMobile}
                  className={mobileNavLinkClass}
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <div className="mt-4 border-t border-white/15 pt-4 flex flex-col gap-2">
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 bg-[#eab308] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#002147]"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Dashboard Admin Pengurus</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 border border-white/25 bg-[#002147] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-[#eab308] hover:text-[#eab308]"
                  >
                    <Shield className="h-4 w-4 text-[#eab308]" />
                    <span>Login Portal Pengurus</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
