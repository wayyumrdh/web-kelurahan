import React, { useState, useEffect } from 'react';
import { Newspaper, Search, Calendar, ArrowRight, X, FileText } from 'lucide-react';

export default function News() {
  const [newsData, setNewsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNewsModal, setActiveNewsModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news');
      if (response.ok) {
        const data = await response.json();
        setNewsData(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data berita:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = newsData.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.summary.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pb-16">
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="bg-blue-800 text-blue-200 text-xs uppercase px-3 py-1 rounded-full font-semibold border border-blue-700">
            Kabar & Informasi
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 mb-2">
            Berita & Pengumuman Kelurahan
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-2xl mx-auto">
            Informasi terkini mengenai kegiatan kemasyarakatan, pembangunan, serta pengumuman resmi dari Kelurahan Mallawa.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Cari berita atau pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-blue-900">{filteredNews.length}</strong> Artikel Berita
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Memuat artikel berita...</div>
        ) : filteredNews.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">Berita Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <article 
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group"
              >
                <div className="w-full sm:w-48 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-800 flex flex-col items-center justify-center text-white p-3 text-center">
                      <FileText className="w-6 h-6 text-amber-300 mb-1" />
                      <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">
                        Pengumuman
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.date}</span>
                  </div>

                  <h2 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => setActiveNewsModal(item)}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-blue-50 text-blue-900 hover:text-blue-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Baca</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {activeNewsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveNewsModal(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {activeNewsModal.image ? (
              <div className="relative h-64 bg-slate-200">
                <img 
                  src={activeNewsModal.image} 
                  alt={activeNewsModal.title}
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 text-xs text-amber-300 font-semibold mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Pengumuman Resmi</span>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center text-slate-500 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {activeNewsModal.date}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
                {activeNewsModal.title}
              </h2>

              <div className="border-t border-slate-100 pt-4 text-slate-700 text-sm leading-relaxed space-y-3">
                <p>{activeNewsModal.content}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">Portal Berita Kelurahan Mallawa</span>
                <button 
                  onClick={() => setActiveNewsModal(null)}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}