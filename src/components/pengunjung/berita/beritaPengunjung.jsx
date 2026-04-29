import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Spinner, Chip, Typography, IconButton } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function DaftarBeritaP3M() {
  const [beritas, setBeritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/beritas", { withCredentials: true });
      const verified = response.data.filter(b => b.status === "verified");
      verified.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setBeritas(verified);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBerita = beritas.filter(b => {
    const matchesSearch = b.judul_berita.toLowerCase().includes(search.toLowerCase());
    const matchesKategori = filterKategori ? b.kategoris?.some(k => k.uuid === filterKategori) : true;
    const matchesTag = filterTag ? b.tags?.some(t => t.uuid === filterTag) : true;
    return matchesSearch && matchesKategori && matchesTag;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBerita.slice(indexOfFirstPost, indexOfLastPost);

  const featured = currentPage === 1 && !search && !filterKategori && !filterTag ? currentPosts[0] : null;
  const listBerita = featured ? currentPosts.slice(1) : currentPosts;
  const totalPages = Math.ceil(filteredBerita.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- LOGIKA ELLIPSIS PAGINATION ---
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const kategoriCounts = beritas.reduce((acc, berita) => {
    berita.kategoris?.forEach((kat) => {
      if (!acc[kat.uuid]) acc[kat.uuid] = { nama: kat.nama_kategori, count: 0, uuid: kat.uuid };
      acc[kat.uuid].count += 1;
    });
    return acc;
  }, {});

  const masterKategoris = Object.values(kategoriCounts);
  const masterTags = Array.from(
    new Set(beritas.flatMap((b) => b.tags?.map((t) => JSON.stringify(t)) || []))
  ).map((t) => JSON.parse(t));

  const formatDate = (dateString) => {
    if (!dateString) return "Sedang memuat...";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Tanggal tidak valid" : date.toLocaleDateString("id-ID");
  };

  if (loading) return <div className="h-screen flex justify-center items-center"><Spinner className="h-12 w-12" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Berita P3M</h1>
        <p className="text-gray-600 mb-6">Dapatkan semua berita terbaru seputar forum di sini!</p>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full max-w-2xl">
            <Input
              label="Cari Berita"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setFilterKategori(null);
                setFilterTag(null);
                setCurrentPage(1);
              }}
            />
          </div>
          {(filterKategori || filterTag || search) && (
            <Button size="sm" variant="text" color="red" onClick={() => {
              setSearch("");
              setFilterKategori(null);
              setFilterTag(null);
              setCurrentPage(1);
            }}>
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 min-w-0">
          {currentPosts.length > 0 ? (
            <>
              {/* Featured News */}
              {featured && (
                <div className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-[30px] p-6 md:p-10 shadow-none border border-gray-50 mb-10 overflow-hidden">
                  <div className="w-full md:w-2/5 shrink-0">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-[15px]">
                      <img 
                        src={featured.url} 
                        className="w-full h-full object-cover shadow-sm" 
                        alt={featured.judul_berita} 
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-3/5 flex flex-col min-w-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {featured.kategoris?.map((kat) => (
                        <Chip variant="outlined" value={kat.nama_kategori} key={kat.uuid} className="text-[10px]" />
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4 break-words">
                      {featured.judul_berita}
                    </h1>
                    <div 
                      className="text-gray-600 text-sm md:text-base leading-relaxed text-justify mb-6 line-clamp-3 break-words" 
                      dangerouslySetInnerHTML={{ __html: featured.isi_berita }} 
                    />
                    <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-full flex shrink-0 items-center justify-center text-white text-[10px]">
                          {featured.user?.username?.charAt(0)}
                        </div>
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {featured.user?.username} <span className="text-gray-400 mx-1">•</span> {formatDate(featured?.updatedAt)}
                        </p>
                      </div>
                      <Link to={`/berita/${featured.uuid}`} className="text-blue-900 font-bold text-sm flex items-center gap-2 shrink-0">
                        Baca Selengkapnya <ArrowRightIcon />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              {/* List News */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listBerita.map((item) => (
                  <div key={item.uuid} className="flex flex-col bg-white rounded-[30px] p-5 shadow-none border border-gray-50 overflow-hidden">
                    <div className="relative w-full aspect-video overflow-hidden rounded-[15px] mb-4">
                      <img 
                        src={item.url} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        alt={item.judul_berita} 
                      />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
                        {item.kategoris?.map((kat) => (
                          <Chip key={kat.uuid} value={kat.nama_kategori} className="text-[9px] py-0.5 px-2 bg-white/90 text-black backdrop-blur-sm" />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow min-w-0">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                            {formatDate(item?.updatedAt)}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 break-words">
                        {item.judul_berita}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags?.map((tag) => (
                          <span key={tag.uuid} className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded-full border border-gray-200 truncate max-w-[100px]">
                            #{tag.nama_tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 bg-black rounded-full flex shrink-0 items-center justify-center text-white text-[8px]">
                            {item.user?.username?.charAt(0)}
                          </div>
                          <p className="text-xs font-bold text-gray-800 truncate">{item.user?.username}</p>
                        </div>
                        <Link to={`/berita/${item.uuid}`} className="text-blue-900 font-bold text-[13px] flex items-center gap-1 shrink-0">
                          Baca Selengkapnya<ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Typography className="text-center py-20 text-gray-500">Tidak ada berita yang sesuai pencarian.</Typography>
          )}

          {/* --- PAGINATION SECTION --- */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-16 gap-2 sm:gap-4">
              <Button
                variant="outlined"
                size="sm"
                className="flex items-center gap-2 rounded-full capitalize border-gray-300"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon strokeWidth={3} className="h-4 w-4" /> 
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  page === "..." ? (
                    <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <IconButton
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "filled" : "text"}
                      color={currentPage === page ? null : "blue-gray"}
                      onClick={() => paginate(page)}
                      className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                    >
                      {page}
                    </IconButton>
                  )
                ))}
              </div>

              <Button
                variant="outlined"
                size="sm"
                className="flex items-center gap-2 rounded-full capitalize border-gray-300"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRightIcon strokeWidth={3} className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-8">
          <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-900">Semua Kategori</h4>
            <div className="flex flex-col gap-3">
              {masterKategoris.map((kat) => (
                <button 
                  key={kat.uuid} 
                  onClick={() => { setFilterKategori(kat.uuid); setFilterTag(null); setCurrentPage(1); }}
                  className={`flex justify-between items-center text-sm transition-colors w-full text-left group ${filterKategori === kat.uuid ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"}`}
                >
                  <span className="group-hover:underline truncate">{kat.nama}</span>
                  <span className="text-gray-400 font-mono text-xs shrink-0">({kat.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-900">Berita Terbaru</h4>
            <div className="flex flex-col gap-5">
              {beritas.slice(0, 4).map((b) => (
                <Link key={b.uuid} to={`/berita/${b.uuid}`} className="flex gap-3 items-center group cursor-pointer min-w-0">
                  <div className="w-16 h-16 shrink-0 overflow-hidden rounded-lg">
                    <img src={b.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">{formatDate(b?.updatedAt)}</p>
                    <p className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-blue-600 break-words">{b.judul_berita}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-900">Semua Tag</h4>
            <div className="flex flex-wrap gap-2">
              {masterTags.map((tag) => (
                <Chip
                  key={tag.uuid}
                  value={tag.nama_tag}
                  variant={filterTag === tag.uuid ? "filled" : "white"}
                  onClick={() => { setFilterTag(tag.uuid); setFilterKategori(null); setCurrentPage(1); }}
                  className={`lowercase shadow-sm border border-gray-200 cursor-pointer transition-colors max-w-full truncate ${filterTag === tag.uuid ? "bg-blue-900 text-white" : "text-gray-600 hover:bg-blue-50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}