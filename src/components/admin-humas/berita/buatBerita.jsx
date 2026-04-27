import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
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
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

// Import Komponen Navigasi
import SidebarAdmin from "../../admin/sidebarAdmin";
import SidebarHumas from "../sidebarHumas";
import DashboardNavbar from "../../dashboardNavbar";

export default function CreateBerita() {
  const navigate = useNavigate();
  const { user: authuser } = useSelector((state) => state.auth);
  
  // State UI
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // State Form
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resKategori = await axios.get("http://localhost:5000/kategori");
        const resTag = await axios.get("http://localhost:5000/tag");
        setCategories(resKategori.data);
        setTags(resTag.data);
      } catch (error) {
        console.error("Gagal mengambil data pendukung:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddKategori = (uuid) => {
    if (uuid && !selectedKategori.includes(uuid)) {
      setSelectedKategori([...selectedKategori, uuid]);
    }
  };

  const handleAddTag = (uuid) => {
    if (uuid && !selectedTag.includes(uuid)) {
      setSelectedTag([...selectedTag, uuid]);
    }
  };

  const removeKategori = (uuid) => setSelectedKategori(selectedKategori.filter(id => id !== uuid));
  const removeTag = (uuid) => setSelectedTag(selectedTag.filter(id => id !== uuid));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Silahkan pilih gambar utama");

    const data = new FormData();
    data.append("judul_berita", judul);
    data.append("isi_berita", isi);
    data.append("file", file);
    
    selectedKategori.forEach(id => data.append("kategori_uuid", id));
    selectedTag.forEach(id => data.append("tag_uuid", id));

    try {
      const response = await axios.post("http://localhost:5000/beritas", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(response.data.msg);
      navigate("/dashboard/berita");
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
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
            className="lg:hidden mr-2"
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
                <Typography variant="h4" color="blue-gray">Buat Berita Baru</Typography>
                <Typography color="gray" className="mt-1 font-normal text-sm italic">
                  Publikasikan informasi terbaru ke portal P3M
                </Typography>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Judul */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">Judul Berita</Typography>
                <Input 
                  size="lg" 
                  placeholder="Contoh: Pelaksanaan Workshop Penulisan Jurnal..." 
                  value={judul} 
                  onChange={(e) => setJudul(e.target.value)} 
                  required 
                />
              </div>

              {/* Kategori & Tag */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2 text-sm lg:text-base">Kategori</Typography>
                  <Select label="Pilih kategori" onChange={(val) => handleAddKategori(val)}>
                    {categories.map((cat) => (
                      <Option key={cat.uuid} value={cat.uuid}>{cat.nama_kategori}</Option>
                    ))}
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedKategori.map((id) => {
                      const catName = categories.find(c => c.uuid === id)?.nama_kategori;
                      return (
                        <Chip 
                          key={id} 
                          value={catName} 
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
                  <Typography variant="h6" color="blue-gray" className="mb-2 text-sm lg:text-base">Tag</Typography>
                  <Select label="Pilih tag" onChange={(val) => handleAddTag(val)}>
                    {tags.map((t) => (
                      <Option key={t.uuid} value={t.uuid}>{t.nama_tag}</Option>
                    ))}
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedTag.map((id) => {
                      const tagName = tags.find(t => t.uuid === id)?.nama_tag;
                      return (
                        <Chip 
                          key={id} 
                          value={tagName} 
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
              <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl">
                <Typography variant="h6" color="blue-gray" className="mb-2 text-sm lg:text-base">Gambar Utama Berita</Typography>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".jpg,.jpeg,.png" 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-gray-50 file:text-blue-gray-700 hover:file:bg-blue-gray-100" 
                />
                {preview && (
                  <div className="mt-4 relative group">
                    <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg border shadow-sm" />
                    <div className="absolute top-2 right-2">
                      <IconButton size="sm" color="red" variant="filled" onClick={() => {setPreview(""); setFile(null);}}>
                        <XMarkIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </div>

              {/* React Quill */}
              <div className="mb-14">
                <Typography variant="h6" color="blue-gray" className="mb-2">Isi Konten Berita</Typography>
                <div className="bg-white border rounded-lg">
                  <ReactQuill 
                    theme="snow" 
                    value={isi} 
                    onChange={setIsi} 
                    modules={modules} 
                    placeholder="Tuliskan isi berita secara detail di sini..." 
                    className="h-72 mb-12" 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
                  fullWidth 
                  className="order-1 sm:order-2"
                >
                  Simpan & Kirim
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}