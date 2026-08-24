import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  UploadCloud, 
  HardDrive, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';

const categories = [
  'Instansi & Pelayanan', 
  'Tempat Ibadah', 
  'Pendidikan', 
  'Kuliner', 
  'Fasilitas Kesehatan', 
  'Usaha & Pertokoan'
];

// BASE API URL RAILWAY
const API_BASE_URL = 'https://web-kelurahan-production.up.railway.app';

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: 'Instansi & Pelayanan'
  });

  // Image Upload State
  const [activeTab, setActiveTab] = useState('local');
  const [selectedFile, setSelectedFile] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [inputDriveUrl, setInputDriveUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities`);
      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data fasilitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    resetUploadState();
    setFormData({ name: '', address: '', category: 'Instansi & Pelayanan' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    resetUploadState();
    if (item.image) {
      // Bersihkan URL localhost jika telanjur ada di data lama
      const cleanImageUrl = item.image.replace('http://localhost:5000', API_BASE_URL);
      setPreview(cleanImageUrl);
      setDriveUrl(cleanImageUrl);
    }
    setFormData({ name: item.name, address: item.address, category: item.category });
    setIsModalOpen(true);
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setDriveUrl('');
    setInputDriveUrl('');
    setPreview(null);
    setActiveTab('local');
    setIsDragging(false);
  };

  // --- HANDLER UPLOAD GAMBAR ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file berformat gambar (JPG, PNG, WebP)!');
      return;
    }
    setSelectedFile(file);
    setDriveUrl('');
    setPreview(URL.createObjectURL(file));
  };

  const handleDriveSubmit = (e) => {
    e.preventDefault();
    if (!inputDriveUrl.trim()) return;

    const match = inputDriveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    let directUrl = inputDriveUrl;

    if (match && match[1]) {
      directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    setDriveUrl(directUrl);
    setSelectedFile(null);
    setPreview(directUrl);
  };

  const handleClearImage = () => {
    resetUploadState();
  };

  // --- HANDLER SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = new FormData();
    bodyData.append('name', formData.name);
    bodyData.append('address', formData.address);
    bodyData.append('category', formData.category);

    if (selectedFile) {
      bodyData.append('imageFile', selectedFile);
    } else if (driveUrl) {
      bodyData.append('existingImage', driveUrl);
    }

    // 1. DIBERSIHKAN: Menggunakan API_BASE_URL Railway
    const url = editingId 
      ? `${API_BASE_URL}/api/facilities/${editingId}`
      : `${API_BASE_URL}/api/facilities`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: bodyData
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchFacilities();
      } else {
        alert('Gagal menyimpan data fasilitas!');
      }
    } catch (error) {
      console.error('Error saving facility:', error);
    }
  };

  // 2. DIBERSIHKAN: Menggunakan API_BASE_URL Railway untuk DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/facilities/${id}`, { method: 'DELETE' });
      if (response.ok) fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const filteredData = facilities.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER PAGE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Pengelola Fasilitas & Lokasi Penting
          </h1>
          <p className="text-xs text-slate-500 mt-1">Kelola data direktori lokasi dan sarana publik kelurahan.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas Baru</span>
        </button>
      </div>

      {/* TABEL FASILITAS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari lokasi/alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Gambar</th>
                <th className="p-3">Nama Lokasi</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Alamat</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400">Memuat data fasilitas...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400">Tidak ada data ditemukan.</td></tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <img 
                        src={item.image ? item.image.replace('http://localhost:5000', API_BASE_URL) : 'https://via.placeholder.com/100'} 
                        alt={item.name} 
                        className="w-12 h-10 object-cover rounded-lg border bg-slate-100" 
                      />
                    </td>
                    <td className="p-3 font-bold text-slate-800">{item.name}</td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-semibold">{item.category}</span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{item.address}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(item)} 
                          className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TAMBAH / EDIT FASILITAS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2">
              {editingId ? 'Edit Data Fasilitas' : 'Tambah Fasilitas Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              {/* NAMA LOKASI */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lokasi *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Puskesmas Palanro"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* KATEGORI */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-700"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* ALAMAT LENGKAP */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Contoh: Jl. Sultan Hasanuddin No.22, Mallawa..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* AREA UNGGAH FOTO FASILITAS */}
              <div className="space-y-2 pt-1">
                <label className="block font-bold text-slate-700">Foto Fasilitas</label>
                
                {/* TAB SWITCHER SOURCE */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('local')}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activeTab === 'local' 
                        ? 'bg-blue-900 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Laptop / Seret</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('drive')}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activeTab === 'drive' 
                        ? 'bg-blue-900 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    <span>Link Google Drive</span>
                  </button>
                </div>

                {/* AREA 1: DRAG & DROP / FILE EXPLORER */}
                {activeTab === 'local' && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center relative ${
                      isDragging 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud className="w-7 h-7 text-blue-600 mb-1" />
                    <p className="text-xs font-bold text-slate-700">
                      Seret & Lepas Gambar ke Sini
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      atau <span className="text-blue-600 font-semibold underline">klik untuk memilih file dari laptop</span>
                    </p>
                    {selectedFile && (
                      <span className="mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {selectedFile.name}
                      </span>
                    )}
                  </div>
                )}

                {/* AREA 2: LINK GOOGLE DRIVE */}
                {activeTab === 'drive' && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-600">
                      Tempelkan Link Google Drive:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://drive.google.com/file/d/..."
                        value={inputDriveUrl}
                        onChange={(e) => setInputDriveUrl(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleDriveSubmit}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Gunakan
                      </button>
                    </div>
                  </div>
                )}

                {/* PREVIEW GAMBAR */}
                {preview && (
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-500 font-bold mb-1">Pratinjau Foto Terpilih:</p>
                    <div className="relative w-36 h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-300 group">
                      <img src={preview} alt="Preview Foto" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow transition"
                        title="Hapus Gambar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl transition mt-3 shadow-md cursor-pointer"
              >
                Simpan Fasilitas
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
