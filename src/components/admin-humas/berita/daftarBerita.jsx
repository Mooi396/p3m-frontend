import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import { 
  PhotoIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon as XMarkOutline 
} from "@heroicons/react/24/outline";
import { 
  Card, CardHeader, Input, Typography, Button, CardBody, 
  Chip, Tabs, TabsHeader, Tab, IconButton, Tooltip, 
  Dialog, DialogBody, DialogHeader, Drawer 
} from "@material-tailwind/react";
import { 
  PencilIcon, PlusIcon, TrashIcon, CheckIcon, 
  XMarkIcon as XMarkSolid 
} from "@heroicons/react/24/solid";
import {
  EyeIcon, ArrowPathIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import DashboardNavbar from "../../dashboardNavbar";
import { useSelector } from "react-redux";
import SidebarHumas from "../sidebarHumas";

const TABS = [
  { label: "Semua", value: "all" },
  { label: "Terverifikasi", value: "verified" },
  { label: "Menunggu", value: "pending" },
  { label: "Ditolak", value: "rejected" },
];

const TABLE_HEAD = ["Berita", "Kategori", "Tanggal Dibuat", "Penulis", "Status", "Actions"];

export default function DaftarBeritaAdmin() {
  const [beritas, setBeritas] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State untuk Drawer
  const navigate = useNavigate();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", image: "", title: ""  });
  const { user: authuser } = useSelector((state) => state.auth);

  const handleOpenImage = (url, image, title) => {
    setSelectedImage({ url, image, title });
    setOpenImageModal(true);
  };

  useEffect(() => {
    getBeritas();
  }, []);

  const getBeritas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/beritas", {
        withCredentials: true,
      });
      setBeritas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
    }
  };

  const deleteBerita = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus berita ini?")) {
      try {
        await axios.delete(`http://localhost:5000/beritas/${uuid}`, { withCredentials: true });
        getBeritas();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus");
      }
    }
  };

  const verifyBerita = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/beritas/${uuid}/verify`, {}, { withCredentials: true });
      getBeritas();
    } catch (error) {
      alert("Gagal memverifikasi berita");
    }
  };

  const rejectBerita = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/beritas/${uuid}/reject`, {}, { withCredentials: true });
      getBeritas();
    } catch (error) {
      alert("Gagal menolak berita");
    }
  };

  const cancelVerifyBerita = async (uuid) => {
    if (window.confirm("Batalkan verifikasi? Berita ini akan kembali ke status Pending dan bisa diedit.")) {
      try {
        await axios.patch(`http://localhost:5000/beritas/${uuid}/cancel-verify`, {}, { 
          withCredentials: true 
        });
        getBeritas();
      } catch (error) {
        alert("Gagal membatalkan verifikasi");
      }
    }
  };

  const cancelRejectBerita = async (uuid) => {
    if (window.confirm("Batalkan penolakan? Berita ini akan kembali ke status Pending")) {
      try {
        await axios.patch(`http://localhost:5000/beritas/${uuid}/cancel-reject`, {}, { 
          withCredentials: true 
        });
        getBeritas();
      } catch (error) {
        alert("Gagal membatalkan penolakan");
      }
    }
  };

  const filteredRows = beritas.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = item.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Logika akses: Admin lihat semua, Humas lihat miliknya sendiri
    const canSee = authuser?.role === "admin" || authuser?.uuid === item.user?.uuid;
    
    return matchesTab && matchesSearch && canSee;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

      {/* DRAWER MOBILE */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Berita</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkOutline className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <div className="flex items-center bg-white lg:bg-transparent">
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
          <Card className="w-full shadow-md border border-gray-200 rounded-xl">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4">
              <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">Manajemen Berita</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Kelola publikasi, verifikasi, dan konten berita instansi
                  </Typography>
                </div>
                <Link to="/dashboard/berita/tambah" className="w-full sm:w-auto">
                  <Button className="flex items-center gap-3 w-full justify-center" size="sm">
                    <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Berita
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value={filter} className="w-full md:w-max">
                  <TabsHeader className="overflow-x-auto">
                    {TABS.map(({ label, value }) => (
                      <Tab key={value} value={value} onClick={() => setFilter(value)} className="whitespace-nowrap px-4 text-xs lg:text-sm">
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                  <Input 
                    label="Cari Berita..." 
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody className="overflow-x-auto px-0 pt-0">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70 uppercase text-[11px]">
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((berita, index) => {
                    const classes = index === filteredRows.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={berita.uuid} className="hover:bg-gray-50 transition-colors">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Tooltip content="Klik untuk lihat gambar">
                              <div 
                                className="relative h-12 w-12 cursor-pointer group overflow-hidden rounded-lg shadow-sm border border-blue-gray-100 shrink-0"
                                onClick={() => handleOpenImage(berita.url, berita.image, berita.judul_berita)}
                              >
                                <img 
                                  src={berita.url} 
                                  alt={berita.judul_berita} 
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <PhotoIcon className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            </Tooltip>
                            
                            <div className="flex flex-col max-w-[180px] lg:max-w-[250px]">
                              <Typography variant="small" color="blue-gray" className="font-bold leading-tight truncate">
                                {berita.judul_berita}
                              </Typography>
                              <Typography className="text-[10px] text-gray-500 font-mono truncate">
                                UUID: {berita.uuid.split('-')[0]}...
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex gap-1 flex-wrap max-w-[120px]">
                            {berita.kategoris?.map((cat) => (
                              <Chip key={cat.uuid} variant="outlined" size="sm" value={cat.nama_kategori} className="lowercase rounded-full text-[10px]" />
                            )) || "-"}
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                            {new Date(berita.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal text-xs">{berita.user?.username || "Admin"}</Typography>
                        </td>
                        <td className={classes}>
                          <Chip variant="ghost" size="sm" value={berita.status} className="text-[10px]" color={berita.status === "verified" ? "green" : berita.status === "pending" ? "amber" : "red"} />
                        </td>
                        <td className={classes}>
                          <div className="flex gap-1">
                            {/* ACTIONS KHUSUS ADMIN */}
                            {authuser?.role === "admin" && (
                              <>
                                {berita.status === "verified" && (
                                  <Tooltip content="Batalkan Verifikasi">
                                    <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerifyBerita(berita.uuid)}>
                                      <ArrowPathIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {berita.status === "rejected" && (
                                  <Tooltip content="Batalkan Penolakan">
                                    <IconButton variant="text" color="amber" size="sm" onClick={() => cancelRejectBerita(berita.uuid)}>
                                      <ArrowPathIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {berita.status === "pending" && (
                                  <>
                                    <Tooltip content="Setujui Berita">
                                      <IconButton variant="text" color="green" size="sm" onClick={() => verifyBerita(berita.uuid)}>
                                        <CheckIcon className="h-4 w-4" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip content="Tolak">
                                      <IconButton variant="text" color="red" size="sm" onClick={() => rejectBerita(berita.uuid)}>
                                        <XMarkSolid className="h-4 w-4" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </>
                            )}

                            <Tooltip content="Baca Detail">
                              <IconButton variant="text" color="blue-gray" size="sm" onClick={() => navigate(`/dashboard/berita/${berita.uuid}`)}>
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>

                            {berita.status !== "verified" && (
                              <Tooltip content="Edit">
                                <IconButton variant="text" color="blue-gray" size="sm" onClick={() => navigate(`/dashboard/berita/edit/${berita.uuid}`)}>
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip content="Hapus">
                              <IconButton variant="text" color="red" size="sm" onClick={() => deleteBerita(berita.uuid)}>
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      <Dialog 
        size="md" 
        open={openImageModal} 
        handler={() => setOpenImageModal(false)}
        // Tambahkan w-full sm:w-auto agar di HP lebarnya penuh, 
        // dan max-h-screen agar dialog tidak melebihi tinggi layar
        className="shadow-2xl overflow-hidden flex flex-col max-h-[95vh] w-[95vw] md:w-full"
      >
        <DialogHeader className="flex shrink-0 justify-between items-center border-b border-gray-100 bg-gray-50 py-3 px-5">
          <div className="flex flex-col min-w-0"> {/* min-w-0 penting agar truncate jalan */}
            <Typography variant="h6" color="blue-gray" className="leading-tight text-sm md:text-base">
              Preview Gambar Berita
            </Typography>
            <Typography 
              variant="small" 
              color="gray" 
              className="font-normal truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] text-xs"
            >
              {selectedImage.title}
            </Typography>
          </div>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenImageModal(false)} size="sm">
            <XMarkSolid className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        {/* Tambahkan overflow-y-auto di sini agar jika gambar sangat panjang, dialog bisa di-scroll */}
        <DialogBody className="p-0 bg-gray-100 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex items-center justify-center p-2 sm:p-4 min-h-[200px]">
            <img
              alt={selectedImage.title}
              // max-h-[60vh] menjaga agar gambar tidak mendorong dialog keluar layar
              className="max-h-[60vh] w-full h-auto rounded-lg shadow-lg object-contain bg-white"
              src={selectedImage.url}
            />
          </div>
          
          {/* Footer diletakkan di dalam Body atau di bawah sebagai info tambahan */}
          <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0">
            <div className="flex items-center gap-2">
              <PhotoIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <Typography variant="small" color="blue-gray" className="font-mono text-[10px] md:text-[11px] break-all leading-tight">
                Filename: {selectedImage.image}
              </Typography>
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}