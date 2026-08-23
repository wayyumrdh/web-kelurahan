import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Building2, 
  Landmark, 
  Newspaper, 
  LogOut, 
  Clock,
  UserCheck 
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');

    if (!isLoggedIn || !storedUser) {
      navigate('/login');
    } else {
      setAdminUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem admin?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('isAdminLoggedIn');
      navigate('/login');
    }
  };

  // Daftar 4 Menu Utama Admin
  const menuItems = [
    {
      label: 'Kelola Persuratan',
      path: '/admin/surat',
      icon: Mail,
      badge: '2 Baru'
    },
    {
      label: 'Kelola Profil Kelurahan',
      path: '/admin/profil',
      icon: Building2,
    },
    {
      label: 'Kelola Fasilitas Umum',
      path: '/admin/fasilitas',
      icon: Landmark,
    },
    {
      label: 'Kelola Berita',
      path: '/admin/berita',
      icon: Newspaper,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* ================= SIDEBAR KIRI (Gaya Gelap) ================= */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Header Sidebar / Logo */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-800">
            <div className="w-9 h-9 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm leading-tight text-white">Admin Kelurahan</h1>
              <p className="text-[11px] text-slate-400">Portal Pengelola</p>
            </div>
          </div>

          {/* Menu Navigasi */}
          <nav className="p-3 space-y-1.5 mt-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout (Bagian Bawah Sidebar) */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
              {adminUser?.nama_lengkap?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{adminUser?.nama_lengkap || 'Admin Staf'}</p>
              <p className="text-[10px] text-slate-400 truncate">@{adminUser?.username || 'admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ================= AREA KONTEN KANAN ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Atas */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <h2 className="font-extrabold text-sm text-slate-800">
            {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard Admin'}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mode Admin Online</span>
          </div>
        </header>

        {/* Tempat Halaman Fitur Dipanggil (<Outlet />) */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
}