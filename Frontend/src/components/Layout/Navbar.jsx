// src/components/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { villageData } from '../../data/mockData';

export default function Navbar() {
  return (
    <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO & NAMA KELURAHAN */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="/Kabupaten-Barru.jpg" 
              alt="Logo Kabupaten Barru" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{villageData.name}</h1>
            <p className="text-xs text-blue-200">{villageData.district} - {villageData.regency}</p>
          </div>
        </Link>

        {/* 4 MENU UTAMA MENGGUNAKAN LINK REACT ROUTER */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-amber-400 transition">Beranda</Link>
          <Link to="/profil" className="hover:text-amber-400 transition">Profil Kelurahan</Link>
          <Link to="/fasilitas" className="hover:text-amber-400 transition">Fasilitas Umum</Link>
          <Link to="/penyuratan" className="hover:text-amber-400 transition">Penyuratan</Link>
          <Link to="/berita" className="hover:text-amber-400 transition">Berita</Link>
        </nav>

        {/* TOMBOL KONTAK */}
        <a 
          href="https://wa.me/6281234567890" 
          target="_blank" 
          rel="noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow transition"
        >
          <Phone className="w-4 h-4" />
          <span>Hubungi Kami</span>
        </a>

      </div>
    </header>
  );
}