import React, { useState, useEffect, useCallback } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
// Import instance api yang sudah dikonfigurasi dengan JWT Interceptor
import api from "../../../utils/api"; 
import {
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
  const [viewMode, setViewMode] = useState("table"); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", image: "", title: "" });
  const { user: authuser } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, rowsPerPage]);

  const getBeritas = useCallback(async () => {
    try {
      // Menggunakan api instance
      const response = await api.get("/beritas");
      setBeritas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/masuk");
      }
    }
  }, [navigate]);
  
  useEffect(() => {
    getBeritas();
  }, [getBeritas]);

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

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleOpenImage = (url, image, title) => {
    setSelectedImage({ url, image, title });
    setOpenImageModal(true);
  };

  const deleteBerita = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus berita ini?")) {
      try {
        await api.delete(`/beritas/${uuid}`);
        getBeritas();
      } catch (error) { 
        alert(error.response?.data?.msg || "Gagal menghapus"); 
      }
    }
  };

  const verifyBerita = async (uuid) => {
    try {
      await api.patch(`/beritas/${uuid}/verify`);
      getBeritas();
    } catch (error) { alert("Gagal memverifikasi berita"); }
  };

  const rejectBerita = async (uuid) => {
    try {
      await api.patch(`/beritas/${uuid}/reject`);
      getBeritas();
    } catch (error) { alert("Gagal menolak berita"); }
  };

  const cancelVerifyBerita = async (uuid) => {
    if (window.confirm("Batalkan verifikasi?")) {
      try {
        await api.patch(`/beritas/${uuid}/cancel-verify`);
        getBeritas();
      } catch (error) { alert("Gagal membatalkan verifikasi"); }
    }
  };

  const cancelRejectBerita = async (uuid) => {
    if (window.confirm("Batalkan penolakan?")) {
      try {
        await api.patch(`/beritas/${uuid}/cancel-reject`);
        getBeritas();
      } catch (error) { alert("Gagal membatalkan penolakan"); }
    }
  };

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

  const SecureImage = ({ src, alt, className, onClick }) => {
  const [imageBlob, setImageBlob] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Mengambil image sebagai blob lewat axios instance (yang sudah punya interceptor token)
        const response = await api.get(src, { responseType: 'blob' });
        const url = URL.createObjectURL(response.data);
        setImageBlob(url);
      } catch (error) {
        console.error("Gagal memuat gambar secara aman", error);
        setImageBlob("https://via.placeholder.com/150"); // fallback
      }
    };

    if (src) fetchImage();
    
    // Cleanup URL saat komponen unmount
    return () => {
      if (imageBlob) URL.revokeObjectURL(imageBlob);
    };
  }, [src]);

  return (
    <img 
      src={imageBlob || ""} 
      alt={alt} 
      className={className} 
      onClick={onClick}
      onError={(e) => { e.target.src = "/default-image.png" }}
    />
  );
};

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
                    {filteredRows.length} Berita ditemukan
                  </Typography>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <IconButton variant={viewMode === "table" ? "filled" : "text"} size="sm" onClick={() => setViewMode("table")}>
                      <ListBulletIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton variant={viewMode === "card" ? "filled" : "text"} size="sm" onClick={() => setViewMode("card")}>
                      <Squares2X2Icon className="h-4 w-4" />
                    </IconButton>
                  </div>
                    <Button className="flex items-center gap-3" size="sm" onClick={() => navigate(`/dashboard/berita/tambah`)}>
                      <PlusIcon className="h-4 w-4" /> Tambah Berita
                    </Button>
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

            <CardBody className={`px-0 pt-0 ${viewMode === 'table' ? 'overflow-x-auto' : ''}`}>
              {viewMode === "table" ? (
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
                              {/* Menambahkan Token di Image URL */}
                              <div className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-lg shadow-sm" onClick={() => handleOpenImage(berita.url, berita.image, berita.judul_berita)}>
                                <SecureImage 
                                  src={berita.url} 
                                  alt={berita.judul_berita} 
                                  className="h-full w-full object-cover" 
                                />
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                  {currentItems.map((berita) => (
                    <Card key={berita.uuid} className="border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {/* Menambahkan Token di Image URL */}
                      <div className="relative h-40 group cursor-pointer" onClick={() => handleOpenImage(berita.url, berita.image, berita.judul_berita)}>
                        <SecureImage 
                          src={berita.url} 
                          className="w-full h-full object-cover" 
                          alt={berita.judul_berita} 
                        />
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
              {filteredRows.length === 0 && (
                <div className="py-20 text-center">
                  <Typography color="gray">Berita tidak ditemukan.</Typography>
                </div>
              )}
            </CardBody>

            <CardFooter className="flex flex-wrap items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
              <div className="flex items-center flex-wrap gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
                  Halaman <b>{currentPage}</b> dari <b>{totalPages || 1}</b>
                </Typography>
                <div className="w-20">
                  <Select
                    label="Baris"
                    value={rowsPerPage.toString()}
                    onChange={(val) => setRowsPerPage(Number(val))}
                    containerProps={{ className: "min-w-[70px]" }}
                  >
                    <Option value="10">10</Option>
                    <Option value="15">15</Option>
                    <Option value="20">20</Option>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 sm:px-3 flex items-center gap-2 capitalize"
                >
                  <ChevronLeftIcon strokeWidth={3} className="h-4 w-4" /> 
                  <span className="hidden sm:block text-[11px]">Sebelumnya</span>
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === "..." ? (
                      <span key={`dots-${index}`} className="px-1 text-blue-gray-500 text-xs">...</span>
                    ) : (
                      <IconButton
                        key={page}
                        size="sm"
                        variant={currentPage === page ? "filled" : "text"}
                        color={currentPage === page ? null : "blue-gray"}
                        onClick={() => paginate(page)}
                        className="rounded-md h-8 w-8 text-xs"
                      >
                        {page}
                      </IconButton>
                    )
                  ))}
                </div>

                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 sm:px-3 flex items-center gap-2 capitalize"
                >
                  <span className="hidden sm:block text-[11px]">Berikutnya</span>
                  <ChevronRightIcon strokeWidth={3} className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* MODAL PREVIEW GAMBAR */}
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
             {/* Menambahkan Token di Image URL */}
            <SecureImage 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              className="max-h-[60vh] w-full h-auto rounded-lg shadow-lg object-contain bg-white" 
            />
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}