import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
// Import instance api yang sudah dikonfigurasi dengan JWT Interceptor
import api from "../../../utils/api"; 
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Card,
  Input,
  Button,
  Typography,
  Select,
  Option,
  Chip,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

// Import Komponen Navigasi
import SidebarAdmin from "../../admin/sidebarAdmin";
import SidebarHumas from "../sidebarHumas";
import DashboardNavbar from "../../dashboardNavbar";

export default function EditBerita() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { user: authuser } = useSelector((state) => state.auth);
  
  // State UI
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // State Form
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);

  // Fetch Data menggunakan api instance
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Ambil data pendukung (kategori & tag) dan detail berita secara paralel
      const [resKat, resTag, resBerita] = await Promise.all([
        api.get("/kategori"),
        api.get("/tag"),
        api.get(`/beritas/${uuid}`)
      ]);

      setCategories(resKat.data);
      setTags(resTag.data);

      const data = resBerita.data;

      // Validasi: Berita verified tidak boleh diedit oleh Humas (Hanya Admin)
      if (data.status === "verified" && authuser?.role !== "admin") {
        alert("Berita yang sudah diverifikasi tidak dapat diedit kembali.");
        navigate("/dashboard/berita");
        return;
      }

      setJudul(data.judul_berita);
      setIsi(data.isi_berita);

      // Tambahkan Token ke URL agar preview gambar bisa diakses jika belum terverifikasi
      const token = localStorage.getItem("token");
      setPreview(`${data.url}?token=${token}`); 
      
      // Ambil UUID saja untuk state lokal
      setSelectedKategori(data.kategoris.map(k => k.uuid));
      setSelectedTag(data.tags.map(t => t.uuid));
      
    } catch (error) {
      console.error("Gagal memuat data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/masuk");
      } else {
        alert("Berita tidak ditemukan atau Anda tidak memiliki akses.");
        navigate("/dashboard/berita");
      }
    } finally {
      setLoading(false);
    }
  }, [uuid, navigate, authuser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler untuk Kategori
  const handleAddKategori = (val) => {
    if (val && !selectedKategori.includes(val)) {
      setSelectedKategori([...selectedKategori, val]);
    }
  };

  const removeKategori = (id) => {
    setSelectedKategori(selectedKategori.filter(item => item !== id));
  };

  // Handler untuk Tag
  const handleAddTag = (val) => {
    if (val && !selectedTag.includes(val)) {
      setSelectedTag([...selectedTag, val]);
    }
  };

  const removeTag = (id) => {
    setSelectedTag(selectedTag.filter(item => item !== id));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Untuk file dari PC lokal, tidak perlu ditambahkan token
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("judul_berita", judul);
    data.append("isi_berita", isi);
    if (file) data.append("file", file);
    
    // Kirim UUID kategori dan tag
    selectedKategori.forEach(id => data.append("kategori_uuid", id));
    selectedTag.forEach(id => data.append("tag_uuid", id));

    try {
      const response = await api.patch(`/beritas/${uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.msg || "Berita berhasil diperbarui");
      navigate("/dashboard/berita");
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/masuk");
      } else {
        alert(error.response?.data?.msg || "Gagal memperbarui berita");
      }
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <Typography className="font-medium text-gray-600">Memuat Data...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block shrink-0">
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
        <div className="flex items-center bg-white lg:bg-transparent border-b lg:border-none">
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden mx-2"
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
          <Card color="white" shadow={true} className="p-6 lg:p-8 w-full mx-auto border border-gray-200 mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <Typography variant="h4" color="blue-gray">Edit Berita</Typography>
                <Typography color="gray" className="mt-1 font-normal text-sm italic">
                  Perbarui informasi artikel yang sudah Anda buat
                </Typography>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Judul */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">Judul Berita</Typography>
                <Input 
                  size="lg" 
                  placeholder="Masukkan judul berita..."
                  value={judul} 
                  onChange={(e) => setJudul(e.target.value)} 
                  required 
                />
              </div>

              {/* Kategori & Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">Kategori</Typography>
                  <Select label="Pilih Kategori" onChange={(val) => handleAddKategori(val)}>
                    {categories.map((cat) => (
                      <Option key={cat.uuid} value={cat.uuid}>{cat.nama_kategori}</Option>
                    ))}
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedKategori.map((id) => {
                      const cat = categories.find(c => c.uuid === id);
                      return (
                        <Chip 
                          key={id} 
                          value={cat?.nama_kategori || "Loading..."} 
                          variant="ghost" 
                          color="blue" 
                          size="sm" 
                          onClose={() => removeKategori(id)}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">Tag</Typography>
                  <Select label="Pilih Tag" onChange={(val) => handleAddTag(val)}>
                    {tags.map((t) => (
                      <Option key={t.uuid} value={t.uuid}>{t.nama_tag}</Option>
                    ))}
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedTag.map((id) => {
                      const tag = tags.find(t => t.uuid === id);
                      return (
                        <Chip 
                          key={id} 
                          value={tag?.nama_tag || "Loading..."} 
                          variant="ghost" 
                          color="teal" 
                          size="sm" 
                          onClose={() => removeTag(id)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Upload Gambar */}
              <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl bg-gray-50/50">
                <Typography variant="h6" color="blue-gray" className="mb-2">Gambar Utama Berita</Typography>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".jpg,.jpeg,.png" 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-gray-50 file:text-blue-gray-700 hover:file:bg-blue-gray-100" 
                />
                <Typography variant="small" color="gray" className="mt-2 italic text-[11px]">
                  *Biarkan kosong jika tidak ingin mengganti gambar yang sudah ada.
                </Typography>
                {preview && (
                  <div className="mt-4 relative group w-full max-w-lg mx-auto">
                    <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg border shadow-sm" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                       <Typography color="white" className="font-bold">Preview Gambar Baru/Aktif</Typography>
                    </div>
                  </div>
                )}
              </div>

              {/* React Quill */}
              <div className="mb-14">
                <Typography variant="h6" color="blue-gray" className="mb-2">Isi Konten Berita</Typography>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <ReactQuill 
                    theme="snow" 
                    value={isi} 
                    onChange={setIsi} 
                    modules={modules}
                    className="h-80 mb-12" 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Button 
                  variant="outlined" 
                  color="red" 
                  fullWidth 
                  onClick={() => navigate("/dashboard/berita")}
                  className="order-2 sm:order-1"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  color="blue"
                  fullWidth 
                  className="order-1 sm:order-2"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}