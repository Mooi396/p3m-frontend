import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Typography,
  Avatar,
  IconButton,
  Drawer,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { 
  CameraIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  IdentificationIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/solid";

// Import Komponen Navigasi
import SidebarAdmin from "./admin/sidebarAdmin";
import SidebarAnggota from "./anggota/sidebarAnggota";
import SidebarHumas from "./admin-humas/sidebarHumas";
import DashboardNavbar from "./dashboardNavbar";

export default function EditProfil() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false); // State untuk modal preview besar

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nama_lengkap: "",
    gelar: "",
    jabatan: "",
    masa_jabat: "",
    instansi: "",
    linkedin: "",
    google_scholar: "",
    scopus: "",
    sinta: "",
  });
  const [file, setFile] = useState(null);

  const handleOpenPreview = () => setOpenPreview(!openPreview);

  const getUserData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${user.uuid}`, {
        withCredentials: true,
      });
      const data = response.data;
      const detail = data.anggotas?.[0] || {};
      
      setFormData({
        username: data.username || "",
        email: data.email || "",
        password: "",
        nama_lengkap: detail.nama_lengkap || "",
        gelar: detail.gelar || "",
        jabatan: detail.jabatan || "",
        masa_jabat: detail.masa_jabat || "",
        instansi: detail.instansi || "",
        linkedin: detail.linkedin || "",
        google_scholar: detail.google_scholar || "",
        scopus: detail.scopus || "",
        sinta: detail.sinta || "",
      });
      setPreview(detail.url || "");
    } catch (error) {
      console.error("Gagal mengambil data profil", error);
    }
  }, [user?.uuid]);

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user, getUserData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    if (file) {
      data.append("file", file);
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/users/${user.uuid}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert(response.data.msg);
      navigate("/dashboard/profil");
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  const renderSidebar = () => {
    if (user?.role === "admin") return <SidebarAdmin />;
    if (user?.role === "anggota") return <SidebarAnggota />;
    if (user?.role === "humas") return <SidebarHumas />;
    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <div className="hidden lg:block">
        {renderSidebar()}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {renderSidebar()}
      </Drawer>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center bg-white lg:bg-transparent shrink-0">
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

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Card className="w-full mx-auto p-4 md:p-8 shadow-md border border-gray-200 bg-white rounded-xl mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <Typography variant="h4" color="blue-gray" className="mb-1 text-2xl font-bold">
                  Pengaturan Profil
                </Typography>
                <Typography color="gray" className="font-normal text-sm opacity-70">
                  Perbarui informasi akun dan detail profesional Anda.
                </Typography>
              </div>
              <Button 
                variant="text"
                color="gray"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 normal-case"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftIcon className="h-4 w-4" /> Kembali
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-10">
                <div className="relative group">
                  {preview ? (
                    <Avatar 
                      src={preview} 
                      alt="avatar" 
                      size="xxl" 
                      className="border-4 border-white shadow-xl p-0.5 object-cover h-32 w-32 cursor-pointer hover:opacity-90 transition-opacity" 
                      onClick={handleOpenPreview} // Klik untuk preview besar
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                      <UserCircleIcon className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                  
                  <label 
                    htmlFor="upload-photo" 
                    className="absolute bottom-1 right-1 cursor-pointer"
                  >
                    <div className="p-2 bg-black rounded-full shadow-lg border-2 border-white hover:bg-gray-800 transition-colors">
                      <CameraIcon className="h-4 w-4 text-white" />
                    </div>
                  </label>
                  <input 
                    id="upload-photo" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                  />
                </div>
                <div className="text-center">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    Foto Profil
                  </Typography>
                  <Typography variant="small" color="gray" className="italic text-[11px]">
                    Format: JPG, PNG (Maks. 5MB)
                  </Typography>
                </div>
              </div>

              {/* Account Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
                <div className="space-y-5">
                  <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-black rounded-full"></div>
                    Akun & Keamanan
                  </Typography>
                  <Input label="Username" name="username" color="black" value={formData.username} onChange={handleChange} icon={<IdentificationIcon/>} />
                  <Input label="Email" name="email" color="black" value={formData.email} onChange={handleChange} icon={<EnvelopeIcon/>} />
                  <Input label="Password Baru" name="password" color="black" type="password" value={formData.password} onChange={handleChange} icon={<LockClosedIcon/>} placeholder="Kosongkan jika tidak ganti" />
                </div>

                <div className="space-y-5">
                  <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-black rounded-full"></div>
                    Detail Profesional
                  </Typography>
                  <Input label="Nama Lengkap & Gelar" name="nama_lengkap" color="black" value={formData.nama_lengkap} onChange={handleChange} icon={<UserCircleIcon/>} />
                  <Input label="Gelar Singkat (Mis: S.Kom, M.T.)" name="gelar" color="black" value={formData.gelar} onChange={handleChange} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Jabatan" name="jabatan" color="black" value={formData.jabatan} onChange={handleChange} icon={<BriefcaseIcon/>} />
                    <Input label="Masa Jabat" name="masa_jabat" color="black" value={formData.masa_jabat} onChange={handleChange} placeholder="Mis: 2023-2025" />
                  </div>
                  <Input label="Instansi" name="instansi" color="black" value={formData.instansi} onChange={handleChange} icon={<BuildingOfficeIcon/>} />
                </div>
              </div>

              {/* Social/Links Section */}
              <div className="space-y-5 border-t border-gray-100 pt-8 text-black">
                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-black rounded-full"></div>
                  Tautan Akademik & Media Sosial
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="LinkedIn URL" name="linkedin" color="black" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                  <Input label="Google Scholar URL" name="google_scholar" color="black" value={formData.google_scholar} onChange={handleChange} />
                  <Input label="Scopus ID URL" name="scopus" color="black" value={formData.scopus} onChange={handleChange} />
                  <Input label="Sinta ID URL" name="sinta" color="black" value={formData.sinta} onChange={handleChange} />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                <Button 
                  variant="text" 
                  color="red" 
                  onClick={() => navigate(0)} 
                  className="order-2 sm:order-1 normal-case"
                >
                  Reset Form
                </Button>
                <Button 
                  type="submit" 
                  loading={loading}
                  className="order-1 sm:order-2 flex justify-center items-center px-10 shadow-none hover:shadow-md normal-case"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* DIALOG PREVIEW FOTO PROFIL */}
      <Dialog 
        size="xs" 
        open={openPreview} 
        handler={handleOpenPreview} 
        className="bg-transparent shadow-none flex justify-center items-center overflow-visible"
      >
        <DialogBody className="p-0 flex justify-center items-center overflow-visible">
          <div className="relative group flex justify-center items-center">
            <img
              alt="Foto Profil Preview"
              className="h-[80vw] w-[80vw] md:h-96 md:w-96 aspect-square rounded-full object-cover object-center shadow-2xl border-[6px] border-white/30 backdrop-blur-sm"
              src={preview}
            />
            <IconButton
              color="white"
              size="md"
              variant="text"
              onClick={handleOpenPreview}
              className="!absolute -top-2 -right-2 md:top-2 md:right-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-md shadow-xl transition-all duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </IconButton>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}