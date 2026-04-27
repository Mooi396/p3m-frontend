import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Card,
  Typography,
  Button,
  Breadcrumbs,
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <Typography variant="h4" color="blue-gray" className="mb-2 text-center">Berita tidak ditemukan</Typography>
        <Typography color="gray" className="mb-6 text-center">Mungkin berita telah dihapus atau link tidak valid.</Typography>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      {/* DRAWER MOBILE */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <div className="flex items-center bg-white lg:bg-transparent border-b lg:border-none shrink-0">
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden mr-2"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Head title={berita?.judul_berita} />
          
          <div className="w-full mx-auto pb-12">
            <Card className="p-4 md:p-10 bg-white shadow-md border border-gray-200 rounded-2xl">
              {/* Meta Berita */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {(berita.Kategoris || berita.kategoris)?.map((cat) => (
                    <Chip key={cat.uuid} value={cat.nama_kategori} size="sm" color="blue" variant="ghost" className="rounded-full" />
                  ))}
                  <Chip 
                    value={berita.status} 
                    size="sm" 
                    color={berita.status === 'verified' ? 'green' : berita.status === 'pending' ? 'amber' : 'red'} 
                    variant="filled" 
                    className="rounded-full"
                  />
                </div>
                
                <Typography variant="h1" color="blue-gray" className="mb-6 text-3xl md:text-4xl font-bold leading-tight">
                  {berita.judul_berita}
                </Typography>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-gray-600 border-y border-gray-100 py-5 mt-8">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      size="sm" 
                      variant="circular" 
                      src={`https://ui-avatars.com/api/?name=${(berita.user || berita.User)?.username}&background=random&color=fff`} 
                      className="border border-blue-gray-100"
                    />
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none mb-1">
                        {(berita.user || berita.User)?.username || "Penulis"}
                      </Typography>
                      <Typography variant="small" className="text-[11px] font-normal opacity-70">Author</Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <CalendarIcon className="h-4 w-4 text-blue-gray-500" />
                    </div>
                    <div className="flex flex-col">
                      <Typography variant="small" className="font-medium text-blue-gray-900 leading-none mb-1">
                        {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>
                      <Typography variant="small" className="text-[11px] font-normal opacity-70">Tanggal Terbit</Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gambar Utama */}
              <div className="mb-10 overflow-hidden rounded-2xl shadow-lg border border-gray-100">
                {berita.url ? (
                  <img 
                    src={berita.url} 
                    alt={berita.judul_berita} 
                    className="w-full h-auto object-cover max-h-[600px] hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/1200x600?text=Gambar+Tidak+Tersedia"; }}
                  />
                ) : (
                  <div className="h-64 bg-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <CalendarIcon className="h-10 w-10 opacity-20" />
                    <Typography className="italic">Tidak ada gambar utama</Typography>
                  </div>
                )}
              </div>

              {/* Isi Berita */}
              <div className="prose prose-blue max-w-none mb-12">
                {berita.isi_berita ? (
                  <div 
                    className="rich-text-content text-blue-gray-800 leading-relaxed text-lg lg:text-xl"
                    dangerouslySetInnerHTML={{ __html: berita.isi_berita }}
                  />
                ) : (
                  <Typography color="red" className="italic bg-red-50 p-4 rounded-lg border border-red-100">
                    Konten berita ini kosong.
                  </Typography>
                )}
              </div>

              {/* Tag Berita */}
              {(berita.Tags || berita.tags)?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100 flex items-start gap-4 flex-wrap">
                  <div className="mt-1">
                    <Typography variant="small" className="font-bold text-blue-gray-400 tracking-wider">TAGS:</Typography>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(berita.Tags || berita.tags).map((tag) => (
                      <span key={tag.uuid} className="bg-blue-gray-50 hover:bg-blue-50 text-blue-gray-700 hover:text-blue-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-default">
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

      {/* Style CSS untuk Rich Text Content */}
      <style>{`
        .rich-text-content h1 { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: #263238; }
        .rich-text-content h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.8rem; color: #263238; }
        .rich-text-content p { margin-bottom: 1.5rem; line-height: 1.8; }
        .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .rich-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .rich-text-content blockquote { border-left: 4px solid #2196f3; padding-left: 1rem; font-style: italic; color: #546e7a; margin: 2rem 0; }
      `}</style>
    </div>
  );
}