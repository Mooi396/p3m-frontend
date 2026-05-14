import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Menggunakan instance api yang sudah dikonfigurasi dengan JWT Interceptor
import api from "../../../utils/api"; 
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Card,
  Typography,
  Spinner,
  IconButton,
  Drawer,
  Button,
  Input,
  Chip,
  Tooltip
} from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
  PencilIcon,
  CheckIcon,
  ArrowLeftIcon,
  PlusIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import { XMarkIcon as XMarkSolid } from "@heroicons/react/24/solid";
import Head from "../../head";
import SidebarAdmin from "../../admin/sidebarAdmin";
import SidebarHumas from "../sidebarHumas";
import DashboardNavbar from "../../dashboardNavbar";

export default function ProfilOrganisasiComponent() {
  const navigate = useNavigate();
  const { user: authuser } = useSelector((state) => state.auth);

  // State UI
  const [profilOrganisasi, setProfilOrganisasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Ambil token dari local storage sekali untuk digunakan di komponen
  const token = localStorage.getItem("token");

  // State Form
  const [formData, setFormData] = useState({
    nama_organisasi: "",
    deskripsi_organisasi: "",
    file: null,
  });

  // Fetch Data menggunakan api instance
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resAll = await api.get("/profil-organisasi");
      if (resAll.data && resAll.data.length > 0) {
        const data = resAll.data[0];
        setProfilOrganisasi(data);
        setFormData({
          nama_organisasi: data.nama_organisasi,
          deskripsi_organisasi: data.deskripsi_organisasi,
          file: null,
        });
      } else {
        setProfilOrganisasi(null);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/masuk");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler Aksi Admin
  const verifyProfil = async (uuid) => {
    try {
      await api.patch(`/profil-organisasi/${uuid}/verify`);
      alert("Profil berhasil disetujui!");
      fetchData();
    } catch (error) { alert("Gagal memverifikasi"); }
  };

  const rejectProfil = async (uuid) => {
    try {
      await api.patch(`/profil-organisasi/${uuid}/reject`);
      alert("Profil ditolak");
      fetchData();
    } catch (error) { alert("Gagal menolak"); }
  };

  const cancelVerify = async (uuid) => {
    if (window.confirm("Batalkan verifikasi? Status akan kembali ke Pending.")) {
      try {
        await api.patch(`/profil-organisasi/${uuid}/cancel-verify`);
        fetchData();
      } catch (error) { alert("Gagal membatalkan verifikasi"); }
    }
  };

  const cancelReject = async (uuid) => {
    if (window.confirm("Batalkan penolakan? Status akan kembali ke Pending.")) {
      try {
        await api.patch(`/profil-organisasi/${uuid}/cancel-reject`);
        fetchData();
      } catch (error) { alert("Gagal membatalkan penolakan"); }
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append("nama_organisasi", formData.nama_organisasi);
      dataToSend.append("deskripsi_organisasi", formData.deskripsi_organisasi);
      if (formData.file) dataToSend.append("file", formData.file);

      if (profilOrganisasi) {
        // Update
        await api.patch(`/profil-organisasi/${profilOrganisasi.uuid}`, dataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // Create Baru
        await api.post("/profil-organisasi", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      
      alert("Berhasil menyimpan profil organisasi!");
      setIsEdit(false);
      setPreviewUrl(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Terjadi kesalahan saat menyimpan");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
      // File lokal, tidak butuh token
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="h-12 w-12" color="blue" />
          <Typography color="gray" className="font-medium">Memuat Profil...</Typography>
        </div>
      </div>
    );
  }

    const SecureImage = ({ src, alt, className, onClick }) => {
    const [imageBlob, setImageBlob] = useState(null);
  
    useEffect(() => {
      const fetchImage = async () => {
        try {
          // Mengambil image sebagai blob lewat axios instance (yang sudah punya interceptor token)
          const response = await api.get(src, { responseType: 'blob' });
          const url = URL.createObjectURL(response.data);
          setImageBlob(url);
        } catch (error) {
          console.error("Gagal memuat gambar secara aman", error);
          setImageBlob("https://via.placeholder.com/150"); // fallback
        }
      };
  
      if (src) fetchImage();
      
      // Cleanup URL saat komponen unmount
      return () => {
        if (imageBlob) URL.revokeObjectURL(imageBlob);
      };
    }, [src]);
  
    return (
      <img 
        src={imageBlob || ""} 
        alt={alt} 
        className={className} 
        onClick={onClick}
        onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
      />
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block shrink-0">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      {/* Sidebar Mobile (Drawer) */}
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
        {/* Navbar */}
        <div className="flex items-center bg-white lg:bg-transparent border-b lg:border-none shrink-0">
          <IconButton variant="text" color="blue-gray" className="lg:hidden ml-2" onClick={() => setIsDrawerOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1 min-w-0">
            <DashboardNavbar />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Head title={profilOrganisasi?.nama_organisasi || "Profil Organisasi"} />
          
          <Card className="w-full shadow-md border border-gray-200 rounded-xl p-4 lg:p-10 bg-white">
            {/* TOOLBAR AKSI */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center flex-wrap gap-3">
                <Typography variant="h4" color="blue-gray" className="text-xl lg:text-2xl font-bold">
                  Manajemen Profil
                </Typography>
                {profilOrganisasi && !isEdit && (
                  <Chip 
                    variant="ghost" 
                    size="sm" 
                    value={profilOrganisasi.status.toUpperCase()} 
                    color={profilOrganisasi.status === "verified" ? "green" : profilOrganisasi.status === "pending" ? "amber" : "red"} 
                  />
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Aksi Khusus Admin */}
                {!isEdit && profilOrganisasi && authuser?.role === "admin" && (
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                    {profilOrganisasi.status === "verified" && (
                      <Tooltip content="Batalkan Verifikasi">
                        <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerify(profilOrganisasi.uuid)}>
                          <ArrowPathIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profilOrganisasi.status === "rejected" && (
                      <Tooltip content="Batalkan Penolakan">
                        <IconButton variant="text" color="amber" size="sm" onClick={() => cancelReject(profilOrganisasi.uuid)}>
                          <ArrowPathIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {profilOrganisasi.status === "pending" && (
                      <>
                        <Tooltip content="Setujui Profil">
                          <IconButton variant="text" color="green" size="sm" onClick={() => verifyProfil(profilOrganisasi.uuid)}>
                            <CheckIcon className="h-5 w-5 font-bold" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Tolak Profil">
                          <IconButton variant="text" color="red" size="sm" onClick={() => rejectProfil(profilOrganisasi.uuid)}>
                            <XMarkSolid className="h-5 w-5 font-bold" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </div>
                )}
                
                {/* Tombol Edit/Batal */}
                {(!profilOrganisasi || ((profilOrganisasi.status !== "verified" && profilOrganisasi.status !== "rejected"))) && (
                <Button 
                  size="sm" 
                  variant={isEdit ? "outlined" : "filled"} 
                  color={isEdit ? "red" : null}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                  onClick={() => {
                    setIsEdit(!isEdit);
                    if (isEdit) setPreviewUrl(null);
                  }}
                >
                  {isEdit ? <><ArrowLeftIcon className="h-4 w-4" /> Batal</> : 
                  profilOrganisasi ? <><PencilIcon className="h-4 w-4" /> Edit Konten</> : 
                  <><PlusIcon className="h-4 w-4" /> Buat Profil</>}
                </Button>
              )}
              </div>
            </div>

            {/* --- VIEW MODE --- */}
            {!isEdit && profilOrganisasi ? (
              <div className="max-w-4xl mx-auto w-full animate-fade-in">
                <Typography variant="h2" color="blue-gray" className="mb-6 text-center text-2xl lg:text-4xl font-extrabold leading-tight">
                  {profilOrganisasi.nama_organisasi}
                </Typography>
                <div className="flex justify-center mb-10">
                  <div className="w-full lg:w-4/5 overflow-hidden rounded-2xl shadow-xl border border-gray-100">
                    <SecureImage 
                      src={profilOrganisasi.url} 
                      alt={profilOrganisasi.nama_organisasi} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                </div>
                
                {/* Content Display */}
                <div className="rich-text-container">
                  <div 
                    className="rich-text-content text-blue-gray-800 leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: profilOrganisasi.deskripsi_organisasi }} 
                  />
                </div>
              </div>
            ) : !isEdit && !profilOrganisasi ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Typography color="gray" className="mb-4 font-medium italic">Data profil organisasi belum tersedia di database.</Typography>
                <Button variant="gradient" color="blue" onClick={() => setIsEdit(true)}>
                  Mulai Buat Sekarang
                </Button>
              </div>
            ) : (
              /* --- EDIT MODE (FORM) --- */
              <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">Nama/Judul Organisasi</Typography>
                  <Input 
                    size="lg"
                    placeholder="Contoh: Dinas Komunikasi dan Informatika..."
                    value={formData.nama_organisasi} 
                    onChange={(e) => setFormData({...formData, nama_organisasi: e.target.value})}
                    required 
                  />
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">Gambar Banner/Profil</Typography>
                  <div className="flex flex-col gap-4 p-4 border rounded-xl bg-gray-50/50">
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      accept=".jpg,.jpeg,.png" 
                      className="block w-full text-xs lg:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-50 file:text-gray-700 file:font-semibold" 
                    />
                    {(previewUrl || profilOrganisasi?.url) && (
                      <div className="relative group">
                        <img 
                          // Jika ada preview dari file lokal gunakan previewUrl, jika dari database gunakan url dengan token
                          src={previewUrl || `${profilOrganisasi?.url}?token=${token}`} 
                          className="rounded-xl max-h-60 lg:max-h-80 w-full object-cover shadow-md border" 
                          alt="Preview" 
                        />
                        <div className="absolute top-2 left-2">
                           <Chip 
                            value={previewUrl ? "Preview Baru" : "Gambar Saat Ini"} 
                            color={previewUrl ? "green" : null} 
                            size="sm"
                           />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Typography variant="h6" color="blue-gray">Deskripsi Lengkap</Typography>
                  <div className="h-[450px] lg:h-[500px] mb-16 lg:mb-12">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.deskripsi_organisasi} 
                      onChange={(val) => setFormData({...formData, deskripsi_organisasi: val})} 
                      modules={quillModules}
                      className="h-full rounded-lg" 
                      placeholder="Tuliskan sejarah, visi misi, atau profil organisasi di sini..."
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" color="green" className="flex items-center justify-center gap-2 shadow-green-200">
                  <CheckIcon className="h-5 w-5" /> Simpan Permanen
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>

      {/* Global CSS for Rich Text Content */}
      <style>{`
        .rich-text-content {
          font-size: 1.1rem;
          line-height: 1.8;
          word-wrap: break-word;
        }
        .rich-text-content p {
          margin-bottom: 1.25rem;
        }
        .rich-text-content ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .rich-text-content ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .rich-text-content h1, .rich-text-content h2, .rich-text-content h3 {
          font-weight: 700;
          color: #263238;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}