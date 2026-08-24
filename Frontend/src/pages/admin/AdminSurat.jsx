import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  FileText, 
  Eye, 
  Phone, 
  User, 
  MapPin, 
  Download,
  X,
  Search,
  Calendar,
  CreditCard,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

// BASE API URL RAILWAY
const API_BASE_URL = 'https://web-kelurahan-production.up.railway.app';

export default function AdminSurat() {
  const [suratList, setSuratList] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingContact, setUpdatingContact] = useState(false);

  useEffect(() => {
    fetchSuratData();
  }, []);

  const fetchSuratData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters`);
      if (response.ok) {
        const data = await response.json();
        setSuratList(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data pengajuan surat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactWhatsapp = (item) => {
    let cleanPhone = (item.phone || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);

    const pesan = `Halo ${item.nama}, kami dari Kantor Kelurahan Mallawa ingin menindaklanjuti pengajuan ${item.jenis_surat || item.jenisSurat} Anda (No. Resi: ${item.id}).`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pesan)}`;
    window.open(waUrl, '_blank');

    markAsContacted(item.id, true);
  };

  // 1. DIBERSIHKAN: Menggunakan API_BASE_URL Railway
  const markAsContacted = async (id, contacted) => {
    setUpdatingContact(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters/${id}/contact`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacted })
      });

      if (response.ok) {
        setSuratList(prev =>
          prev.map(item => item.id === id ? { ...item, contacted } : item)
        );
        setSelectedSurat(prev => (prev && prev.id === id ? { ...prev, contacted } : prev));
      }
    } catch (error) {
      console.error('Gagal memperbarui status kontak:', error);
    } finally {
      setUpdatingContact(false);
    }
  };

  const filteredList = suratList.filter(item => 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nik?.includes(searchQuery) ||
    item.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER PAGE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Pengelola Permohonan Surat Warga
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Peninjauan dokumen dan tindak lanjut pengajuan surat warga.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari NIK, Nama, No Resi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* TABEL DAFTAR PERMOHONAN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-sm text-slate-800">Daftar Surat Diajukan</h2>
            <p className="text-[11px] text-slate-500">Klik "Detail" untuk memeriksa berkas, atau "WA" untuk langsung menghubungi pengaju</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            Total: {filteredList.length} Surat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">No. Resi & Tanggal</th>
                <th className="p-3.5">Nama Pemohon & NIK</th>
                <th className="p-3.5">Jenis Surat</th>
                <th className="p-3.5">No. WhatsApp</th>
                <th className="p-3.5">Status Kontak</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Memuat data permohonan surat dari database...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada data pengajuan surat masuk.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <span className="font-extrabold text-blue-900 block">{item.id}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at || Date.now()).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{item.nama}</span>
                      <span className="text-[11px] text-slate-500">NIK: {item.nik}</span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">{item.jenis_surat || item.jenisSurat}</td>
                    <td className="p-3.5 font-mono text-blue-600">{item.phone}</td>
                    <td className="p-3.5">
                      {item.contacted ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-emerald-100 text-emerald-700 border-emerald-300 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Sudah Dihubungi
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-amber-100 text-amber-700 border-amber-300 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Belum Dihubungi
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleContactWhatsapp(item)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WA</span>
                        </button>
                        <button
                          onClick={() => setSelectedSurat(item)}
                          className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-300" />
                          <span>Detail</span>
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

      {/* MODAL PENINJAUAN BERKAS & ISI SURAT */}
      {selectedSurat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setSelectedSurat(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Resi: {selectedSurat.id}
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-2">
                {selectedSurat.jenis_surat || selectedSurat.jenisSurat}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Diterima pada {new Date(selectedSurat.created_at || Date.now()).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Rincian Data Pengaju Surat */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Data Identitas Pengaju
              </h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-blue-600" /> Nama Lengkap
                  </span>
                  <p className="font-bold text-slate-800 text-sm">{selectedSurat.nama}</p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-blue-600" /> NIK
                  </span>
                  <p className="font-bold text-slate-800 text-sm">{selectedSurat.nik}</p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-blue-600" /> No. WhatsApp
                  </span>
                  <p className="font-bold text-blue-600 text-sm">{selectedSurat.phone}</p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" /> Alamat
                  </span>
                  <p className="font-semibold text-slate-700">{selectedSurat.alamat || '-'}</p>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
                    Alasan / Keperluan Permohonan
                  </span>
                  <p className="font-medium text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                    {selectedSurat.catatan || 'Tidak melampirkan catatan tambahan'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rincian Berkas Persyaratan Terunggah */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Berkas Persyaratan Terunggah
              </h3>

              <div className="space-y-2">
                {(() => {
                  let berkasItems = [];
                  try {
                    berkasItems = typeof selectedSurat.berkas === 'string' 
                      ? JSON.parse(selectedSurat.berkas) 
                      : (selectedSurat.berkas || []);
                  } catch (e) {
                    berkasItems = [];
                  }

                  if (berkasItems.length === 0) {
                    return (
                      <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                        Pengaju tidak mengunggah berkas terlampir.
                      </p>
                    );
                  }

                  return berkasItems.map((b, idx) => {
                    const fileNameOrUrl = b.name || '';
                    
                    // 2. DIBERSIHKAN: Format URL Berkas Railway & Localhost Fallback
                    let fileUrl = '';
                    if (fileNameOrUrl.startsWith('http://') || fileNameOrUrl.startsWith('https://')) {
                      fileUrl = fileNameOrUrl.replace('http://localhost:5000', API_BASE_URL);
                    } else if (fileNameOrUrl && fileNameOrUrl !== 'Belum diunggah') {
                      fileUrl = `${API_BASE_URL}/uploads/${fileNameOrUrl}`;
                    }

                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-800">{b.label || `Dokumen Persyaratan ${idx + 1}`}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{fileNameOrUrl || 'Belum diunggah'}</p>
                          </div>
                        </div>

                        {/* TOMBOL LIHAT DOKUMEN & UNDUH */}
                        <div className="flex items-center gap-2 shrink-0">
                          {fileUrl ? (
                            <>
                              <button
                                onClick={() => window.open(fileUrl, '_blank')}
                                className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                                <span>Lihat Berkas</span>
                              </button>

                              <a
                                href={fileUrl}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-blue-600" />
                                <span>Unduh</span>
                              </a>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic bg-slate-100 px-2.5 py-1 rounded-md border">
                              Belum diunggah
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* PANEL TINDAK LANJUT */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Tindak Lanjut Pengajuan
              </h3>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-600">
                    Status kontak saat ini:{' '}
                    {selectedSurat.contacted ? (
                      <strong className="text-emerald-700">Sudah Dihubungi</strong>
                    ) : (
                      <strong className="text-amber-700">Belum Dihubungi</strong>
                    )}
                  </span>

                  <button
                    onClick={() => markAsContacted(selectedSurat.id, !selectedSurat.contacted)}
                    disabled={updatingContact}
                    className="text-[11px] font-semibold text-blue-700 hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    {selectedSurat.contacted ? 'Tandai belum dihubungi' : 'Tandai sudah dihubungi (telepon manual)'}
                  </button>
                </div>

                <button
                  onClick={() => handleContactWhatsapp(selectedSurat)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi Pengaju via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSurat(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Tutup Peninjauan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
