import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Spinner,
  Button,
  Input,
  IconButton,
  Drawer,
  CardBody,
} from "@material-tailwind/react";
import {
  PencilIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Head from "../../head";
import SidebarAdmin from "../../admin/sidebarAdmin";
import DashboardNavbar from "../../dashboardNavbar";

export default function KustomisasiLandingComponent() {
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [landingData, setLandingData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // State untuk Form Data
  const [heroSlides, setHeroSlides] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [footerContacts, setFooterContacts] = useState([]);
  const [footerAddresses, setFooterAddresses] = useState([]);
  const [footerEmails, setFooterEmails] = useState({ marketing: "", info: "" });
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/landing`, { withCredentials: true });
      const data = res.data.data;
      
      if (!data || !data.slug) {
        setIsEdit(true);
        setLandingData(null);
      } else {
        const sections = data.sections;
        setLandingData(sections);
        setHeroSlides(sections.hero?.slides || []);
        setFooterContacts(sections.footer?.contacts || []);
        setFooterAddresses(sections.footer?.addresses || []);
        setFooterEmails({
          marketing: sections.footer?.emailMarketing || "",
          info: sections.footer?.emailInfo || "",
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data landing:", error);
      setIsEdit(true);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addHeroSlide = () => {
  // Validasi: Jika jumlah slide sudah 5 atau lebih, stop.
  if (heroSlides.length >= 5) {
    alert("Batas maksimal adalah 5 slide.");
    return;
  }
  
  setHeroSlides([...heroSlides, { id: Date.now(), image: "", title: "", description: "" }]);
};

  const removeHeroSlide = (id) => {
    const slideToRemove = heroSlides.find((s) => s.id === id);
    // Jika slide yang dihapus punya image, masukkan ke daftar hapus
    if (slideToRemove && slideToRemove.image) {
      setDeletedImages((prev) => [...prev, slideToRemove.image]);
    }
    setHeroSlides(heroSlides.filter((s) => s.id !== id));
  };

  const handleHeroImageUpload = async (id, file) => {
    if (!file) return;
    const oldSlide = heroSlides.find((s) => s.id === id);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post(`${API_URL}/landing/upload-hero`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        });

      // Jika slide ini sebelumnya sudah ada gambarnya, masukkan gambar lama ke daftar antrean hapus
      if (oldSlide && oldSlide.image) {
        setDeletedImages((prev) => [...prev, oldSlide.image]);
      }

      const newSlides = heroSlides.map((s) => 
        s.id === id ? { ...s, image: res.data.imagePath } : s
        );
        setHeroSlides(newSlides);
    } catch (err) {
        alert("Gagal upload gambar");
    }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        hero: { slides: heroSlides },
        footer: {
          emailMarketing: footerEmails.marketing,
          emailInfo: footerEmails.info,
          contacts: footerContacts,
          addresses: footerAddresses,
          socials: landingData?.footer?.socials || []
        },
        tradition: landingData?.tradition || { items: [] },
        // Kirim daftar file yang perlu dibersihkan (Opsional, tapi membantu logika backend)
        tempDeletedFiles: deletedImages 
      };

      await axios.patch(`${API_URL}/landing/update`, payload, { withCredentials: true });
      
      // Reset antrean hapus setelah berhasil
      setDeletedImages([]);
      setIsEdit(false);
      fetchData();
      alert("Perubahan berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan perubahan");
    }
  };

  if (loading) return <div className="flex h-screen w-full items-center justify-center"><Spinner className="h-12 w-12" color="blue" /></div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        <SidebarAdmin />
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <SidebarAdmin />
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center bg-white lg:bg-transparent shadow-sm lg:shadow-none">
          <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setIsDrawerOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-10">
          <Head title="Kustomisasi Landing Page" />
          
          <Card className="w-full shadow-sm border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <CardBody className="p-6 lg:p-10">
              {/* HEADER SECTION */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                <div>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    Kustomisasi Landing Page
                  </Typography>
                  <Typography className="mt-1 font-normal text-gray-500 text-sm">
                    {landingData ? "Kelola konten hero slider dan informasi footer website" : "Data belum tersedia, silakan buat konten baru"}
                  </Typography>
                </div>
                {landingData && (
                  <Button 
                    size="md" 
                    className={`flex items-center gap-2 normal-case rounded-lg shadow-none hover:shadow-none ${isEdit ? "bg-red-500" : "bg-black"}`}
                    onClick={() => {
                        if (isEdit) {
                        fetchData();
                        setIsEdit(false);
                        } else {
                        // Jika ingin mulai edit
                        setIsEdit(true);
                        }
                    }}
                    >
                    {isEdit ? (
                        <>
                        <ArrowLeftIcon className="h-4 w-4" /> Batal
                        </>
                    ) : (
                        <>
                        <PencilIcon className="h-4 w-4" /> EDIT KONTEN
                        </>
                    )}
                    </Button>
                )}
              </div>

              {!isEdit && landingData ? (
                <div className="space-y-12">
                  {/* VIEW MODE: HERO SLIDES */}
                  <section>
                    <Typography className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">
                      <PhotoIcon className="h-5 w-5" /> Hero Slides
                    </Typography>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                      {heroSlides.map((slide) => (
                        <div key={slide.id} className="p-5 rounded-2xl border border-gray-100 bg-white">
                          <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-100">
                            <img 
                              src={slide.image ? `${API_URL}/storage/${slide.image}` : "https://via.placeholder.com/600x300?text=No+Image"} 
                              className="w-full h-full object-cover"
                              alt="preview"
                            />
                          </div>
                          <div className="space-y-3">
                             <div className="p-3 bg-gray-100/70 rounded-lg text-gray-700 text-sm font-medium border border-gray-200/50">
                                {slide.title || "Judul Slide"}
                             </div>
                             <div className="p-3 bg-gray-100/70 rounded-lg text-gray-700 text-sm border border-gray-200/50">
                                {slide.description || "Deskripsi Slide"}
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* VIEW MODE: CONTACTS & ADDRESSES */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contacts View */}
                    <div>
                      <Typography className="font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">Kontak Person</Typography>
                      <div className="space-y-4">
                        {footerContacts.map((contact, index) => (
                          <div key={index} className="p-5 rounded-2xl border border-gray-100 bg-white space-y-3">
                            <div className="p-3 bg-gray-100/70 rounded-lg text-sm border border-gray-200/50">{contact.name}</div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-100/70 rounded-lg text-sm border border-gray-200/50">{contact.phone}</div>
                                <div className="p-3 bg-gray-100/70 rounded-lg text-sm border border-gray-200/50">{contact.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Addresses View */}
                    <div>
                      <Typography className="font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">Alamat Sekretariat</Typography>
                      <div className="space-y-4">
                        {footerAddresses.map((addr, index) => (
                          <div key={index} className="p-5 rounded-2xl border border-gray-100 bg-white space-y-3">
                            <div className="p-3 bg-gray-100/70 rounded-lg text-sm border border-gray-200/50">{addr.title}</div>
                            <div className="p-3 bg-gray-100/70 rounded-lg text-sm border border-gray-200/50">{addr.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* EDIT MODE: HERO SLIDER */}
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <Typography as="div" className="flex items-center gap-2 font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">
                      <PhotoIcon className="h-5 w-5" /> 
                      <div className="flex flex-col">
                        <Typography variant="h6">Hero Slides</Typography>
                        <Typography className="text-xs text-gray-500 mt-1">
                            * Maksimal 5 slide
                        </Typography>
                      </div>
                    </Typography>
                      <Button size="sm" variant="outlined" className="flex items-center gap-2 rounded-lg" onClick={addHeroSlide} disabled={heroSlides.length >= 5}>
                        <PlusIcon className="h-4 w-4" /> Tambah Slide
                      </Button>
                    </div>
                    
                    {heroSlides.length === 0 && (
                        <div className="text-center p-10 border-2 border-dashed border-gray-200 rounded-xl italic text-gray-500">
                            Belum ada slide. Klik "Tambah Slide" untuk memulai.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {heroSlides.map((slide, index) => (
                        <Card key={slide.id} className="p-4 border border-gray-200 bg-gray-50/30 relative shadow-none rounded-xl">
                          <IconButton 
                            size="sm" color="red" variant="text" className="!absolute top-2 right-2 z-10"
                            onClick={() => removeHeroSlide(slide.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                          <div className="space-y-4">
                            <div className="relative h-44 w-full bg-gray-200 rounded-lg overflow-hidden group border border-gray-300">
                              <img 
                                src={slide.image ? `${API_URL}/storage/${slide.image}` : "https://via.placeholder.com/400x200?text=No+Image"} 
                                className="w-full h-full object-cover"
                                alt="preview"
                              />
                              <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                                <PhotoIcon className="h-8 w-8 text-white mb-1" />
                                <Typography className="text-white text-[10px] font-bold uppercase">Ganti Gambar</Typography>
                                <input type="file" className="hidden" onChange={(e) => handleHeroImageUpload(slide.id, e.target.files[0])} accept=".jpg,.jpeg,.png" />
                              </label>
                            </div>
                            <Input 
                              label="Judul Slide" value={slide.title || ""} 
                              onChange={(e) => {
                                const newSlides = [...heroSlides];
                                newSlides[index].title = e.target.value;
                                setHeroSlides(newSlides);
                              }}
                            />
                            <Input 
                              label="Deskripsi Slide" value={slide.description || ""} 
                              onChange={(e) => {
                                const newSlides = [...heroSlides];
                                newSlides[index].description = e.target.value;
                                setHeroSlides(newSlides);
                              }}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* EDIT MODE: FOOTER CONTENT */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {/* Contacts Form */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Typography className="font-bold text-gray-800 uppercase tracking-wider text-sm">Kontak Person</Typography>
                        <IconButton size="sm" color="black" className="rounded-lg" onClick={() => setFooterContacts([...footerContacts, { name: "", phone: "", email: "" }])}>
                          <PlusIcon className="h-4 w-4 text-white" />
                        </IconButton>
                      </div>
                      <div className="space-y-4">
                        {footerContacts.map((contact, index) => (
                          <div key={index} className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-200 relative">
                            <Input label="Nama Lengkap" value={contact.name} onChange={(e) => {
                              const newC = [...footerContacts]; newC[index].name = e.target.value; setFooterContacts(newC);
                            }} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Input label="Nomor Telepon" value={contact.phone} onChange={(e) => {
                                const newC = [...footerContacts]; newC[index].phone = e.target.value; setFooterContacts(newC);
                              }} />
                              <Input label="Email" value={contact.email} onChange={(e) => {
                                const newC = [...footerContacts]; newC[index].email = e.target.value; setFooterContacts(newC);
                              }} />
                            </div>
                            <IconButton size="sm" color="red" variant="text" className="!absolute -top-2 -right-2 bg-white shadow-sm border border-red-50" onClick={() => setFooterContacts(footerContacts.filter((_, i) => i !== index))}>
                                <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Addresses Form */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Typography className="font-bold text-gray-800 uppercase tracking-wider text-sm">Alamat Sekretariat</Typography>
                        <IconButton size="sm" color="black" className="rounded-lg" onClick={() => setFooterAddresses([...footerAddresses, { title: "", detail: "" }])}>
                          <PlusIcon className="h-4 w-4 text-white" />
                        </IconButton>
                      </div>
                      <div className="space-y-4">
                        {footerAddresses.map((addr, index) => (
                          <div key={index} className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-200 relative">
                            <Input label="Label Alamat" value={addr.title} onChange={(e) => {
                              const newA = [...footerAddresses]; newA[index].title = e.target.value; setFooterAddresses(newA);
                            }} />
                            <Input label="Alamat Lengkap" value={addr.detail} onChange={(e) => {
                              const newA = [...footerAddresses]; newA[index].detail = e.target.value; setFooterAddresses(newA);
                            }} />
                            <IconButton size="sm" color="red" variant="text" className="!absolute -top-2 -right-2 bg-white shadow-sm border border-red-50" onClick={() => setFooterAddresses(footerAddresses.filter((_, i) => i !== index))}>
                                <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                    <Button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto normal-case shadow-none">
                      <CheckIcon className="h-4 w-4" /> {landingData ? "Simpan Perubahan" : "Buat Konten Pertama"}
                    </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}