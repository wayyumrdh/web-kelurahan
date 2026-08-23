import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Info,
  HardDrive,
  X
} from 'lucide-react';

const letterTypes = [
  {
    id: 'sktm',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    requirements: ['Kartu Tanda Penduduk (KTP)', 'Kartu Keluarga (KK)']
  },
  {
    id: 'sku',
    title: 'Surat Keterangan Usaha (SKU)',
    requirements: ['Kartu Tanda Penduduk (KTP)', 'Kartu Keluarga (KK)']
  },
  {
    id: 'akta',
    title: 'Surat Pengantar Pembuatan Akta Kelahiran',
    requirements: [
      'Kwitansi Pelunasan PBB (Pajak Bumi dan Bangunan)',
      'Surat Nikah / Akta Perkawinan Orang Tua',
      'Kartu Keluarga (KK)',
      'Kartu Tanda Penduduk (KTP) Orang Tua',
      'Surat Keterangan Lahir dari Bidan / Dokter / Fasilitas Kesehatan'
    ]
  },
  {
    id: 'izin_keramaian',
    title: 'Surat Pengantar Izin Keramaian',
    requirements: [
      'Kartu Tanda Penduduk (KTP) Pemohon / Penanggung Jawab',
      'Kartu Keluarga (KK)'
    ]
  },
  {
    id: 'kk_baru',
    title: 'Surat Pengantar Pembuatan Kartu Keluarga (KK)',
    requirements: [
      'Surat Nikah / Akta Perceraian',
      'Akta Kelahiran Anggota Keluarga',
      'Ijazah Terakhir'
    ]
  },
  {
    id: 'ktp_baru',
    title: 'Surat Pengantar Pembuatan KTP',
    requirements: ['Kartu Keluarga (KK)', 'Pasfoto Pemohon Ukuran 2x3 cm']
  },
  {
    id: 'domisili',
    title: 'Surat Keterangan Domisili',
    requirements: ['Kartu Keluarga (KK)', 'Kartu Tanda Penduduk (KTP)']
  },
  {
    id: 'mutasi',
    title: 'Surat Pengantar Mutasi Penduduk (Pindah / Datang)',
    requirements: ['Kartu Keluarga (KK)', 'Kartu Tanda Penduduk (KTP)']
  },
  {
    id: 'skck',
    title: 'Surat Pengantar SKCK (Surat Keterangan Catatan Kepolisian)',
    requirements: ['Ijazah Terakhir', 'Kartu Tanda Penduduk (KTP)']
  }
];

