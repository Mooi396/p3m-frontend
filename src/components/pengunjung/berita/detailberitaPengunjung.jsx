import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Card,
  Typography,
  Chip,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import { 
  CalendarIcon, 
} from "@heroicons/react/24/solid";
import Head from "../../head";

export default function DetailBeritaPengunjung() {
  const { uuid } = useParams();
  const [berita, setBerita] = useState(null);
  const [allBeritas, setAllBeritas] = useState([]); // Untuk sidebar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil detail berita & semua berita untuk sidebar secara paralel
        const [resDetail, resAll] = await Promise.all([
          axios.get(`http://localhost:5000/beritas/${uuid}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/beritas`, { withCredentials: true })
        ]);
        
        setBerita(resDetail.data);
        setAllBeritas(resAll.data.filter(b => b.status === "verified"));
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uuid]);

  // --- LOGIKA SIDEBAR ---
  const kategoriCounts = allBeritas.reduce((acc, b) => {
    b.kategoris?.forEach((kat) => {
      if (!acc[kat.uuid]) acc[kat.uuid] = { nama: kat.nama_kategori, count: 0, uuid: kat.uuid };
      acc[kat.uuid].count += 1;
    });
    return acc;
  }, {});
  const masterKategoris = Object.values(kategoriCounts);

  const masterTags = Array.from(
    new Set(allBeritas.flatMap((b) => b.tags?.map((t) => JSON.stringify(t)) || []))
  ).map((t) => JSON.parse(t));

  const beritaTerbaru = allBeritas.slice(0, 4);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  if (!berita) return <Typography className="text-center py-20">Berita tidak ditemukan</Typography>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head title={berita?.judul_berita} />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- MAIN CONTENT (LEFT) --- */}
          <div className="flex-1 min-w-0">
            <Card className="p-6 md:p-10 bg-white shadow-sm border border-gray-100 rounded-2xl">
              {/* Category Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(berita.kategoris || berita.Kategoris)?.map((cat) => (
                  <Chip key={cat.uuid} value={cat.nama_kategori} size="sm" color="blue" variant="ghost" className="rounded-full" />
                ))}
              </div>
              
              <Typography variant="h1" color="blue-gray" className="mb-6 text-3xl md:text-4xl font-extrabold leading-tight">
                {berita.judul_berita}
              </Typography>

              {/* Author & Date Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-y border-gray-100 py-6 mb-8">
                <div className="flex items-center gap-3">
                  <Avatar 
                    size="sm" 
                    src={`https://ui-avatars.com/api/?name=${(berita.user || berita.User)?.username}&background=random&color=fff`} 
                  />
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                      {(berita.user || berita.User)?.username}
                    </Typography>
                    <Typography className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">Penulis</Typography>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                      {new Date(berita.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </Typography>
                    <Typography className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">Terbit</Typography>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
                <img src={berita.url} alt={berita.judul_berita} className="w-full h-auto object-cover" />
              </div>

              {/* Content */}
              <div className="prose prose-blue max-w-none">
                <div 
                  className="rich-text-content text-blue-gray-800 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: berita.isi_berita }}
                />
              </div>

              {/* Tags Under Content */}
              {(berita.tags || berita.Tags)?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    {(berita.tags || berita.Tags).map((tag) => (
                      <span key={tag.uuid} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold">
                        #{tag.nama_tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* --- SIDEBAR (RIGHT) --- */}
          <div className="w-full lg:w-80 flex flex-col gap-8">
            
            {/* Kategori Sidebar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-4 text-gray-900 border-b pb-2">Semua Kategori</h4>
              <div className="flex flex-col gap-3">
                {masterKategoris.map((kat) => (
                  <Link 
                    key={kat.uuid} 
                    to={`/berita?kategori=${kat.uuid}`}
                    className="flex justify-between items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span>{kat.nama}</span>
                    <span className="bg-gray-50 px-2 py-0.5 rounded text-[10px] font-bold">({kat.count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Berita Terbaru Sidebar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-4 text-gray-900 border-b pb-2">Berita Terbaru</h4>
              <div className="flex flex-col gap-5">
                {beritaTerbaru.map((b) => (
                  <Link key={b.uuid} to={`/berita/${b.uuid}`} className="flex gap-3 items-center group">
                    <img src={b.url} className="w-14 h-14 shrink-0 object-cover rounded-lg" alt="" />
                    <div>
                      <p className="text-[10px] text-gray-400">{new Date(b.createdAt).toLocaleDateString("id-ID")}</p>
                      <p className="text-xs font-bold line-clamp-2 leading-tight group-hover:text-blue-600">{b.judul_berita}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags Sidebar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-4 text-gray-900 border-b pb-2">Semua Tag</h4>
              <div className="flex flex-wrap gap-2">
                {masterTags.map((tag) => (
                  <Link 
                    key={tag.uuid} 
                    to={`/berita?tag=${tag.uuid}`}
                    className="bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-1 rounded-md text-[11px] font-medium border border-gray-100 transition-colors"
                  >
                    #{tag.nama_tag}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .rich-text-content p { margin-bottom: 1.5rem; }
        .rich-text-content h2 { font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; }
        .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}