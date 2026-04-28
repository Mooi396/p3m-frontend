import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Card,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import { 
  CalendarIcon, 
  ArrowLeftIcon, 
  Bars3Icon, 
  XMarkIcon 
} from "@heroicons/react/24/solid";
import Head from "../../head";
import DashboardNavbar from "../../dashboardNavbar";
import SidebarAdmin from "../../admin/sidebarAdmin";
import SidebarHumas from "../sidebarHumas";

export default function DetailBerita() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { user: authuser } = useSelector((state) => state.auth);
  
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const getBeritaById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/beritas/${uuid}`, {
          withCredentials: true,
        });
        setBerita(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail berita:", error);
      } finally {
        setLoading(false);
      }
    };
    getBeritaById();
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <Typography color="gray" className="font-medium">Memuat Konten...</Typography>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">Berita tidak ditemukan</Typography>
        <Button size="sm" variant="text" onClick={() => navigate(-1)} className="flex items-center gap-2">
           <ArrowLeftIcon className="h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block shrink-0">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      {/* Drawer Mobile */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="flex items-center bg-white lg:bg-transparent border-b lg:border-none shrink-0 ">
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1 min-w-0">
            <DashboardNavbar />
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8">
          <Head title={berita?.judul_berita} />
          
          <div className="w-full mx-auto pb-12">
            <Card className="p-5 md:p-10 bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
              
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {(berita.Kategoris || berita.kategoris)?.map((cat) => (
                    <Chip key={cat.uuid} value={cat.nama_kategori} size="sm" color="blue" variant="ghost" className="rounded-md" />
                  ))}
                  <Chip 
                    value={berita.status} 
                    size="sm" 
                    color={berita.status === 'verified' ? 'green' : berita.status === 'pending' ? 'amber' : 'red'} 
                    className="rounded-md uppercase"
                  />
                </div>
                
                <Typography color="blue-gray" className="mb-6 text-2xl md:text-4xl font-extrabold leading-tight break-words">
                  {berita.judul_berita}
                </Typography>

                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-gray-600 border-y border-gray-100 py-5 mt-8">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      size="sm" 
                      src={`https://ui-avatars.com/api/?name=${(berita.user || berita.User)?.username}&background=random&color=fff`} 
                      className="border border-blue-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <Typography variant="small" color="blue-gray" className="font-bold truncate">
                        {(berita.user || berita.User)?.username || "Penulis"}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-gray-400 shrink-0" />
                    <Typography variant="small" className="font-medium text-blue-gray-700">
                      {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Gambar Utama: DIPAKSA LANDSCAPE */}
              <div className="mb-10 w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-xl shadow-inner bg-gray-100">
                {berita.url ? (
                  <img 
                    src={berita.url} 
                    alt={berita.judul_berita} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/1200x600?text=Gambar+Tidak+Tersedia"; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                    Gambar tidak tersedia
                  </div>
                )}
              </div>

              {/* Isi Berita: ANTI-MELUAP */}
              <div className="rich-text-container w-full min-w-0 overflow-hidden">
                {berita.isi_berita ? (
                  <div 
                    className="rich-text-content text-blue-gray-800 break-words"
                    dangerouslySetInnerHTML={{ __html: berita.isi_berita }}
                  />
                ) : (
                  <Typography color="red" className="italic">Konten kosong.</Typography>
                )}
              </div>

              {/* Tags */}
              {(berita.Tags || berita.tags)?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <Typography variant="small" className="font-bold text-blue-gray-400 mb-3 tracking-widest">TAGS</Typography>
                  <div className="flex flex-wrap gap-2">
                    {(berita.Tags || berita.tags).map((tag) => (
                      <span key={tag.uuid} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold">
                        #{tag.nama_tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        /* Mengamankan elemen di dalam konten rich text agar tidak meluap */
        .rich-text-content {
          font-size: 1.125rem;
          line-height: 1.8;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .rich-text-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        .rich-text-content iframe {
          width: 100% !important;
          aspect-ratio: 16 / 9;
          height: auto !important;
          border-radius: 8px;
        }
        .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
          font-weight: 800;
          color: #263238;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .rich-text-content p {
          margin-bottom: 1.25rem;
        }
        .rich-text-content table {
          display: block;
          width: 100%;
          overflow-x: auto; /* Jika ada tabel, dia bisa di scroll horizontal di dalam artikel */
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}