export default function Letters() {
  const [selectedLetterId, setSelectedLetterId] = useState('sktm');
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    phone: '',
    alamat: '',
    catatan: ''
  });

  const [uploadTabs, setUploadTabs] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [driveUrls, setDriveUrls] = useState({});
  const [draggingStates, setDraggingStates] = useState({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedResi, setSubmittedResi] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedLetter = letterTypes.find(l => l.id === selectedLetterId);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNikChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, nik: value });
  };

  // --- HANDLER VALIDASI UKURAN FILE (MAX 2MB) ---
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB dalam bytes

  const handleFileProcess = (reqName, file) => {
    if (!file) return;

    // Periksa ukuran file
    if (file.size > MAX_FILE_SIZE) {
      alert(`Ukuran file "${file.name}" melebihi batas maksimal 2 MB! Mohon kecilkan ukuran foto/dokumen Anda.`);
      return;
    }

    setUploadedFiles(prev => ({ ...prev, [reqName]: file }));
    setDriveUrls(prev => ({ ...prev, [reqName]: '' }));
  };

  const handleDragOver = (e, reqName) => {
    e.preventDefault();
    setDraggingStates(prev => ({ ...prev, [reqName]: true }));
  };

  const handleDragLeave = (reqName) => {
    setDraggingStates(prev => ({ ...prev, [reqName]: false }));
  };

  const handleDrop = (e, reqName) => {
    e.preventDefault();
    setDraggingStates(prev => ({ ...prev, [reqName]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(reqName, e.dataTransfer.files[0]);
    }
  };

  const handleDriveUrlChange = (reqName, url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    let directUrl = url;
    if (match && match[1]) {
      directUrl = `https://lh3.googleusercontent.com/d/${match[1]}`;
    }

    setDriveUrls(prev => ({ ...prev, [reqName]: directUrl }));
    setUploadedFiles(prev => ({ ...prev, [reqName]: null }));
  };

  const handleClearItem = (reqName) => {
    setUploadedFiles(prev => ({ ...prev, [reqName]: null }));
    setDriveUrls(prev => ({ ...prev, [reqName]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.nik || !formData.phone) {
      alert('Harap isi Nama Lengkap, NIK, dan Nomor HP / WhatsApp!');
      return;
    }

    setLoading(true);

    const berkasArray = selectedLetter.requirements.map(req => {
      if (uploadedFiles[req]) {
        return { label: req, name: uploadedFiles[req].name, type: 'file' };
      } else if (driveUrls[req]) {
        return { label: req, name: driveUrls[req], type: 'drive' };
      }
      return { label: req, name: 'Belum diunggah', type: 'none' };
    });

    try {
      const bodyData = new FormData();
      bodyData.append('nama', formData.nama);
      bodyData.append('nik', formData.nik);
      bodyData.append('phone', formData.phone);
      bodyData.append('alamat', formData.alamat);
      bodyData.append('jenisSurat', selectedLetter.title);
      bodyData.append('catatan', formData.catatan);
      bodyData.append('berkas', JSON.stringify(berkasArray));

      Object.keys(uploadedFiles).forEach(key => {
        if (uploadedFiles[key]) {
          bodyData.append('dokumenFiles', uploadedFiles[key]);
        }
      });

      const response = await fetch('http://localhost:5000/api/letters', {
        method: 'POST',
        body: bodyData
      });

      const data = await response.json();

      if (response.ok) {
        setSubmittedResi(data.id || '');
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.message || 'Gagal mengirimkan pengajuan surat ke server!');
      }
    } catch (error) {
      console.error('Error submitting letter:', error);
      alert('Gagal terhubung ke server backend Express!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pb-16">
      
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="bg-blue-800 text-blue-200 text-xs uppercase px-3 py-1 rounded-full font-semibold border border-blue-700">
            Pelayanan Administrasi Digital
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 mb-2">
            Pengajuan Layanan Surat
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
            Isi formulir pengajuan surat keterangan atau surat pengantar kelurahan secara online dan unggah berkas persyaratan yang dibutuhkan.
          </p>
        </div>
      </section>

      {/* CONTAINER FORMULIR */}
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        
        {isSubmitted ? (
          <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-md text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Pengajuan Surat Berhasil Dikirimkan!</h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Permohonan <strong className="text-slate-900">{selectedLetter.title}</strong> atas nama <strong>{formData.nama}</strong> telah terdata di sistem.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto text-left space-y-1">
              {submittedResi && (
                <p>• <strong>No. Resi Pengajuan:</strong> <span className="text-blue-700 font-bold">{submittedResi}</span></p>
              )}
              <p>• <strong>Nomor WhatsApp:</strong> {formData.phone}</p>
              <p>• <strong>NIK:</strong> {formData.nik}</p>
              <p className="text-amber-700 pt-2 font-medium">
                * Petugas kelurahan akan meninjau pengajuan Anda dan menghubungi Anda langsung melalui WhatsApp untuk proses selanjutnya. Mohon pastikan nomor WhatsApp Anda aktif.
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSubmittedResi('');
                setFormData({ nama: '', nik: '', phone: '', alamat: '', catatan: '' });
                setUploadedFiles({});
                setDriveUrls({});
              }}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition mt-4 cursor-pointer"
            >
              Buat Pengajuan Baru
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* 1. PILIH JENIS SURAT */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">1. Pilih Jenis Surat</h2>
                  <p className="text-xs text-slate-500">Pilih jenis pelayanan surat keterangan atau pengantar yang dibutuhkan</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Jenis Surat <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedLetterId}
                  onChange={(e) => {
                    setSelectedLetterId(e.target.value);
                    setUploadedFiles({});
                    setDriveUrls({});
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {letterTypes.map((letter) => (
                    <option key={letter.id} value={letter.id}>
                      {letter.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Daftar Berkas Persyaratan yang Perlu Disiapkan:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                  {selectedLetter.requirements.map((req, idx) => (
                    <li key={idx}><strong>{req}</strong></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. ISIAN DATA DIRI PEMOHON */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">2. Data Diri Pemohon</h2>
                  <p className="text-xs text-slate-500">Lengkapi identitas diri sesuai dokumen KTP / Kartu Keluarga</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Contoh: Andi Muhammad Farhan"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      name="nik"
                      value={formData.nik}
                      onChange={handleNikChange}
                      placeholder="16 Digit NIK di KTP/KK"
                      maxLength={16}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    No. HP / WhatsApp Active <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Contoh: 081234567890"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Alamat Lengkap (RT/RW)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      placeholder="Lingkungan / Kampung, RT/RW"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Keperluan / Alasan Pengajuan
                </label>
                <textarea
                  name="catatan"
                  rows={2}
                  value={formData.catatan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Untuk persyaratan pendaftaran beasiswa / permohonan kredit bank"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. UPLOAD BERKAS SESUAI SURAT */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">3. Unggah Berkas Dokumen</h2>
                  <p className="text-xs text-slate-500">Pilih berkas dari perangkat (maks. 2MB) atau sertakan link Google Drive</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedLetter.requirements.map((req, idx) => {
                  const currentTab = uploadTabs[req] || 'local';
                  const localFile = uploadedFiles[req];
                  const driveUrl = driveUrls[req];

                  return (
                    <div key={idx} className="border border-slate-200 p-4 rounded-xl bg-slate-50/70 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block mb-0.5">
                          {idx + 1}. {req}
                        </span>
                        <p className="text-[10px] text-slate-400">Upload scan/foto dokumen (Maksimal 2 MB)</p>
                      </div>

                      <div className="flex gap-1.5 border-b border-slate-200 pb-2">
                        <button
                          type="button"
                          onClick={() => setUploadTabs(prev => ({ ...prev, [req]: 'local' }))}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                            currentTab === 'local'
                              ? 'bg-blue-900 text-white'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>Perangkat / Seret</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUploadTabs(prev => ({ ...prev, [req]: 'drive' }))}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                            currentTab === 'drive'
                              ? 'bg-blue-900 text-white'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          <HardDrive className="w-3 h-3 text-amber-400" />
                          <span>Google Drive</span>
                        </button>
                      </div>

                      {currentTab === 'local' && (
                        <div
                          onDragOver={(e) => handleDragOver(e, req)}
                          onDragLeave={() => handleDragLeave(req)}
                          onDrop={(e) => handleDrop(e, req)}
                          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition relative flex flex-col items-center justify-center ${
                            draggingStates[req] 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-slate-300 bg-white hover:border-blue-500'
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => e.target.files[0] && handleFileProcess(req, e.target.files[0])}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <UploadCloud className="w-5 h-5 text-blue-600 mb-1" />
                          <p className="text-[11px] font-bold text-slate-700">Seret File Dokumen Ke Sini</p>
                          <p className="text-[9px] text-slate-400">atau klik untuk pilih (Maksimal 2 MB)</p>
                        </div>
                      )}

                      {currentTab === 'drive' && (
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder="Tempel link Google Drive di sini..."
                            value={driveUrl || ''}
                            onChange={(e) => handleDriveUrlChange(req, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          <p className="text-[9px] text-slate-400">*Pastikan akses file drive telah diset Publik</p>
                        </div>
                      )}

                      {(localFile || driveUrl) && (
                        <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                          <div className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-bold truncate text-[11px]">
                              {localFile ? localFile.name : 'Link Google Drive Terhubung'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleClearItem(req)}
                            className="text-red-500 hover:text-red-700 p-0.5 rounded transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2 text-xs text-amber-800 mt-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Himbauan Pelayanan:</strong> Harap membawa berkas dokumen <strong>Asli & Fotokopi</strong> saat pengambilan surat fisik di Kantor Kelurahan Mallawa.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? 'Mengirimkan Pengajuan...' : 'Kirim Pengajuan Surat Digital'}</span>
            </button>

          </form>
        )}

      </main>
    </div>
  );
}