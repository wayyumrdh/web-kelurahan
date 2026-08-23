import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, LogIn, ArrowLeft, User } from 'lucide-react';
import { villageData } from '../../data/mockData';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Cek jika admin sudah login sebelumnya, langsung alihkan ke /admin/surat
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/admin/surat', { replace: true });
    }
  }, [navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('https://web-kelurahan-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan token JWT dan data admin di localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        localStorage.setItem('isAdminLoggedIn', 'true');

        // Langsung arahkan ke halaman utama pengelola surat & layout sidebar
        navigate('/admin/surat', { replace: true });
      } else {
        setErrorMsg(data.message || 'Username atau Password salah!');
      }
    } catch (error) {
      console.error('Error Login:', error);
      setErrorMsg('Gagal terhubung ke server backend Express!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white flex items-center justify-center p-4 relative">
      
      {/* Tombol Kembali ke Portal Warga */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Portal Warga</span>
      </button>

      {/* Card Form Login Admin */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header Form */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-400 text-blue-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl text-white">Login Admin Kelurahan</h1>
          <p className="text-xs text-slate-400">
            Masuk untuk mengelola penyuratan, profil, fasilitas, dan berita {villageData.name}
          </p>
        </div>

        {/* Pesan Error Jika Ada */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan Username Admin"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 text-blue-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm mt-2 shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard Admin'}</span>
          </button>
        </form>

        {/* Link ke Halaman Register */}
        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Belum memiliki akun admin?{' '}
            <Link to="/register" className="text-amber-400 hover:underline font-semibold">
              Daftar Petugas Baru
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}
