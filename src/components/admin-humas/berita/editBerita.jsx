import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@material-tailwind/react";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import DashboardNavbar from "../../dashboardNavbar";

export default function EditBerita() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resKat, resTag] = await Promise.all([
          axios.get("http://localhost:5000/kategori"),
          axios.get("http://localhost:5000/tag")
        ]);
        setCategories(resKat.data);
        setTags(resTag.data);

        const resBerita = await axios.get(`http://localhost:5000/beritas/${uuid}`, {
          withCredentials: true,
        });
        
        if (resBerita.data.status === "verified") {
        alert("Berita yang sudah diverifikasi tidak dapat diedit kembali.");
        navigate("/dashboard/berita");
        return;
      }

        const data = resBerita.data;
        setJudul(data.judul_berita);
        setIsi(data.isi_berita);
        setPreview(data.url); 
        setSelectedKategori(data.kategoris.map(k => k.uuid));
        setSelectedTag(data.tags.map(t => t.uuid));
        
      } catch (error) {
        console.error("Gagal memuat data:", error);
        alert("Berita tidak ditemukan atau Anda tidak memiliki akses.");
        navigate("/dashboard/berita");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uuid, navigate]);

  const handleAddKategori = (val) => {
    if (!selectedKategori.includes(val)) setSelectedKategori([...selectedKategori, val]);
  };

  const handleAddTag = (val) => {
    if (!selectedTag.includes(val)) setSelectedTag([...selectedTag, val]);
  };

  const removeKategori = (id) => setSelectedKategori(selectedKategori.filter(item => item !== id));
  const removeTag = (id) => setSelectedTag(selectedTag.filter(item => item !== id));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("judul_berita", judul);
    data.append("isi_berita", isi);
    if (file) data.append("file", file);
    
    // Kirim array UUID
    selectedKategori.forEach(id => data.append("kategori_uuid", id));
    selectedTag.forEach(id => data.append("tag_uuid", id));

    try {
      const response = await axios.patch(`http://localhost:5000/beritas/${uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(response.data.msg);
      navigate("/dashboard/berita");
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal memperbarui berita");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Card color="transparent" shadow={true} className="p-8 mt-6 w-full max-w-[50rem] mx-auto bg-white border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h4" color="blue-gray">Edit Berita</Typography>
            <Typography color="gray" className="font-normal text-sm">Perbarui informasi artikel Anda.</Typography>
          </div>
          <Button variant="text" size="sm" className="flex items-center gap-2" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-4 w-4" /> Kembali
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Judul */}
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">Judul Berita</Typography>
            <Input size="lg" value={judul} onChange={(e) => setJudul(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Multi Kategori */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">Kategori</Typography>
              <Select label="Tambah Kategori" onChange={(val) => handleAddKategori(val)}>
                {categories.map((cat) => (
                  <Option key={cat.uuid} value={cat.uuid}>{cat.nama_kategori}</Option>
                ))}
              </Select>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedKategori.map((id) => (
                  <Chip key={id} value={categories.find(c => c.uuid === id)?.nama_kategori} variant="ghost" color="blue" size="sm" 
                    icon={<XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeKategori(id)} />} 
                  />
                ))}
              </div>
            </div>

            {/* Multi Tag */}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">Tag</Typography>
              <Select label="Tambah Tag" onChange={(val) => handleAddTag(val)}>
                {tags.map((t) => (
                  <Option key={t.uuid} value={t.uuid}>{t.nama_tag}</Option>
                ))}
              </Select>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTag.map((id) => (
                  <Chip key={id} value={tags.find(t => t.uuid === id)?.nama_tag} variant="ghost" color="teal" size="sm" 
                    icon={<XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeTag(id)} />} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gambar */}
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">Gambar Berita</Typography>
            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-gray-50 file:text-blue-gray-700 hover:file:bg-blue-gray-100" />
            <Typography variant="small" color="gray" className="mt-1 italic text-[10px]">*Kosongkan jika tidak ingin mengganti gambar</Typography>
            {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg border mt-2 shadow-sm" />}
          </div>

          {/* Editor */}
          <div className="mb-10">
            <Typography variant="h6" color="blue-gray" className="mb-2">Isi Berita</Typography>
            <ReactQuill theme="snow" value={isi} onChange={setIsi} className="h-64" />
          </div>

          <div className="flex gap-4">
            <Button variant="text" color="red" fullWidth onClick={() => navigate("/dashboard/berita")}>Batal</Button>
            <Button type="submit" fullWidth>Update Berita</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}