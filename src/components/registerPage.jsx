import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confPassword: "",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.confPassword) {
    return alert("Password dan Konfirmasi Password tidak cocok!");
  }

  const data = new FormData();
  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });
  
  if (file) data.append("file", file);

  try {
    const response = await axios.post("http://localhost:5000/register", data);
    alert(response.data.msg);
    navigate("/masuk");
  } catch (error) {
    alert(error.response?.data?.msg || "Terjadi kesalahan");
  }
};

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Card color="transparent" shadow={true} className="p-8 w-full max-w-[48rem] mx-auto bg-white">
        <Typography variant="h4" color="blue-gray">
          Daftar Akun Baru
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Lengkapi detail di bawah ini untuk mendaftar sebagai anggota.
        </Typography>

        <form onSubmit={handleSubmit} className="mt-8 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* KOLOM KIRI: AKUN & SOSMED */}
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-2">
                Informasi Akun
              </Typography>
              <Input 
                size="lg" 
                label="Username" 
                name="username" 
                value={formData.username}
                onChange={handleChange} 
                required 
              />
              <Input 
                size="lg" 
                label="Email" 
                name="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange} 
                required 
              />
              
              <div className="relative">
                <Input 
                  size="lg" 
                  label="Password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <IconButton
                  variant="text"
                  size="sm"
                  className="!absolute right-1 top-1 rounded"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </IconButton>              
              </div>

              <div className="relative">
                <Input
                  size="lg" 
                  label="Konfirmasi Password" 
                  name="confPassword" 
                  type={showPassword ? "text" : "password"}
                  value={formData.confPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Typography variant="h6" color="blue-gray" className="-mb-2 mt-2">
                Media Sosial & Research ID
              </Typography>
              <Input size="lg" label="URL LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              <Input size="lg" label="URL Google Scholar" name="google_scholar" value={formData.google_scholar} onChange={handleChange} />
              <Input size="lg" label="URL Scopus" name="scopus" value={formData.scopus} onChange={handleChange} />
              <Input size="lg" label="URL Sinta" name="sinta" value={formData.sinta} onChange={handleChange} />
            </div>

            {/* KOLOM KANAN: PROFIL & FOTO */}
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-2">
                Profil Anggota
              </Typography>
              <Input size="lg" label="Nama Lengkap" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required />
              <Input size="lg" label="Gelar (Contoh: S.Kom, M.T)" name="gelar" value={formData.gelar} onChange={handleChange} required />
              <Input size="lg" label="Jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} required />
              <Input size="lg" label="Masa Jabat" name="masa_jabat" value={formData.masa_jabat} onChange={handleChange} required />
              <Input size="lg" label="Instansi" name="instansi" value={formData.instansi} onChange={handleChange} required />
              
              <Typography variant="h6" color="blue-gray" className="-mb-2 mt-2">
                Foto Profil
              </Typography>
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".jpg,.jpeg,.png" 
                required 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-gray-50 file:text-blue-gray-700 hover:file:bg-blue-gray-100"
              />
              <Typography variant="small" color="gray" className="italic text-[10px]">
                * Format: JPG, JPEG, atau PNG
              </Typography>
            </div>
          </div>

          <Button type="submit" className="mt-8" fullWidth>
            Daftar Sekarang
          </Button>

          <Typography color="gray" className="mt-4 text-center font-normal">
            Sudah punya akun?{" "}
            <Link to={"/masuk"} className="font-medium text-gray-900 underline">
              Masuk
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}