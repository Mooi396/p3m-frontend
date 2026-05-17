import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Menggunakan instance api dari utils
import api from "../utils/api";
import {
  Card,
  Input,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ComplexNavbar } from "./pengunjung/navbar";

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

  // --- STATE KHUSUS DROPDOWN INSTANSI ---
  const [allKampus, setAllKampus] = useState([]); // Master data dari API
  const [filteredKampus, setFilteredKampus] = useState([]); // Data yang muncul saat diketik
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Ambil semua data kampus saat pertama kali halaman dibuka
  useEffect(() => {
    const fetchSemuaKampus = async () => {
      setIsPageLoading(true);
      try {
        // Menggunakan api.get
        const response = await api.get("/api/kampus");
        setAllKampus(response.data);
      } catch (error) {
        console.error("Gagal load data kampus:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchSemuaKampus();
  }, []);

  // 2. Filter data kampus saat user mengetik
  const handleInstansiChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, instansi: value }); 
    
    if (value.length > 1) {
      const hasilFilter = allKampus.filter((kp) =>
        kp.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); 
      
      setFilteredKampus(hasilFilter);
      setIsDropdownOpen(true);
    } else {
      setFilteredKampus([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSelectKampus = (namaKampus) => {
    setFormData({ ...formData, instansi: namaKampus });
    setIsDropdownOpen(false);
  };

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

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    
    if (file) data.append("file", file);

    try {
      // Menggunakan api.post untuk register
      const response = await api.post("/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.msg);
      navigate("/masuk");
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan saat pendaftaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <ComplexNavbar />
      <div className="py-12 px-4">
        <Card color="transparent" shadow={true} className="p-8 w-full max-w-[48rem] mx-auto bg-white border border-gray-100">
          <div className="mb-8">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              Daftar Akun Baru
            </Typography>
            <Typography color="gray" className="mt-1 font-normal opacity-70">
              Lengkapi detail di bawah ini untuk mendaftar sebagai anggota.
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* KOLOM KIRI: AKUN */}
              <div className="flex flex-col gap-5">
                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2 border-b border-gray-50 pb-2">
                   Informasi Akun
                </Typography>
                <Input size="lg" label="Username" name="username" value={formData.username} onChange={handleChange} required />
                <Input size="lg" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                
                <div className="relative">
                  <Input 
                    size="lg" label="Password" name="password" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password} onChange={handleChange} required
                  />
                  <IconButton
                    variant="text" size="sm" className="!absolute right-1 top-1 rounded"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </IconButton>
                </div>

                <Input
                  size="lg" label="Konfirmasi Password" name="confPassword" 
                  type={showPassword ? "text" : "password"}
                  value={formData.confPassword} onChange={handleChange} required
                />

                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2 border-b border-gray-50 pb-2 mt-4">
                  Tautan Akademik (Opsional)
                </Typography>
                <Input size="lg" label="URL LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                <Input size="lg" label="URL Google Scholar" name="google_scholar" value={formData.google_scholar} onChange={handleChange} />
                <Input size="lg" label="URL Scopus" name="scopus" value={formData.scopus} onChange={handleChange} />
                <Input size="lg" label="URL Sinta" name="sinta" value={formData.sinta} onChange={handleChange} />
              </div>

              {/* KOLOM KANAN: PROFIL */}
              <div className="flex flex-col gap-5">
                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2 border-b border-gray-50 pb-2">
                  Profil Anggota
                </Typography>
                <Input size="lg" label="Nama Lengkap" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required />
                <Input size="lg" label="Gelar Akademik" name="gelar" value={formData.gelar} onChange={handleChange} required placeholder="Misal: S.Kom., M.T." />
                <Input size="lg" label="Jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} required />
                <Input size="lg" label="Masa Jabat" name="masa_jabat" value={formData.masa_jabat} onChange={handleChange} required placeholder="Misal: 2024-2026" />
                
                {/* INPUT INSTANSI DENGAN SEARCH DROPDOWN */}
                <div className="relative">
                  <Input 
                    size="lg" 
                    label="Instansi / Kampus" 
                    autoComplete="off"
                    name="instansi" 
                    value={formData.instansi}
                    onChange={handleInstansiChange}
                    onFocus={() => formData.instansi.length > 1 && setIsDropdownOpen(true)}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    required
                  />
                  
                  {isDropdownOpen && (
                    <Card className="absolute z-[999] w-full mt-1 max-h-52 overflow-y-auto border border-blue-gray-100 shadow-xl bg-white">
                      <List className="p-0">
                        {isPageLoading ? (
                          <ListItem disabled className="text-xs">Memuat data kampus...</ListItem>
                        ) : filteredKampus.length > 0 ? (
                          filteredKampus.map((item, index) => (
                            <ListItem 
                              key={index} 
                              className="text-xs py-2 px-3 hover:bg-gray-50"
                              onClick={() => handleSelectKampus(item.name)}
                            >
                              {item.name}
                            </ListItem>
                          ))
                        ) : (
                          <ListItem disabled className="text-xs text-gray-600 italic">
                            Nama tidak ditemukan? Silakan ketik manual...
                          </ListItem>
                        )}
                      </List>
                    </Card>
                  )}
                </div>
                
                <div className="mt-4">
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Foto Profil
                  </Typography>
                  <label className="block">
                    <span className="sr-only">Pilih foto profil</span>
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      accept=".jpg,.jpeg,.png" 
                      required 
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-gray-50 file:text-blue-gray-700
                        hover:file:bg-blue-gray-100
                        cursor-pointer
                        border border-gray-200 rounded-lg p-1"
                    />
                  </label>
                  <Typography variant="small" color="gray" className="mt-2 italic text-[11px]">
                    * Gunakan foto formal (Format: JPG, PNG. Maks: 5MB)
                  </Typography>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="mt-12 h-12 flex justify-center items-center text-sm tracking-wider shadow-none hover:shadow-lg" 
              fullWidth
              loading={isSubmitting}
            >
              {isSubmitting ? "Mendaftarkan..." : "Daftar Sekarang"}
            </Button>

            <Typography color="gray" className="mt-4 text-center font-normal">
              Sudah memiliki akun?{" "}
              <Link to={"/masuk"} className="font-medium text-gray-900">
                Masuk
              </Link>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
}