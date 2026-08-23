import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, User, Lock, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { villageData } from '../../data/mockData';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi Password Match
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Akun Admin berhasil dibuat! Silakan login.');
        navigate('/login');
      } else {
        setErrorMsg(data.message || 'Gagal mendaftarkan admin!');
      }
    } catch (error) {
      console.error('Error Register:', error);
      setErrorMsg('Gagal terhubung ke server backend Express!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white flex items-center justify-center p-4 relative">
      
      {/* Tombol Kembali ke Login Admin */}
      <Link 
        to="/login"
        className="absolute top-6 left-6 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Halaman Login</span>
      </Link>

      {/* Card Form Register Admin */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6 my-8">
        
        {/* Header Form */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-400 text-blue-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl text-white">Registrasi Admin Baru</h1>
          <p className="text-xs text-slate-400">
            Daftarkan akun petugas baru untuk pengelolaan portal {villageData.name}
          </p>
        </div>

        {/* Pesan Error Jika Ada */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Pendaftaran */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">
              Nama Lengkap Petugas
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: Budi Santoso, S.Sos"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">
              Username Admin
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan username unik"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                required
              />
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Ketik ulang password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                required
              />
              <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 text-blue-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm mt-4 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Memproses Data...' : 'Buat Akun Admin'}</span>
          </button>
        </form>

        {/* Footer Navigasi */}
        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Sudah memiliki akun admin?{' '}
            <Link to="/login" className="text-amber-400 hover:underline font-semibold">
              Login di sini
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}