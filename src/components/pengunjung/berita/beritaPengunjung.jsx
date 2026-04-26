import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Spinner, Chip, Typography, IconButton } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

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
      setBeritas(verified);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA FILTERING ---
  const filteredBerita = beritas.filter(b => {
    const matchesSearch = b.judul_berita.toLowerCase().includes(search.toLowerCase());
    const matchesKategori = filterKategori ? b.kategoris?.some(k => k.uuid === filterKategori) : true;
    const matchesTag = filterTag ? b.tags?.some(t => t.uuid === filterTag) : true;
    return matchesSearch && matchesKategori && matchesTag;
  });

  // --- LOGIKA PAGINATION ---
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBerita.slice(indexOfFirstPost, indexOfLastPost);

  // Perbaikan Logika Featured & List
  const featured = currentPage === 1 && !search && !filterKategori && !filterTag ? currentPosts[0] : null;
  const listBerita = featured ? currentPosts.slice(1) : currentPosts;

  const totalPages = Math.ceil(filteredBerita.length / postsPerPage);

  // --- DATA SIDEBAR ---
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

  if (loading) return <div className="h-screen flex justify-center items-center"><Spinner className="h-12 w-12" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
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
        <div className="flex-1">
          {/* Perbaikan Kondisi Tampilan: Cek apakah ada data di currentPosts atau featured */}
          {currentPosts.length > 0 ? (
            <>
              {featured && (
                <div className="flex flex-col md:flex-row gap-8 items-stretch bg-white rounded-[30px] px-10 py-10 mx-auto shadow-none border border-gray-50 mb-10">
                  <div className="w-full md:w-2/5">
                    <img src={featured.url} className="rounded-[15px] w-full aspect-[4/3] object-cover shadow-sm" alt={featured.judul_berita} />
                  </div>
                  <div className="w-full md:w-3/5 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex gap-2 mb-3">
                        {featured.kategoris?.map((kat) => (
                          <Chip variant="outlined" value={kat.nama_kategori} key={kat.uuid} className="text-[10px]">
                          </Chip>
                        ))}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">{featured.judul_berita}</h1>
                      <div className="text-gray-600 text-base leading-relaxed text-justify mb-4 line-clamp-3 [&>p]:inline" dangerouslySetInnerHTML={{ __html: featured.isi_berita }} />
                      <div className="flex flex-col justify-between mt-auto pt-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-[9px]">{featured.user?.username?.charAt(0)}</div>
                        <p className="text-xs font-bold text-gray-800">{featured.user?.username} <span className="text-gray-400 mx-1">•</span> {new Date(featured.createdAt).toLocaleDateString("id-ID")}</p>
                      </div>
                      <Link to={`/berita/${featured.uuid}`} className="text-blue-500 font-bold text-sm flex items-center gap-2">
                        Baca Selengkapnya{" "}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                        </svg>
                      </Link>
                    </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listBerita.map((item) => (
                  <div key={item.uuid} className="flex flex-col gap-4 bg-white rounded-[30px] p-4 shadow-none border border-gray-50">
                    <div className="relative">
                      <img src={item.url} className="rounded-[15px] w-full aspect-video object-cover mb-2" alt={item.judul_berita} />
                      {/* Pembungkus absolute di luar map agar posisi tetap di pojok kiri atas */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {item.kategoris?.map((kat) => (
                        <Chip 
                        key={kat.uuid} 
                        value={kat.nama_kategori} 
                        className="text-[10px] py-1 px-2 rounded-md shadow-sm"
                        />
                    ))}
                    </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
                      <h3 className="text-xl font-bold text-gray-900 leading-snug line-clamp-2">{item.judul_berita}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags?.map((tag) => (
                          <span key={tag.uuid} className="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded-full font-medium border border-gray-200">#{tag.nama_tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between mt-auto pt-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-[9px]">{item.user?.username?.charAt(0)}</div>
                        <p className="text-xs font-bold text-gray-800">{item.user?.username}</p>
                      </div>
                      <Link to={`/berita/${item.uuid}`} className="text-blue-500 font-bold text-sm flex items-center gap-2">
                        Baca Selengkapnya{" "}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Typography className="text-center py-20 text-gray-500">Tidak ada berita yang sesuai pencarian.</Typography>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-4">
              <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo(0, 0); // Opsional: scroll ke atas tiap pindah page
                }}
                disabled={currentPage === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Sebelumnya
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <IconButton
                    key={index + 1}
                    variant={currentPage === index + 1 ? "filled" : "text"}
                    color="gray"
                    onClick={() => {
                      setCurrentPage(index + 1);
                      window.scrollTo(0, 0);
                    }}
                    className="rounded-full"
                  >
                    {index + 1}
                  </IconButton>
                ))}
              </div>

              <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo(0, 0);
                }}
                disabled={currentPage === totalPages}
              >
                Selanjutnya <ArrowRightIcon />
              </Button>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-8">
          <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-900">Semua Kategori</h4>
            <div className="flex flex-col gap-3">
              {masterKategoris.map((kat) => (
                <button 
                  key={kat.uuid} 
                  onClick={() => { 
                    setFilterKategori(kat.uuid); 
                    setFilterTag(null); 
                    setCurrentPage(1); // RESET KE HALAMAN 1
                  }}
                  className={`flex justify-between items-center text-sm transition-colors w-full text-left group ${filterKategori === kat.uuid ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600"}`}
                >
                  <span className="group-hover:underline">{kat.nama}</span>
                  <span className="text-gray-400 font-mono text-xs">({kat.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[20px] border border-gray-100">
            <h4 className="font-bold mb-4 text-gray-900">Berita Terbaru</h4>
            <div className="flex flex-col gap-5">
              {beritas.slice(0, 4).map((b) => (
                <Link key={b.uuid} to={`/berita/${b.uuid}`} className="flex gap-3 items-center group cursor-pointer">
                  <div className="w-16 h-16 shrink-0 overflow-hidden rounded-lg">
                    <img src={b.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{new Date(b.createdAt).toLocaleDateString("id-ID")}</p>
                    <p className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-blue-600">{b.judul_berita}</p>
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
                  onClick={() => { 
                    setFilterTag(tag.uuid); 
                    setFilterKategori(null); 
                    setCurrentPage(1); // RESET KE HALAMAN 1
                  }}
                  className={`lowercase shadow-sm border border-gray-200 cursor-pointer transition-colors ${filterTag === tag.uuid ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-blue-50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}