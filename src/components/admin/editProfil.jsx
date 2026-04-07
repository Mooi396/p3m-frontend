import React, { useState, useEffect } from "react";
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
} from "@material-tailwind/react";
import { 
  CameraIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  IdentificationIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon 
} from "@heroicons/react/24/solid";

export default function EditProfil() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

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

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  const getUserData = async () => {
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
  };

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-4xl mx-auto p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h4" color="blue-gray" className="mb-1">
              Pengaturan Profil
            </Typography>
            <Typography color="gray" className="font-normal text-sm">
              Perbarui informasi akun dan detail profesional Anda.
            </Typography>
          </div>
          <Button 
            variant="text"
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="h-4 w-4" /> Kembali
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-8">
            <div className="relative">
              {preview ? (
                <Avatar src={preview} alt="avatar" size="xxl" className="border-2 border-blue-500 p-1 object-cover" />
              ) : (
                <UserCircleIcon className="h-24 w-24 text-gray-300" />
              )}
              
              {/* PERBAIKAN: Gunakan htmlFor agar label menembus IconButton */}
              <label htmlFor="upload-photo" className="absolute bottom-0 right-0 cursor-pointer">
                <IconButton 
                  size="sm" 
                  color="blue" 
                  className="rounded-full pointer-events-none" 
                  variant="gradient"
                >
                  <CameraIcon className="h-4 w-4" />
                </IconButton>
              </label>
              <input 
                id="upload-photo" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*" 
              />
            </div>
            <Typography variant="small" color="gray" className="italic">
              Klik ikon kamera untuk mengganti foto (Maks. 5MB)
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="-mb-2">Akun & Keamanan</Typography>
              <Input label="Username" name="username" value={formData.username} onChange={handleChange} icon={<IdentificationIcon/>} />
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} icon={<EnvelopeIcon/>} />
              <Input label="Password Baru" name="password" type="password" value={formData.password} onChange={handleChange} icon={<LockClosedIcon/>} placeholder="Kosongkan jika tidak ganti" />
            </div>

            <div className="space-y-4">
              <Typography variant="h6" color="blue-gray" className="-mb-2">Detail Profesional</Typography>
              <Input label="Nama Lengkap & Gelar" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} icon={<UserCircleIcon/>} />
              <Input label="Gelar Singkat" name="gelar" value={formData.gelar} onChange={handleChange} placeholder="Contoh: S.Kom, M.T." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} icon={<BriefcaseIcon/>} />
                <Input label="Masa Jabat" name="masa_jabat" value={formData.masa_jabat} onChange={handleChange} placeholder="2023-2025" />
              </div>
              <Input label="Instansi" name="instansi" value={formData.instansi} onChange={handleChange} icon={<BuildingOfficeIcon/>} />
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <Typography variant="h6" color="blue-gray">Tautan Akademik & Media Sosial</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="LinkedIn URL" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              <Input label="Google Scholar URL" name="google_scholar" value={formData.google_scholar} onChange={handleChange} />
              <Input label="Scopus ID URL" name="scopus" value={formData.scopus} onChange={handleChange} />
              <Input label="Sinta ID URL" name="sinta" value={formData.sinta} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="text" color="red" onClick={() => navigate(0)}>Reset</Button>
            <Button type="submit" loading={loading}>Simpan Perubahan</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}