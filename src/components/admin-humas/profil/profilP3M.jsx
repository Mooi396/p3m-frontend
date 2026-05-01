import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
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
  const [profilOrganisasi, setProfilOrganisasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: authuser } = useSelector((state) => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    nama_organisasi: "",
    deskripsi_organisasi: "",
    file: null,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const resAll = await axios.get(`http://localhost:5000/profil-organisasi`, { withCredentials: true });
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const verifyProfil = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/profil-organisasi/${uuid}/verify`, {}, { withCredentials: true });
      fetchData();
    } catch (error) { alert("Gagal memverifikasi"); }
  };

  const rejectProfil = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/profil-organisasi/${uuid}/reject`, {}, { withCredentials: true });
      fetchData();
    } catch (error) { alert("Gagal menolak"); }
  };

  const cancelVerify = async (uuid) => {
    if (window.confirm("Batalkan verifikasi? Status akan kembali ke Pending.")) {
      try {
        await axios.patch(`http://localhost:5000/profil-organisasi/${uuid}/cancel-verify`, {}, { withCredentials: true });
        fetchData();
      } catch (error) { alert("Gagal membatalkan verifikasi"); }
    }
  };

  const cancelReject = async (uuid) => {
    if (window.confirm("Batalkan penolakan? Status akan kembali ke Pending.")) {
      try {
        await axios.patch(`http://localhost:5000/profil-organisasi/${uuid}/cancel-reject`, {}, { withCredentials: true });
        fetchData();
      } catch (error) { alert("Gagal membatalkan penolakan"); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append("nama_organisasi", formData.nama_organisasi);
      dataToSend.append("deskripsi_organisasi", formData.deskripsi_organisasi);
      if (formData.file) dataToSend.append("file", formData.file);

      if (profilOrganisasi) {
        await axios.patch(`http://localhost:5000/profil-organisasi/${profilOrganisasi.uuid}`, dataToSend, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post(`http://localhost:5000/profil-organisasi`, dataToSend, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      setIsEdit(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="flex h-screen w-full items-center justify-center"><Spinner className="h-12 w-12" color="blue" /></div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
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
        {/* Navbar Mobile Toggle */}
        <div className="flex items-center bg-white lg:bg-transparent">
          <IconButton variant="text" color="blue-gray" className="lg:hidden ml-2" onClick={() => setIsDrawerOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Head title={profilOrganisasi?.nama_organisasi || "Profil Organisasi"} />
          
          <Card className="w-full shadow-md border border-gray-200 rounded-xl p-4 lg:p-6">
            {/* TOOLBAR AKSI RESPONSIVE */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center flex-wrap gap-3">
                <Typography variant="h5" color="blue-gray" className="text-lg lg:text-xl">Profil Organisasi</Typography>
                {profilOrganisasi && (
                  <Chip 
                    variant="ghost" 
                    size="sm" 
                    value={profilOrganisasi.status} 
                    color={profilOrganisasi.status === "verified" ? "green" : profilOrganisasi.status === "pending" ? "amber" : "red"} 
                  />
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!isEdit && profilOrganisasi && authuser?.role === "admin" && (
                  <div className="flex gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
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
                            <CheckIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Tolak Profil">
                          <IconButton variant="text" color="red" size="sm" onClick={() => rejectProfil(profilOrganisasi.uuid)}>
                            <XMarkSolid className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </div>
                )}
                
                {(!profilOrganisasi || (profilOrganisasi.status !== "verified" && profilOrganisasi.status !== "rejected")) && (
                  <Button 
                    size="sm" 
                    variant={isEdit ? "outlined" : "filled"} 
                    color={isEdit ? "red" : null}
                    className="flex items-center gap-2 w-full sm:w-auto justify-center"
                    onClick={() => setIsEdit(!isEdit)}
                  >
                    {isEdit ? <><ArrowLeftIcon className="h-4 w-4" /> Batal</> : 
                     profilOrganisasi ? <><PencilIcon className="h-4 w-4" /> Edit</> : 
                     <><PlusIcon className="h-4 w-4" /> Buat Baru</>}
                  </Button>
                )}
              </div>
            </div>

            {!isEdit && profilOrganisasi ? (
              <div className="max-w-4xl mx-auto w-full">
                <Typography variant="h2" color="blue-gray" className="mb-4 text-center text-2xl lg:text-4xl break-words">
                  {profilOrganisasi.nama_organisasi}
                </Typography>
                <div className="flex justify-center mb-8">
                  <img 
                    src={profilOrganisasi.url} 
                    className="rounded-xl max-h-60 lg:max-h-80 w-full object-cover shadow-lg" 
                    alt="Profil"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/800x400?text=No+Image" }}
                  />
                </div>
                {/* Teks Deskripsi dengan penanganan overflow */}
                <div 
                  className="prose max-w-none mb-10 break-words overflow-hidden text-sm lg:text-base" 
                  dangerouslySetInnerHTML={{ __html: profilOrganisasi.deskripsi_organisasi }} 
                />
              </div>
            ) : !isEdit && !profilOrganisasi ? (
              <div className="text-center py-20">
                <Typography color="gray" className="mb-4">Profil organisasi belum dibuat.</Typography>
                <Button variant="text" onClick={() => setIsEdit(true)}>Klik untuk membuat sekarang</Button>
              </div>
            ) : (
              /* --- MODE FORM RESPONSIVE --- */
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                <Input 
                  label="Judul" 
                  value={formData.nama_organisasi} 
                  onChange={(e) => setFormData({...formData, nama_organisasi: e.target.value})}
                  required 
                />
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Gambar Profil</Typography>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept=".jpg,.jpeg,.png" 
                    className="block w-full text-xs lg:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700" 
                  />
                  {(previewUrl || profilOrganisasi?.url) && (
                    <div className="relative mt-4">
                      <img 
                        src={previewUrl || profilOrganisasi?.url} 
                        className="rounded-xl max-h-60 lg:max-h-80 w-full object-cover shadow-lg" 
                        alt="Preview" 
                      />
                      <Typography variant="small" color="gray" className="mt-1 italic text-center text-xs">
                        {previewUrl ? "Preview gambar baru" : "Gambar saat ini"}
                      </Typography>
                    </div>
                  )}
                </div>
                {/* Quill Editor Container dengan padding bawah agar tidak overflow di mobile */}
                <div className="h-[400px] lg:h-96 mb-20 lg:mb-12">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.deskripsi_organisasi} 
                    onChange={(val) => setFormData({...formData, deskripsi_organisasi: val})} 
                    className="h-full" 
                  />
                </div>
                <Button type="submit" className="flex items-center justify-center gap-2 mt-4">
                  <CheckIcon className="h-4 w-4" /> Simpan Perubahan
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}