import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetMe } from "../../features/authSlice";
import Head from "../../components/head";
import EditBerita from "../../components/admin-humas/berita/editBerita";
import api from "../../utils/api"; 
import { Typography } from "@material-tailwind/react";

const EditberitaPage = () => {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isError } = useSelector((state) => state.auth);
  const [pageLoading, setPageLoading] = useState(true);
  // State baru untuk mengunci agar pengecekan tidak berulang (looping)
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);

  useEffect(() => {
    // 1. Cek autentikasi dasar
    if (isError) {
      navigate('/masuk');
      return;
    }
    if (user && user.role !== 'admin' && user.role !== 'humas') {
      navigate(-1);
      return;
    }

    // 2. Cek status berita spesifik dari API (Hanya jalan jika user ada dan BELUM pernah dicek)
    const checkNewsStatus = async () => {
      if (!user || hasChecked) return; 
      
      try {
        setHasChecked(true); // Langsung kunci status agar tidak memicu re-fetch ganda
        const response = await api.get(`/beritas/${uuid}`);
        const berita = response.data;

        if (berita && berita.status === "verified") {
          alert("Akses Ditolak: Berita yang sudah diverifikasi tidak dapat diedit kembali.");
          navigate('/dashboard/berita', { replace: true }); // Menggunakan replace agar history tidak menumpuk
          return;
        }
        
        setPageLoading(false);
      } catch (error) {
        console.error("Gagal memeriksa status berita:", error);
        alert("Berita tidak ditemukan atau Anda tidak memiliki akses.");
        navigate('/dashboard/berita', { replace: true });
      }
    };

    checkNewsStatus();
  }, [isError, user, navigate, uuid, hasChecked]); // Tambahkan hasChecked ke dependency

  if (pageLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <Typography className="font-medium text-gray-600">Memvalidasi Akses Halaman...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head title="Edit Berita" />
      <EditBerita />
    </div>
  );
};

export default EditberitaPage;