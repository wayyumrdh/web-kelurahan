import React, { useState, useEffect } from 'react';
import { UploadCloud, HardDrive, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';

export default function ImageUploader({ onFileSelect, onDriveUrlSelect, currentPreview }) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('local'); // 'local' atau 'drive'
  const [driveUrl, setDriveUrl] = useState('');
  const [preview, setPreview] = useState(currentPreview || null);
  const [selectedFileName, setSelectedFileName] = useState('');

  // SINKRONISASI PREVIEW DARI PARENT COMPONENT (PENTING SAAT EDIT DATA)
  useEffect(() => {
    if (currentPreview) {
      // Otomatis ubah localhost menjadi URL Railway jika ada data lama
      const cleanUrl = currentPreview.replace(
        'http://localhost:5000',
        'https://web-kelurahan-production.up.railway.app'
      );
      setPreview(cleanUrl);
    } else {
      setPreview(null);
    }
  }, [currentPreview]);

  // 1. HANDLER DRAG & DROP
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
    setSelectedFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onFileSelect(file); // Kirim file biner ke parent
    onDriveUrlSelect(''); // Kosongkan URL Drive
  };

  // 2. HANDLER GOOGLE DRIVE LINK
  const handleDriveSubmit = (e) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;

    // Ekstrak File ID dari Link Google Drive
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      // Format Direct Image Link yang lebih stabil
      const directImageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      setPreview(directImageUrl);
      onDriveUrlSelect(directImageUrl); 
      onFileSelect(null); // Kosongkan file lokal
    } else if (driveUrl.startsWith('http')) {
      setPreview(driveUrl);
      onDriveUrlSelect(driveUrl);
      onFileSelect(null);
    } else {
      alert('Format link Google Drive tidak valid!');
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFileName('');
    setDriveUrl('');
    onFileSelect(null);
    onDriveUrlSelect('');
  };

  return (
    <div className="space-y-3">
      {/* Pilihan Tab Source */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('local')}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'local' 
              ? 'bg-blue-900 text-white shadow-sm' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload dari Laptop / Seret Gambar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drive')}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
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
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center relative ${
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
          <UploadCloud className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-xs font-bold text-slate-700">
            Seret & Lepas Gambar ke Sini
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            atau <span className="text-blue-600 font-semibold underline">klik untuk memilih dari penyimpanan laptop</span>
          </p>
          {selectedFileName && (
            <span className="mt-2 text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {selectedFileName}
            </span>
          )}
        </div>
      )}

      {/* AREA 2: PASTE LINK GOOGLE DRIVE */}
      {activeTab === 'drive' && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <label className="block text-[11px] font-bold text-slate-700">
            Masukkan Link Berbagi Google Drive:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Contoh: https://drive.google.com/file/d/1A2b3C.../view?usp=sharing"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleDriveSubmit}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
            >
              Gunakan
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            *Pastikan akses file di Google Drive diatur ke "Siapa saja yang memiliki link" (Public).
          </p>
        </div>
      )}

      {/* PRATINJAU (PREVIEW) GAMBAR */}
      {preview && (
        <div className="relative w-32 h-24 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 group mt-2">
          <img 
            src={preview} 
            alt="Pratinjau Foto" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Fallback gambar default jika link salah / gagal muat
              e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition"
            title="Hapus Gambar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
