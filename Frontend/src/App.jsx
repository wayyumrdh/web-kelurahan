import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Phone, LogOut } from 'lucide-react';
import { villageData } from './data/mockData';

// Import Halaman Standalone / Public
import Welcome from './pages/public/Welcome';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import Home from './pages/public/Home';
import Profile from './pages/public/Profile';
import Facilities from './pages/public/Facilities';
import Letters from './pages/public/Letters';
import News from './pages/public/News';

// Import Layout Admin & Halaman Admin
import AdminLayout from './components/Layout/AdminLayout';
import AdminSurat from './pages/admin/AdminSurat';
import EditProfile from './pages/admin/EditProfile';
import AdminFacilities from './pages/admin/AdminFacilities';
import AdminNews from './pages/admin/AdminNews';

// URL Gambar Logo dari Folder uploads Backend Express
const LOGO_BARRU = "http://localhost:5000/uploads/1785781903565-303426076-Kabupaten_Barru.png";

// Layout Khusus Portal Warga Publik
function MainLayout({ children }) {
  const location = useLocation();

  // Sembunyikan Header/Navbar Publik jika berada di halaman Standalone atau area Admin
  const isStandaloneOrAdmin = 
    location.pathname === '/' || 
    location.pathname === '/welcome' || 
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname.startsWith('/admin');

  if (isStandaloneOrAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-800">
      
      {/* 1. HEADER / NAVBAR GLOBAL WARGA */}
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
          
          {/* Logo Kelurahan & Nama (Mengarah ke /home) */}
          <Link to="/home" className="flex items-center space-x-3">
            <div className="w-14 h-14 flex items-center justify-center shrink-0 overflow-hidden">
              <img 
                src={LOGO_BARRU} 
                alt="Logo Kabupaten Barru" 
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{villageData.name}</h1>
              <p className="text-xs text-blue-200">{villageData.district} - {villageData.regency}</p>
            </div>
          </Link>

          {/* NAVIGASI FITUR UTAMA WARGA */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/home" className="hover:text-amber-400 transition">Beranda</Link>
            <Link to="/profil" className="hover:text-amber-400 transition">Profil Kelurahan</Link>
            <Link to="/fasilitas" className="hover:text-amber-400 transition">Fasilitas Umum</Link>
            <Link to="/penyuratan" className="hover:text-amber-400 transition">Penyuratan</Link>
            <Link to="/berita" className="hover:text-amber-400 transition">Berita</Link>
          </nav>

          {/* AREA TOMBOL KANAN NAVBAR */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white text-xs px-3 py-2 rounded-full font-medium transition border border-white/20"
              title="Kembali ke Halaman Pembuka"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Keluar</span>
            </Link>

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

        </div>
      </header>

      {/* 2. KONTEN HALAMAN PUBLIK */}
      <main className="flex-1">{children}</main>

      {/* 3. FOOTER GLOBAL WARGA */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} {villageData.name}, {villageData.regency}. Hak Cipta Dilindungi Undang-Undang.</p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* HALAMAN PERTAMA SAAT WEB DIBUKA (WELCOME PAGE) */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* HALAMAN UTAMA / BERANDA WARGA */}
          <Route path="/home" element={<Home />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/fasilitas" element={<Facilities />} />
          <Route path="/penyuratan" element={<Letters />} />
          <Route path="/berita" element={<News />} />

          {/* RUTE PANEL ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/surat" replace />} />
            <Route path="surat" element={<AdminSurat />} />
            <Route path="profil" element={<EditProfile />} />
            <Route path="fasilitas" element={<AdminFacilities />} />
            <Route path="berita" element={<AdminNews />} />
          </Route>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}