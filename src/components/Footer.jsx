import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Shield,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatInstagramUrl } from '../lib/supabase';
import { LogoBrand } from './SharedUI';

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t-4 border-[#eab308] bg-[#00152e] text-slate-300">
      {/* Main Institutional Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Column 1: Crest & Mission Statement (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <LogoBrand className="h-12 w-12 shrink-0" />
              <div className="border-l border-white/20 pl-3.5">
                <h3 className="font-serif-editorial text-lg font-bold text-white tracking-wide">
                  {settings.org_name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#eab308]">
                  {settings.cabinet_name}
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm text-slate-300 leading-relaxed">
              {settings.org_tagline}
            </p>

            <p className="max-w-md text-xs text-slate-400 leading-relaxed border-l-2 border-[#eab308]/50 pl-3">
              Mengawal dan memfasilitasi generasi muda Kepulauan Nias (Ono Niha)
              menuju pendidikan tinggi berkualitas melalui sosialisasi,
              pendampingan seleksi nasional, dan solidaritas tanah rantau.
            </p>
          </div>

          {/* Column 2: Direktori Halaman (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif-editorial text-xs font-bold uppercase tracking-[0.15em] text-[#eab308] border-b border-white/10 pb-2">
              Direktori Informasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 hover:text-[#eab308] transition-colors inline-flex items-center gap-1"
                >
                  <span>Beranda Utama</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profil"
                  className="text-slate-300 hover:text-[#eab308] transition-colors inline-flex items-center gap-1"
                >
                  <span>Profil, Visi-Misi & Struktur BPH</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/kegiatan"
                  className="text-slate-300 hover:text-[#eab308] transition-colors inline-flex items-center gap-1"
                >
                  <span>Agenda & Dokumentasi Kegiatan</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/pengumuman"
                  className="text-slate-300 hover:text-[#eab308] transition-colors inline-flex items-center gap-1"
                >
                  <span>Pengumuman & Maklumat Resmi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="text-slate-300 hover:text-[#eab308] transition-colors inline-flex items-center gap-1"
                >
                  <span>Sekretariat & Saluran Aspirasi</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 border border-white/15 bg-[#002147] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#eab308] hover:text-[#eab308] transition"
                >
                  <Shield className="h-3.5 w-3.5 text-[#eab308]" />
                  <span>Portal Pengurus</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sekretariat & Hubungan Masyarakat (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif-editorial text-xs font-bold uppercase tracking-[0.15em] text-[#eab308] border-b border-white/10 pb-2">
              Sekretariat & Hubungan
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#eab308] mt-0.5" />
                <span className="leading-relaxed">
                  {settings.contact_info?.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#eab308]" />
                <a
                  href={`mailto:${settings.contact_info?.email}`}
                  className="hover:text-[#eab308] transition underline underline-offset-4"
                >
                  {settings.contact_info?.email}
                </a>
              </li>
              {settings.contact_info?.whatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#eab308]" />
                  <a
                    href={`https://wa.me/${settings.contact_info.whatsapp.replace(
                      /\D/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#eab308] transition inline-flex items-center gap-1"
                  >
                    <span>{settings.contact_info.whatsapp}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-70" />
                  </a>
                </li>
              )}
              {settings.contact_info?.instagram && (
                <li className="flex items-center gap-2.5">
                  <InstagramIcon className="h-4 w-4 shrink-0 text-[#eab308]" />
                  <a
                    href={formatInstagramUrl(settings.contact_info.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#eab308] transition inline-flex items-center gap-1"
                  >
                    <span>{settings.contact_info.instagram}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-70" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>
            © {currentYear} {settings.org_name}{' '}
            <span className="mx-1.5 text-slate-600">·</span>{' '}
            <span>
              Crafted by{' '}
              <a
                href="https://www.instagram.com/vinn.shpa"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-300 hover:text-[#eab308] hover:underline transition-colors"
                title="Instagram @vinn.shpa"
              >
                Calvin
              </a>
            </span>
          </p>
          <p className="text-slate-500">
            Hak Cipta Dilindungi · Kepulauan Nias, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
