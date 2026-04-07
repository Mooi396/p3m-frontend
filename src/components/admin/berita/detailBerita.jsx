import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Typography,
  Button,
  Breadcrumbs,
  Chip,
  Avatar,
} from "@material-tailwind/react";
import { CalendarIcon, UserIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Head from "../../head";
import DashboardNavbar from "../../dashboardNavbar";

export default function DetailBerita() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="text-center py-20">
        <Typography variant="h5">Berita tidak ditemukan</Typography>
        <Button onClick={() => navigate(-1)} variant="text" className="mt-4">Kembali</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={berita?.judul_berita} />
      <DashboardNavbar />
      <div className="max-w-[56rem] mx-auto">
        <div className="mb-6 mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Breadcrumbs className="bg-transparent p-0">
            <Link to="/dashboard" className="opacity-60">Dashboard</Link>
            <Link to="/dashboard/berita" className="opacity-60">Berita</Link>
            <span className="cursor-default">Detail</span>
          </Breadcrumbs>
          <Button 
            variant="text" 
            size="sm" 
            className="flex items-center gap-2 w-max"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="h-4 w-4" /> Kembali
          </Button>
        </div>

        <Card className="p-8 bg-white shadow-sm border border-gray-100">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              {/* Perhatikan: di controller nama modelnya 'Kategoris' atau 'kategoris' */}
              {(berita.Kategoris || berita.kategoris)?.map((cat) => (
                <Chip key={cat.uuid} value={cat.nama_kategori} size="sm" color="blue" variant="ghost" />
              ))}
              <Chip value={berita.status} size="sm" color={berita.status === 'verified' ? 'green' : 'amber'} variant="ghost" />
            </div>
            
            <Typography variant="h2" color="blue-gray" className="mb-4 leading-tight">
              {berita.judul_berita}
            </Typography>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 border-y border-gray-100 py-4 mt-6">
              <div className="flex items-center gap-2">
                <Avatar 
                  size="xs" 
                  variant="circular" 
                  src={`https://ui-avatars.com/api/?name=${(berita.user || berita.User)?.username}&background=random`} 
                />
                <Typography variant="small" className="font-bold">
                  {(berita.user || berita.User)?.username || "Admin"}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <Typography variant="small">
                  {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </div>
            </div>
          </div>

          {/* Gambar Utama */}
          <div className="mb-8 overflow-hidden rounded-xl shadow-md bg-gray-200">
            {berita.url ? (
               <img 
               src={berita.url} 
               alt={berita.judul_berita} 
               className="w-full h-auto object-cover max-h-[500px]"
               onError={(e) => { e.target.src = "https://via.placeholder.com/800x400?text=Gambar+Tidak+Ditemukan"; }}
             />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 italic">Tidak ada gambar</div>
            )}
          </div>

          {/* Isi Berita */}
          <div className="prose prose-blue max-w-none min-h-[100px]">
            {berita.isi_berita ? (
                <div 
                className="text-gray-800 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: berita.isi_berita }}
              />
            ) : (
                <Typography color="red" className="italic">Isi berita kosong atau gagal dimuat.</Typography>
            )}
          </div>

          {/* Tag Berita */}
          {(berita.Tags || berita.tags)?.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-100 flex items-center gap-3 flex-wrap">
              <Typography variant="small" className="font-bold text-gray-500">TAGS:</Typography>
              {(berita.Tags || berita.tags).map((tag) => (
                <span key={tag.uuid} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  #{tag.nama_tag}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}