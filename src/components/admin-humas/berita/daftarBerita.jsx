import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import { 
  PhotoIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon as XMarkOutline,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { 
  Card, CardHeader, Input, Typography, Button, CardBody, 
  Chip, Tabs, TabsHeader, Tab, IconButton, Tooltip, 
  Dialog, DialogBody, DialogHeader, Drawer, Select, Option, CardFooter 
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
  const [viewMode, setViewMode] = useState("table"); // State untuk mode tampilan
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", image: "", title: "" });
  const { user: authuser } = useSelector((state) => state.auth);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getBeritas();
  }, []);

  // Reset ke halaman 1 jika filter atau search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, rowsPerPage]);

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

  // Logika Filter & Search
  const filteredRows = beritas.filter((item) => {
    const matchesTab = filter === "all" || item.status === filter;
    const matchesSearch = item.judul_berita.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    const canSee = authuser?.role === "admin" || authuser?.uuid === item.user?.uuid;
    return matchesTab && matchesSearch && canSee;
  });

  // Logika Pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenImage = (url, image, title) => {
    setSelectedImage({ url, image, title });
    setOpenImageModal(true);
  };

  // Handler Actions (Delete, Verify, Reject, dll tetap sama)
  const deleteBerita = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus berita ini?")) {
      try {
        await axios.delete(`http://localhost:5000/beritas/${uuid}`, { withCredentials: true });
        getBeritas();
      } catch (error) { alert(error.response?.data?.msg || "Gagal menghapus"); }
    }
  };

  const verifyBerita = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/beritas/${uuid}/verify`, {}, { withCredentials: true });
      getBeritas();
    } catch (error) { alert("Gagal memverifikasi berita"); }
  };

  const rejectBerita = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/beritas/${uuid}/reject`, {}, { withCredentials: true });
      getBeritas();
    } catch (error) { alert("Gagal menolak berita"); }
  };

  const cancelVerifyBerita = async (uuid) => {
    if (window.confirm("Batalkan verifikasi?")) {
      try {
        await axios.patch(`http://localhost:5000/beritas/${uuid}/cancel-verify`, {}, { withCredentials: true });
        getBeritas();
      } catch (error) { alert("Gagal membatalkan verifikasi"); }
    }
  };

  const cancelRejectBerita = async (uuid) => {
    if (window.confirm("Batalkan penolakan?")) {
      try {
        await axios.patch(`http://localhost:5000/beritas/${uuid}/cancel-reject`, {}, { withCredentials: true });
        getBeritas();
      } catch (error) { alert("Gagal membatalkan penolakan"); }
    }
  };

  // Sub-component untuk Actions (dipakai di Table & Card)
  const ActionButtons = ({ berita }) => (
    <div className="flex gap-1">
      {authuser?.role === "admin" && (
        <>
          {berita.status === "verified" && (
            <Tooltip content="Batal Verifikasi">
              <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerifyBerita(berita.uuid)}>
                <ArrowPathIcon className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          )}
          {berita.status === "rejected" && (
            <Tooltip content="Batal Penolakan">
              <IconButton variant="text" color="amber" size="sm" onClick={() => cancelRejectBerita(berita.uuid)}>
                <ArrowPathIcon className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          )}
          {berita.status === "pending" && (
            <>
              <Tooltip content="Setujui">
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
      {berita.status !== "verified" && berita.status !== "rejected" && (
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
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarHumas />}
      </div>

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
        <div className="flex items-center bg-white lg:bg-transparent">
          <IconButton variant="text" color="blue-gray" className="lg:hidden mr-2" onClick={() => setIsDrawerOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1"><DashboardNavbar /></div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Card className="w-full shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader floated={false} shadow={false} className="rounded-none p-4">
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h5" color="blue-gray">Manajemen Berita</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">
                    Tampilan saat ini: {viewMode === 'table' ? 'Tabel' : 'Card'} ({filteredRows.length} Berita)
                  </Typography>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <IconButton variant={viewMode === "table" ? "white" : "text"} size="sm" onClick={() => setViewMode("table")}>
                      <ListBulletIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton variant={viewMode === "card" ? "white" : "text"} size="sm" onClick={() => setViewMode("card")}>
                      <Squares2X2Icon className="h-4 w-4" />
                    </IconButton>
                  </div>
                  <Link to="/dashboard/berita/tambah" className="flex-1">
                    <Button className="flex items-center gap-3 w-full justify-center" size="sm">
                      <PlusIcon className="h-4 w-4" /> Tambah Berita
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value={filter} className="w-full md:w-max">
                  <TabsHeader>
                    {TABS.map(({ label, value }) => (
                      <Tab key={value} value={value} onClick={() => setFilter(value)} className="text-xs lg:text-sm whitespace-nowrap">
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                  <Input 
                    label="Cari Berita/Penulis..." 
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardBody className="px-0 pt-0">
              {viewMode === "table" ? (
                /* --- TABLE VIEW --- */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map((head) => (
                          <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 font-bold text-[11px] uppercase opacity-70">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((berita, index) => {
                        const isLast = index === currentItems.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                        return (
                          <tr key={berita.uuid} className="hover:bg-gray-50 transition-colors">
                            <td className={classes}>
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-lg shadow-sm" onClick={() => handleOpenImage(berita.url, berita.image, berita.judul_berita)}>
                                  <img src={berita.url} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/150" }} />
                                </div>
                                <div className="flex flex-col max-w-[200px]">
                                  <Typography variant="small" className="font-bold truncate">{berita.judul_berita}</Typography>
                                  <Typography className="text-[10px] text-gray-400">ID: {berita.uuid.split('-')[0]}</Typography>
                                </div>
                              </div>
                            </td>
                            <td className={classes}>
                              <div className="flex gap-1 flex-wrap max-w-[120px]">
                                {berita.kategoris?.map((cat) => (
                                  <Chip key={cat.uuid} variant="outlined" size="sm" value={cat.nama_kategori} className="rounded-full text-[9px]" />
                                ))}
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography className="text-xs">{new Date(berita.createdAt).toLocaleDateString("id-ID")}</Typography>
                            </td>
                            <td className={classes}>
                              <Typography className="text-xs font-medium">{berita.user?.username || "Admin"}</Typography>
                            </td>
                            <td className={classes}>
                              <Chip size="sm" variant="ghost" value={berita.status} color={berita.status === "verified" ? "green" : berita.status === "pending" ? "amber" : "red"} className="text-center"/>
                            </td>
                            <td className={classes}>
                              <ActionButtons berita={berita} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* --- CARD VIEW --- */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                  {currentItems.map((berita) => (
                    <Card key={berita.uuid} className="border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40 group cursor-pointer" onClick={() => handleOpenImage(berita.url, berita.image, berita.judul_berita)}>
                        <img src={berita.url} className="w-full h-full object-cover" alt="" onError={(e) => e.target.src = "https://via.placeholder.com/400x200"} />
                        <div className="absolute top-2 right-2">
                          <Chip size="sm" value={berita.status} color={berita.status === "verified" ? "green" : berita.status === "pending" ? "amber" : "red"} />
                        </div>
                      </div>
                      <CardBody className="p-4">
                        <Typography variant="h6" color="blue-gray" className="mb-2 line-clamp-2 min-h-[48px] leading-snug">
                          {berita.judul_berita}
                        </Typography>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CalendarDaysIcon className="h-4 w-4" /> {new Date(berita.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <UserCircleIcon className="h-4 w-4" /> {berita.user?.username || "Admin"}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {berita.kategoris?.slice(0, 2).map((cat) => (
                            <Chip key={cat.uuid} variant="outlined" size="sm" value={cat.nama_kategori} className="text-[9px] rounded-full" />
                          ))}
                        </div>
                        <div className="flex justify-between items-center border-t pt-3">
                           <ActionButtons berita={berita} />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}

              {/* TAMPILAN JIKA KOSONG */}
              {filteredRows.length === 0 && (
                <div className="py-20 text-center">
                  <Typography color="gray">Berita tidak ditemukan.</Typography>
                </div>
              )}
            </CardBody>

            {/* --- PAGINATION FOOTER --- */}
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
              <div className="flex items-center gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
                  Halaman {currentPage} dari {totalPages || 1}
                </Typography>
                <div className="w-24">
                  <Select
                    label="Baris"
                    value={rowsPerPage.toString()}
                    onChange={(val) => setRowsPerPage(Number(val))}
                    size="sm"
                  >
                    <Option value="10">10</Option>
                    <Option value="15">15</Option>
                    <Option value="20">20</Option>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeftIcon strokeWidth={2} className="h-3 w-3" /> Prev
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <IconButton
                      key={i}
                      size="sm"
                      variant={currentPage === i + 1 ? "filled" : "text"}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </IconButton>
                  ))}
                </div>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-2"
                >
                  Next <ChevronRightIcon strokeWidth={2} className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL (Tetap sama) */}
      <Dialog size="md" open={openImageModal} handler={() => setOpenImageModal(false)} className="shadow-2xl overflow-hidden flex flex-col max-h-[95vh] w-[95vw] md:w-full">
        <DialogHeader className="flex shrink-0 justify-between items-center border-b border-gray-100 bg-gray-50 py-3 px-5">
          <div className="flex flex-col min-w-0">
            <Typography variant="h6" color="blue-gray" className="leading-tight text-sm md:text-base">Preview Gambar</Typography>
            <Typography variant="small" color="gray" className="font-normal truncate max-w-[200px] text-xs">{selectedImage.title}</Typography>
          </div>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenImageModal(false)} size="sm">
            <XMarkSolid className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-0 bg-gray-100 overflow-y-auto flex-1">
          <div className="flex items-center justify-center p-4">
            <img alt={selectedImage.title} className="max-h-[60vh] w-full h-auto rounded-lg shadow-lg object-contain bg-white" src={selectedImage.url} />
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}