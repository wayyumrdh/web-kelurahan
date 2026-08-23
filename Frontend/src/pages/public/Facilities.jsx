import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ExternalLink 
} from 'lucide-react';

const categories = ['Semua', 'Instansi & Pelayanan', 'Tempat Ibadah', 'Pendidikan', 'Kuliner', 'Fasilitas Kesehatan', 'Usaha & Pertokoan'];

export default function Facilities() {
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Fetch data dari database MySQL Express
  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch('https://web-kelurahan-production.up.railway.app/api/facilities');
      if (response.ok) {
        const data = await response.json();
        setFacilitiesData(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data fasilitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = facilitiesData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pb-16">
      
      {/* BANNER HEADER */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="bg-blue-800 text-blue-200 text-xs uppercase px-3 py-1 rounded-full font-semibold border border-blue-700">
            Direktori Wilayah
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 mb-2">
            Fasilitas Umum & Lokasi Penting
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
            Daftar lengkap instansi pemerintah, sarana pendidikan, tempat ibadah, fasilitas kesehatan, dan pusat kuliner di Kelurahan Mallawa.
          </p>
        </div>
      </section>

      {/* CONTAINER KONTEN UTAMA */}
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">

        {/* SEARCH BAR & FILTER KATEGORI */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Cari nama lokasi atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Menampilkan <strong className="text-blue-900">{filteredFacilities.length}</strong> dari total {facilitiesData.length} Lokasi
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID CARD FASILITAS */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold text-sm">
            Memuat fasilitas wilayah...
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">Lokasi Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lain atau ubah kategori filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-slate-200 overflow-hidden">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-blue-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition leading-snug">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{item.address}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-100 hover:bg-blue-50 text-blue-900 hover:text-blue-700 text-xs font-semibold py-2.5 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Petunjuk Arah (Google Maps)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
