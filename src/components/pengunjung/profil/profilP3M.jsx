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

export default function ProfilOrganisasiComponent() {
  const [profilOrganisasi, setProfilOrganisasi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAll = await (
          axios.get(`http://localhost:5000/profil-organisasi`, { withCredentials: true })
        );
        
        setProfilOrganisasi(resAll.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  if (!profilOrganisasi) return <Typography className="text-center py-20">Profil organisasi tidak ditemukan</Typography>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head title={profilOrganisasi?.nama_organisasi} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- MAIN CONTENT (LEFT) --- */}
          <div className="flex-1 min-w-0">
            <Card className="p-6 md:p-10 bg-white shadow-sm border border-gray-100 rounded-2xl">
              <Typography variant="h1" color="blue-gray" className="mb-6 text-3xl md:text-4xl font-extrabold leading-tight">
                {profilOrganisasi.nama_organisasi}
              </Typography>

              {/* Author & Date Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-y border-gray-100 py-6 mb-8">
                <div className="flex items-center gap-3">
                  <Avatar 
                    size="sm" 
                    src={`https://ui-avatars.com/api/?name=${(profilOrganisasi.user || profilOrganisasi.User)?.username}&background=random&color=fff`} 
                  />
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                      {(profilOrganisasi.user || profilOrganisasi.User)?.username}
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
                      {new Date(profilOrganisasi.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </Typography>
                    <Typography className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">Terbit</Typography>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
                <img src={profilOrganisasi.url} alt={profilOrganisasi.nama_organisasi} className="w-full h-auto object-cover" />
              </div>

              {/* Content */}
              <div className="prose prose-blue max-w-none">
                <div 
                  className="rich-text-content text-blue-gray-800 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: profilOrganisasi.isi_profil }}
                />
              </div>

              {/* Tags Under Content */}
              {(profilOrganisasi.tags || profilOrganisasi.Tags)?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex gap-2 flex-wrap">
                    {(profilOrganisasi.tags || profilOrganisasi.Tags).map((tag) => (
                      <span key={tag.uuid} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold">
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
        .rich-text-content p { margin-bottom: 1.5rem; }
        .rich-text-content h2 { font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; }
        .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}