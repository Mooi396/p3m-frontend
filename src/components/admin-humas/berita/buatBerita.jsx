import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function CreateBerita() {
  const navigate = useNavigate();
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  // State diubah menjadi Array untuk menampung banyak pilihan
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

  // Fungsi untuk menambah kategori ke daftar terpilih (mencegah duplikat)
  const handleAddKategori = (uuid) => {
    if (!selectedKategori.includes(uuid)) {
      setSelectedKategori([...selectedKategori, uuid]);
    }
  };

  // Fungsi untuk menambah tag ke daftar terpilih (mencegah duplikat)
  const handleAddTag = (uuid) => {
    if (!selectedTag.includes(uuid)) {
      setSelectedTag([...selectedTag, uuid]);
    }
  };

  // Fungsi untuk menghapus pilihan
  const removeKategori = (uuid) => setSelectedKategori(selectedKategori.filter(id => id !== uuid));
  const removeTag = (uuid) => setSelectedTag(selectedTag.filter(id => id !== uuid));

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
    data.append("file", file);
    
    // Backend Sequelize (dengan addKategori/addTag) biasanya menerima array dalam bentuk berulang
    // atau dihandle sebagai array string.
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
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Card color="transparent" shadow={true} className="p-8 w-full max-w-[50rem] mx-auto bg-white border border-gray-100">
        <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h4" color="blue-gray">Buat Berita Baru</Typography>
                    <Typography color="gray" className="mt-1 font-normal text-sm italic">Buat berita baru untuk disebarkan</Typography>
                  </div>
                  <Button variant="text" size="sm" className="flex items-center gap-2" onClick={() => navigate(-1)}>
                    <ArrowLeftIcon className="h-4 w-4" /> Kembali
                  </Button>
                </div>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">Judul Berita</Typography>
            <Input size="lg" placeholder="Masukkan judul..." value={judul} onChange={(e) => setJudul(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">Kategori (Bisa Pilih Banyak)</Typography>
              <Select label="Klik untuk pilih kategori" onChange={(val) => handleAddKategori(val)}>
                {categories.map((cat) => (
                  <Option key={cat.uuid} value={cat.uuid}>{cat.nama_kategori}</Option>
                ))}
              </Select>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedKategori.map((id) => {
                  const catName = categories.find(c => c.uuid === id)?.nama_kategori;
                  return (
                    <Chip key={id} value={catName} variant="ghost" color="blue" size="sm" icon={<XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeKategori(id)} />} />
                  );
                })}
              </div>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">Tag (Bisa Pilih Banyak)</Typography>
              <Select label="Klik untuk pilih tag" onChange={(val) => handleAddTag(val)}>
                {tags.map((t) => (
                  <Option key={t.uuid} value={t.uuid}>{t.nama_tag}</Option>
                ))}
              </Select>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTag.map((id) => {
                  const tagName = tags.find(t => t.uuid === id)?.nama_tag;
                  return (
                    <Chip key={id} value={tagName} variant="ghost" color="teal" size="sm" icon={<XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeTag(id)} />} />
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-2">Gambar Utama</Typography>
            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-gray-50 file:text-blue-gray-700 hover:file:bg-blue-gray-100 mb-2" />
            {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg border mt-2" />}
          </div>
          <div className="mb-10">
            <Typography variant="h6" color="blue-gray" className="mb-2">Isi Berita</Typography>
            <ReactQuill theme="snow" value={isi} onChange={setIsi} modules={modules} placeholder="Tuliskan berita..." className="h-64" />
          </div>

          <div className="flex gap-4">
            <Button variant="text" color="red" fullWidth onClick={() => navigate("/dashboard/berita")}>Batal</Button>
            <Button type="submit" fullWidth>Simpan & Kirim</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}