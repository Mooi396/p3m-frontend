import { useState, useEffect } from "react";
import SidebarAdmin from "../sidebarAdmin";
import axios from "axios";
import { PhotoIcon,MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { 
  Card, CardHeader, Input, Typography, Button, CardBody, 
  Chip, Tabs, TabsHeader, Tab, IconButton, Tooltip, 
  Dialog, DialogBody, DialogHeader 
} from "@material-tailwind/react";
import { 
  PencilIcon, PlusIcon, TrashIcon, CheckIcon, 
  XMarkIcon 
} from "@heroicons/react/24/solid";
import {
  EyeIcon, ArrowPathIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import DashboardNavbar from "../../dashboardNavbar";

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
  const navigate = useNavigate();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", image: "", title: ""  });

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
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <div className="flex-1 min-w-0 overflow-auto">
        <DashboardNavbar />
        <Card className="w-full rounded-none shadow-none">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">Manajemen Berita</Typography>
                <Typography color="gray" className="mt-1 font-normal text-sm">
                  Kelola publikasi, verifikasi, dan konten berita instansi
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Link to="/dashboard/berita/tambah">
                  <Button className="flex items-center gap-3" size="sm">
                    <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Berita
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Tabs value={filter} className="w-full md:w-max">
                <TabsHeader>
                  {TABS.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => setFilter(value)}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
              <div className="w-full md:w-72">
                <Input 
                  label="Cari Judul atau Penulis..." 
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-bold opacity-70 uppercase text-[11px]">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((berita, index) => {
                const isLast = index === filteredRows.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={berita.uuid} className="hover:bg-gray-50/50 transition-colors">
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Tooltip content="Klik untuk lihat gambar">
                          <div 
                            className="relative h-12 w-12 cursor-pointer group overflow-hidden rounded-lg shadow-sm border border-blue-gray-100"
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
                        
                        <div className="flex flex-col max-w-[200px]">
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
                      <div className="flex gap-1 flex-wrap max-w-[150px]">
                        {berita.kategoris?.map((cat) => (
                          <Chip key={cat.uuid} variant="outlined" size="sm" value={cat.nama_kategori} className="lowercase rounded-full" />
                        )) || "-"}
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                        {new Date(berita.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">{berita.user?.username || "Admin"}</Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip variant="ghost" size="sm" value={berita.status} color={berita.status === "verified" ? "green" : berita.status === "pending" ? "amber" : "red"} />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-1">
                        {berita.status === "verified" && (
                          <Tooltip content="Batalkan Verifikasi (Edit kembali)">
                            <IconButton 
                              variant="text" 
                              color="amber" 
                              size="sm" 
                              onClick={() => cancelVerifyBerita(berita.uuid)}
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {berita.status === "rejected" && (
                          <Tooltip content="Batalkan Penolakan">
                            <IconButton 
                              variant="text" 
                              color="amber" 
                              size="sm" 
                              onClick={() => cancelRejectBerita(berita.uuid)}
                            >
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
                                <XMarkIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip content="Baca Detail Berita">
                          <IconButton variant="text" color="black" size="sm" onClick={() => navigate(`/dashboard/berita/${berita.uuid}`)}>
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        {berita.status !== "verified" && (
                        <Tooltip content="Edit">
                          <IconButton variant="text" color="black" size="sm" onClick={() => navigate(`/dashboard/berita/edit/${berita.uuid}`)}>
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
      <Dialog 
        size="md" 
        open={openImageModal} 
        handler={() => setOpenImageModal(false)}
        className="shadow-2xl overflow-hidden"
      >
        <DialogHeader className="flex justify-between items-center border-b border-gray-100 bg-gray-50 py-3 px-5">
          <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="leading-tight">
              Preview Gambar Berita
            </Typography>
            <Typography variant="small" color="gray" className="font-normal truncate max-w-[300px]">
              {selectedImage.title}
            </Typography>
          </div>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenImageModal(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-0 bg-gray-100">
          <div className="flex items-center justify-center p-4">
            <img
              alt={selectedImage.title}
              className="max-h-[70vh] w-auto rounded-lg shadow-lg object-contain"
              src={selectedImage.url}
            />
          </div>
          {/* INFO NAMA FILE DI FOOTER MODAL */}
          <div className="bg-white p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
               <PhotoIcon className="h-4 w-4 text-gray-400" />
               <Typography variant="small" color="blue-gray" className="font-mono text-[11px] break-all">
                Filename: {selectedImage.image}
              </Typography>
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}