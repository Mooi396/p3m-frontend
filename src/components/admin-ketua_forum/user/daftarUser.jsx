import React, { useState, useEffect, useCallback } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
// Menggunakan instance api dari utils
import api from "../../../utils/api";
import TambahUserAdmin from "./tambahUser";
import EditUserComponent from "./editUser";
import { 
  MagnifyingGlassIcon, 
  Squares2X2Icon, 
  ListBulletIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Drawer,
  Select,
  Option,
  CardFooter
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import {
  EyeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";
import DashboardNavbar from "../../dashboardNavbar";
import SidebarKetuaForum from "../sidebarKetuaForum";
import { useSelector } from "react-redux";

const TABS = [
  { label: "Semua", value: "all" },
  { label: "Terverifikasi", value: "verified" },
  { label: "Menunggu", value: "pending" },
  { label: "Ditolak", value: "rejected" },
];

const TABLE_HEAD = ["Member", "Instansi / Jabatan", "Status", "Role", "Actions"];

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 text-black">
    <div className="mt-1 p-1 bg-gray-200 rounded text-black">{icon}</div>
    <div>
      <Typography variant="small" color="gray" className="font-normal">
        {label}
      </Typography>
      <Typography variant="small" color="blue-gray" className="font-bold">
        {value || "-"}
      </Typography>
    </div>
  </div>
);

const SocialLink = ({ label, value }) => (
  <div>
    <Typography variant="small" color="gray" className="font-normal text-[11px]">
      {label}
    </Typography>
    <Typography variant="small" className="font-medium text-blue-600 truncate">
      {value ? (
        <a href={value.startsWith("http") ? value : "#"} target="_blank" rel="noreferrer" className="hover:underline">
          {value.length > 20 ? "Lihat Tautan" : value}
        </a>
      ) : ( "-")}
    </Typography>
  </div>
);

export default function DaftarUserAdmin() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openPhotoPreview, setOpenPhotoPreview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState({ url: "", name: "" });

  const { user: authuser } = useSelector((state) => state.auth);

  // Ambil token untuk disisipkan ke gambar profile user yang pending
  const token = localStorage.getItem("token");

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, rowsPerPage]);

  // Fungsi mengambil data menggunakan utilitas api
  const getUsers = useCallback(async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  }, []);
  
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const deleteUser = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await api.delete(`/users/${uuid}`);
        getUsers();
      } catch (error) { 
        console.error("Gagal menghapus:", error); 
        alert(error.response?.data?.msg || "Gagal menghapus user");
      }
    }
  };

  const verifyUser = async (uuid) => {
    try {
      await api.patch(`/users/${uuid}/verify`);
      getUsers();
    } catch (error) { console.error("Gagal verifikasi:", error); }
  };

  const rejectUser = async (uuid) => {
    try {
      await api.patch(`/users/${uuid}/reject`);
      getUsers();
    } catch (error) { console.error("Gagal menolak:", error); }
  };

  const cancelVerifyUser = async (uuid) => {
    if (window.confirm("Batalkan verifikasi?")) {
      try {
        await api.patch(`/users/${uuid}/cancel-verify`);
        getUsers();
      } catch (error) { alert("Gagal membatalkan verifikasi"); }
    }
  };
  
  const cancelRejectUser = async (uuid) => {
    if (window.confirm("Batalkan penolakan?")) {
      try {
        await api.patch(`/users/${uuid}/cancel-reject`);
        getUsers();
      } catch (error) { alert("Gagal membatalkan penolakan"); }
    }
  };

  const handleOpenPhotoPreview = (url = "", name = "") => {
    // Sisipkan token pada URL preview gambar
    setSelectedPhoto({ url: url ? `${url}?token=${token}` : "", name });
    setOpenPhotoPreview(!openPhotoPreview);
  };

  const handleOpenEdit = (userData = null) => {
    setUserToEdit(userData);
    setOpenEdit(!openEdit);
  };

  const handleOpen = (userData = null) => {
    setSelectedUser(userData);
    setOpen(!open);
  };

  const filteredData = users.filter((item) => {
    const info = item.anggotas && item.anggotas.length > 0 ? item.anggotas[0] : {};
    const matchesTab = filter === "all" || item.status === filter;
    const isNotMe = item.uuid !== authuser?.uuid;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (info.nama_lengkap || "").toLowerCase().includes(searchLower) ||
      (item.username || "").toLowerCase().includes(searchLower) ||
      (item.email || "").toLowerCase().includes(searchLower);
    return matchesTab && matchesSearch && isNotMe;
  });

  // Logic Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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

  const ActionButtons = ({ item }) => (
    <div className="flex gap-1">
      {item.status === "verified" && (
        <Tooltip content="Batal Verifikasi">
          <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerifyUser(item.uuid)}>
            <ArrowPathIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      )}
      {item.status === "rejected" && (
        <Tooltip content="Batal Penolakan">
          <IconButton variant="text" color="amber" size="sm" onClick={() => cancelRejectUser(item.uuid)}>
            <ArrowPathIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      )}
      {item.status === "pending" && (
        <>
          <Tooltip content="Verifikasi">
            <IconButton variant="text" color="green" size="sm" onClick={() => verifyUser(item.uuid)}>
              <CheckIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Tolak">
            <IconButton variant="text" color="red" size="sm" onClick={() => rejectUser(item.uuid)}>
              <XMarkIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </>
      )}
      <Tooltip content="Lihat Detail">
        <IconButton variant="text" size="sm" onClick={() => handleOpen(item)}>
          <EyeIcon className="h-4 w-4"/>
        </IconButton>
      </Tooltip>
      {authuser?.role === "admin" && (
        <>
        {item.status !== "verified" && item.status !== "rejected" && (
          <Tooltip content="Edit">
            <IconButton variant="text" size="sm" onClick={() => handleOpenEdit(item)}>
              <PencilIcon className="h-4 w-4"/>
            </IconButton>
          </Tooltip>
        )}
          <Tooltip content="Hapus">
            <IconButton variant="text" color="red" size="sm" onClick={() => deleteUser(item.uuid)}>
              <TrashIcon className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </>
      )}
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
        onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
      />
    );
  };

   const SecureAvatar = ({ src, alt, size, variant, fallback, className }) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      let isMounted = true;
      const fetchImage = async () => {
        try {
          setLoading(true);
          const response = await api.get(src, { responseType: 'blob' });
          if (isMounted) {
            const url = URL.createObjectURL(response.data);
            setImgSrc(url);
          }
        } catch (error) {
          if (isMounted) setImgSrc(null);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
  
      if (src) {
        fetchImage();
      } else {
        setLoading(false);
      }
  
      return () => {
        isMounted = false;
        if (imgSrc) URL.revokeObjectURL(imgSrc);
      };
    }, [src]);
  
    // Jika masih loading atau gambar gagal dimuat (imgSrc null), tampilkan fallback
    if (loading || !imgSrc) {
      return <div className={className}>{fallback}</div>;
    }
  
    // Jika gambar berhasil didapat, render Avatar tanpa children
    return (
      <Avatar 
        src={imgSrc} 
        alt={alt} 
        size={size} 
        variant={variant} 
        className={className} 
      />
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="mb-2 flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
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
            <CardHeader shadow={false} floated={false} className="rounded-none p-4">
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h5" color="blue-gray">Daftar Pengguna</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">Kelola verifikasi dan data anggota P3M</Typography>
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
                  {authuser?.role === "admin" && (
                    <Button onClick={() => setOpenAdd(true)} color="black" className="flex items-center gap-3" size="sm">
                      <UserPlusIcon className="h-4 w-4" /> Tambah User
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Tabs value={filter} className="w-full md:w-max">
                  <TabsHeader>
                    {TABS.map(({ label, value }) => (
                      <Tab key={value} value={value} onClick={() => setFilter(value)} className="whitespace-nowrap px-4">{label}</Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                  <Input 
                    label="Cari User..." 
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
                        <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <Typography variant="small" color="blue-gray" className="font-bold opacity-70 uppercase text-[11px]">{head}</Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((item, index) => {
                      const isLast = index === currentRows.length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                      const info = item.anggotas?.[0] || {};
                      return (
                        <tr key={item.uuid} className="hover:bg-gray-50/50 transition-colors">
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <div className="relative cursor-pointer" onClick={() => info.url && handleOpenPhotoPreview(info.url, info.nama_lengkap || item.username)}>
                                {info.url ? (
                                  <SecureAvatar 
                                    src={info.url} 
                                    size="sm" 
                                    className="border border-gray-200" 
                                    fallback={<UserCircleIcon className="h-24 w-24 text-gray-300" />}
                                  />
                                ) : (
                                  <div className="h-9 w-9 rounded-full bg-blue-gray-50 flex items-center justify-center"><UserCircleIcon className="h-6 w-6 text-blue-gray-300" /></div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <Typography variant="small" color="blue-gray" className="font-bold">{item.username}</Typography>
                                <Typography variant="small" className="font-normal opacity-70 text-[11px]">{item.email}</Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">{info.instansi || "-"}</Typography>
                            <Typography variant="small" className="font-normal opacity-70 text-xs">{info.jabatan || "-"}</Typography>
                          </td>
                          <td className={classes}>
                            <Chip size="sm" variant="ghost" value={item.status} color={item.status === "verified" ? "green" : item.status === "pending" ? "amber" : "red"}  className="text-center"/>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-normal">{item.role}</Typography>
                          </td>
                          <td className={classes}>
                            <ActionButtons item={item} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {currentRows.map((item) => {
                    const info = item.anggotas?.[0] || {};
                    return (
                      <Card key={item.uuid} className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                        <CardBody className="p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div 
                              className="relative cursor-pointer shrink-0"
                              onClick={() => info.url && handleOpenPhotoPreview(info.url, item.username)}
                            >
                              {info.url ? (
                                <SecureAvatar 
                                  src={info.url}
                                  alt={item.username}
                                  className="border border-gray-100" 
                                  fallback={<UserCircleIcon className="h-24 w-24 text-gray-300" />}
                                  />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-gray-50 flex items-center justify-center">
                                  <UserCircleIcon className="h-8 w-8 text-blue-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Typography variant="h6" className="truncate leading-tight">
                                {item.username}
                              </Typography>
                              <Typography variant="small" color="gray" className="truncate text-xs">
                                {item.email}
                              </Typography>
                            </div>
                            <Chip size="sm" variant="ghost" value={item.role} className="rounded-full" />
                          </div>

                          <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-xs">
                              <BuildingOfficeIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span className="truncate">{info.instansi || "Instansi belum diatur"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <BriefcaseIcon className="h-3.5 w-3.5 text-gray-500" />
                              <span className="truncate">{info.jabatan || "Jabatan belum diatur"}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t pt-3">
                            <Chip 
                              size="sm" 
                              variant="ghost"
                              value={item.status} 
                              color={item.status === "verified" ? "green" : item.status === "pending" ? "amber" : "red"} 
                            />
                            <ActionButtons item={item} />
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              )}
              {filteredData.length === 0 && (
                <div className="py-20 text-center">
                  <Typography color="gray">User tidak ditemukan.</Typography>
                </div>
              )}
            </CardBody>

            <CardFooter className="flex flex-wrap items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
              <div className="flex items-center flex-wrap gap-4">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
                  Halaman <b>{currentPage}</b> dari <b>{totalPages || 1}</b>
                </Typography>
                <div className="w-20">
                  <Select label="Baris" value={rowsPerPage.toString()} onChange={(val) => setRowsPerPage(Number(val))} containerProps={{ className: "min-w-[70px]" }}>
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

      {/* Detail Dialog */}
      <Dialog open={open} handler={() => handleOpen(null)} size="md" className="max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader className="flex justify-between items-center border-b border-gray-100">
          <Typography variant="h5" color="blue-gray">Detail Profil Pengguna</Typography>
          <IconButton color="blue-gray" size="sm" variant="text" onClick={() => handleOpen(null)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-4 md:p-6 text-black">
          {selectedUser ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-4">
                {selectedUser.anggotas?.[0]?.url ? (
                  <SecureAvatar 
                    src={selectedUser.anggotas?.[0]?.url} 
                    size="xl" 
                    className="border border-gray-200 h-24 w-24" 
                    fallback={<UserCircleIcon className="h-24 w-24 text-gray-300" />}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-gray-50 flex items-center justify-center">
                    <UserCircleIcon className="h-16 w-16 text-blue-gray-300" />
                  </div>
                )}
                <Typography variant="h6" className="text-center mt-3">
                  {selectedUser.anggotas?.[0]?.nama_lengkap || selectedUser.username}
                </Typography>
                <Chip variant="ghost" size="sm" value={selectedUser.status} color={selectedUser.status === "pending" ? "amber" : selectedUser.status === "verified" ? "green" : "red"} className="mt-2" />
              </div>
              <div className="md:col-span-8 space-y-4">
                <InfoItem icon={<BuildingOfficeIcon className="h-4 w-4" />} label="Instansi" value={selectedUser.anggotas?.[0]?.instansi} />
                <InfoItem icon={<BriefcaseIcon className="h-4 w-4" />} label="Jabatan" value={selectedUser.anggotas?.[0]?.jabatan} />
                <InfoItem icon={<AcademicCapIcon className="h-4 w-4" />} label="Email" value={selectedUser.email} />
                <hr className="my-2 border-gray-100" />
                <div className="grid grid-cols-2 gap-2">
                  <SocialLink label="LinkedIn" value={selectedUser.anggotas?.[0]?.linkedin} />
                  <SocialLink label="Sinta" value={selectedUser.anggotas?.[0]?.sinta} />
                  <SocialLink label="Google Scholar" value={selectedUser.anggotas?.[0]?.google_scholar} />
                  <SocialLink label="Scopus" value={selectedUser.anggotas?.[0]?.scopus} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-4">Memuat data...</div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button color="black" onClick={() => handleOpen(null)} className="capitalize">Tutup</Button>
        </DialogFooter>
      </Dialog>

      {/* Photo Preview Dialog */}
      <Dialog size="md" open={openPhotoPreview} handler={() => setOpenPhotoPreview(false)} className="shadow-2xl overflow-hidden rounded-xl">
        <DialogHeader className="flex justify-between items-center bg-gray-50 py-3 px-5 border-b">
          <Typography variant="h6">Preview Foto Profil</Typography>
          <IconButton variant="text" size="sm" onClick={() => setOpenPhotoPreview(false)}><XMarkIcon className="h-5 w-5" /></IconButton>
        </DialogHeader>
        <DialogBody className="bg-gray-100 flex justify-center p-6">
        <SecureImage 
          src={selectedPhoto.url} 
          alt="Profile"
          className="h-full w-full object-cover" 
        />
        </DialogBody>
      </Dialog>

      <TambahUserAdmin open={openAdd} handler={() => setOpenAdd(false)} refreshData={getUsers} />
      <EditUserComponent open={openEdit} handler={() => setOpenEdit(false)} user={userToEdit} refreshData={getUsers} />
    </div>
  );
}