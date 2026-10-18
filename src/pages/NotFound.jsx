import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-serif-editorial text-7xl sm:text-8xl font-bold text-[#002147]">
        404
      </span>
      <div className="mt-3 h-1 w-16 bg-[#eab308]" />
      <h1 className="mt-4 font-serif-editorial text-2xl font-bold text-[#002147] sm:text-3xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
        Tautan yang Anda tuju mungkin salah ketik, telah dipindahkan, atau tidak
        lagi tersedia di sistem informasi kami.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 bg-[#002147] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#eab308] shadow-sm transition hover:bg-[#12355b]"
      >
        <Home className="h-4 w-4" />
        <span>Kembali ke Beranda Utama</span>
      </Link>
    </div>
  );
}
