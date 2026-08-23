import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Target, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  UserCheck,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { villageData } from '../../data/mockData';

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: villageData.name || 'Kelurahan Mallawa',
    district: villageData.district || 'Kecamatan Mallusetasi',
    regency: villageData.regency || 'Kabupaten Barru',
    elevation: villageData.elevation || '10 - 250 mdpl',
    borders: { ...villageData.borders },
    visi: "Terwujudnya Kelurahan Mallawa yang Mandiri, Sejahtera, Berwawasan Lingkungan, dan Pelayanan Berbasis Digital.",
    misi: [
      "Meningkatkan efektivitas pelayanan publik yang ramah, transparan, dan cepat.",
      "Mengoptimalkan potensi sektor perkebunan, pertanian, dan usaha lokal warga.",
      "Menjaga kelestarian kawasan hutan serta fasilitas lingkungan yang berkelanjutan."
    ],
    stats: { ...villageData.stats },
    ageGroups: [
      { category: 'Usia Anak (0 – 17 THN)', count: 1145, percentage: '28.6%' },
      { category: 'Usia Produktif (18 – 56 THN)', count: 2164, percentage: '54.1%' },
      { category: 'Usia Lanjut (> 56 THN)', count: 692, percentage: '17.3%' }
    ],
    officials: [
      { name: 'H. Ahmad Dahlan, S.STP', role: 'Lurah Mallawa', photo: '' },
      { name: 'Budi Santoso, S.Sos', role: 'Sekretaris Kelurahan', photo: '' },
      { name: 'Siti Rahmawati, S.E', role: 'Kasi Pemerintahan', photo: '' },
      { name: 'Dedi Kurniawan', role: 'Kasi Kesejahteraan Rakyat', photo: '' }
    ]
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.name,
            district: data.district,
            regency: data.regency,
            elevation: data.elevation || '10 - 250 mdpl',
            borders: typeof data.borders === 'string' ? JSON.parse(data.borders) : data.borders,
            visi: data.visi,
            misi: typeof data.misi === 'string' ? JSON.parse(data.misi) : data.misi,
            stats: typeof data.stats === 'string' ? JSON.parse(data.stats) : data.stats,
            ageGroups: typeof data.age_groups === 'string' ? JSON.parse(data.age_groups) : (data.ageGroups || []),
            officials: typeof data.officials === 'string' ? JSON.parse(data.officials) : data.officials,
          });
        }
      } catch (error) {
        console.error('Gagal mengambil data profil dari MySQL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleBorderChange = (direction, value) => {
    setProfile({
      ...profile,
      borders: { ...profile.borders, [direction]: value }
    });
  };

  const handleStatChange = (field, value) => {
    setProfile({
      ...profile,
      stats: { ...profile.stats, [field]: Number(value) }
    });
  };

  const handleMisiChange = (index, value) => {
    const newMisi = [...profile.misi];
    newMisi[index] = value;
    setProfile({ ...profile, misi: newMisi });
  };

  const addMisi = () => {
    setProfile({ ...profile, misi: [...profile.misi, ''] });
  };

  const removeMisi = (index) => {
    const newMisi = profile.misi.filter((_, i) => i !== index);
    setProfile({ ...profile, misi: newMisi });
  };

  // --- HANDLER ORGANISASI & FOTO STAF ---
  const handleOfficialChange = (index, field, value) => {
    const newOfficials = [...profile.officials];
    newOfficials[index][field] = value;
    setProfile({ ...profile, officials: newOfficials });
  };

  const handleOfficialPhotoUpload = async (index, file) => {
    if (!file) return;

    // Batas file gambar maksimal 2 MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto melebihi batas maksimal 2 MB!');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      // PERBAIKAN URL: Ditambahkan '/profile' agar sesuai dengan router Express
      const response = await fetch('http://localhost:5000/api/profile/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Update URL/filename foto staf yang bersangkutan
        handleOfficialChange(index, 'photo', data.filename || data.url);
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'Gagal mengunggah foto aparatur!');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Terjadi kesalahan koneksi saat mengunggah foto!');
    }
  };

  const addOfficial = () => {
    setProfile({
      ...profile,
      officials: [...profile.officials, { name: '', role: '', photo: '' }]
    });
  };

  const removeOfficial = (index) => {
    const newOfficials = profile.officials.filter((_, i) => i !== index);
    setProfile({ ...profile, officials: newOfficials });
  };

  // Format preview URL foto (Support local uploads / external URL)
  const getPhotoPreview = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    return `http://localhost:5000/uploads/${photo}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setSavedSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert('Gagal menyimpan perubahan ke database!');
      }
    } catch (error) {
      console.error('Error saat menyimpan profil:', error);
      alert('Terjadi kesalahan koneksi ke server Express!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-slate-600 font-semibold text-sm animate-pulse">
          Memuat data profil kelurahan dari database...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 text-slate-800 font-sans min-h-screen pb-16">
      
      {/* BANNER HEADER ADMIN */}
      <section className="bg-slate-900 text-white py-8 px-4 border-b border-slate-800">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-amber-400 text-blue-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Panel Kelola Admin
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Edit Profil Kelurahan
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Perbarui batas wilayah, visi misi, statistik kependudukan, dan aparatur kelurahan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CONTAINER FORM KELOLA */}
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Perubahan Berhasil Disimpan!</h4>
              <p className="text-xs text-emerald-700">Data profil kelurahan telah diperbarui di database MySQL dan otomatis tampil di halaman publik warga.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 1. INFORMASI UMUM & BATAS WILAYAH */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">1. Informasi Umum & Batas Wilayah</h2>
                <p className="text-xs text-slate-500">Nama kelurahan, wilayah administratif, dan batas geografis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Kelurahan</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kabupaten</label>
                <input
                  type="text"
                  name="regency"
                  value={profile.regency}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Batas Administrative Wilayah</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batas Utara</label>
                  <input
                    type="text"
                    value={profile.borders?.north || ''}
                    onChange={(e) => handleBorderChange('north', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batas Selatan</label>
                  <input
                    type="text"
                    value={profile.borders?.south || ''}
                    onChange={(e) => handleBorderChange('south', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batas Timur</label>
                  <input
                    type="text"
                    value={profile.borders?.east || ''}
                    onChange={(e) => handleBorderChange('east', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batas Barat</label>
                  <input
                    type="text"
                    value={profile.borders?.west || ''}
                    onChange={(e) => handleBorderChange('west', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. VISI & MISI KELURAHAN */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">2. Visi & Misi Kelurahan</h2>
                <p className="text-xs text-slate-500">Arah pembangunan dan misi utama pelayanan warga</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pernyataan Visi</label>
              <textarea
                name="visi"
                rows={2}
                value={profile.visi}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-semibold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Daftar Misi Utama</label>
                <button
                  type="button"
                  onClick={addMisi}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Misi
                </button>
              </div>

              <div className="space-y-3">
                {profile.misi.map((m, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => handleMisiChange(idx, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeMisi(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Hapus Misi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. DATA STATISTIK KEPENDUDUKAN */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">3. Statistik Kependudukan</h2>
                <p className="text-xs text-slate-500">Jumlah total warga, Kepala Keluarga, dan rasio gender</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Penduduk (Jiwa)</label>
                <input
                  type="number"
                  value={profile.stats?.penduduk || 0}
                  onChange={(e) => handleStatChange('penduduk', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kepala Keluarga (KK)</label>
                <input
                  type="number"
                  value={profile.stats?.kk || 0}
                  onChange={(e) => handleStatChange('kk', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Laki-Laki (Jiwa)</label>
                <input
                  type="number"
                  value={profile.stats?.lakiLaki || 0}
                  onChange={(e) => handleStatChange('lakiLaki', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Perempuan (Jiwa)</label>
                <input
                  type="number"
                  value={profile.stats?.perempuan || 0}
                  onChange={(e) => handleStatChange('perempuan', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. STRUKTUR APARATUR PEMERINTAHAN (DENGAN UNGGAN FOTO) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">4. Aparatur Kelurahan</h2>
                  <p className="text-xs text-slate-500">Struktur pejabat, peran, dan foto profil aparatur</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addOfficial}
                className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pejabat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profile.officials.map((official, idx) => {
                const previewUrl = getPhotoPreview(official.photo);

                return (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeOfficial(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition cursor-pointer"
                      title="Hapus Aparatur"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* BOX UPLOAD / PREVIEW FOTO */}
                    <div className="flex items-center gap-4 pt-1">
                      <div className="w-16 h-16 bg-slate-200 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {previewUrl ? (
                          <img 
                            src={previewUrl} 
                            alt={official.name || 'Aparatur'} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Foto Profil Staf
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>Unggah Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files[0] && handleOfficialPhotoUpload(idx, e.target.files[0])}
                              className="hidden"
                            />
                          </label>

                          {official.photo && (
                            <button
                              type="button"
                              onClick={() => handleOfficialChange(idx, 'photo', '')}
                              className="text-[11px] text-red-500 hover:underline font-medium cursor-pointer"
                            >
                              Hapus Foto
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">Format: JPG, PNG, WEBP (Maksimal 2 MB)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nama Pejabat</label>
                      <input
                        type="text"
                        value={official.name}
                        onChange={(e) => handleOfficialChange(idx, 'name', e.target.value)}
                        placeholder="Contoh: H. Ahmad Dahlan, S.STP"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Jabatan / Peran</label>
                      <input
                        type="text"
                        value={official.role}
                        onChange={(e) => handleOfficialChange(idx, 'role', e.target.value)}
                        placeholder="Contoh: Lurah Mallawa"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-blue-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Link URL Foto (Opsional)</label>
                      <input
                        type="text"
                        value={official.photo || ''}
                        onChange={(e) => handleOfficialChange(idx, 'photo', e.target.value)}
                        placeholder="https://... atau nama file"
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* TOMBOL SUBMIT BAWAH */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Profil'}</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}