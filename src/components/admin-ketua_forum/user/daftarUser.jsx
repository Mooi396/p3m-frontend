import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../admin/sidebarAdmin";
import axios from "axios";
import TambahUserAdmin from "./tambahUser";
import EditUserComponent from "./editUser";
import { MagnifyingGlassIcon, PhotoIcon } from "@heroicons/react/24/outline";
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
  Drawer
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  MagnifyingGlassPlusIcon,
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
        <a
          href={value.startsWith("http") ? value : "#"}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          {value.length > 20 ? "Lihat Tautan" : value}
        </a>
      ) : (
        "-"
      )}
    </Typography>
  </div>
);

export default function DaftarUserAdmin() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openPhotoPreview, setOpenPhotoPreview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState({ url: "", name: "" });

  const { user: authuser } = useSelector((state) => state.auth);

  const handleOpenPhotoPreview = (url = "", name = "") => {
    setSelectedPhoto({ url, name });
    setOpenPhotoPreview(!openPhotoPreview);
  };

  const handleOpenEdit = (userData = null) => {
    setUserToEdit(userData);
    setOpenEdit(!openEdit);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const handleOpenAdd = () => setOpenAdd(!openAdd);

  const handleOpen = (userData = null) => {
    setSelectedUser(userData);
    setOpen(!open);
  };

  const handleTogglePhoto = () => {
    setOpenPhotoPreview(!openPhotoPreview);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  const deleteUser = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await axios.delete(`http://localhost:5000/users/${uuid}`, {
          withCredentials: true,
        });
        getUsers();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  const verifyUser = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/users/${uuid}/verify`, {}, { withCredentials: true });
      getUsers();
    } catch (error) {
      console.error("Gagal verifikasi:", error);
    }
  };

  const rejectUser = async (uuid) => {
    try {
      await axios.patch(`http://localhost:5000/users/${uuid}/reject`, {}, { withCredentials: true });
      getUsers();
    } catch (error) {
      console.error("Gagal menolak:", error);
    }
  };

  const cancelVerifyUser = async (uuid) => {
    if (window.confirm("Batalkan verifikasi? User ini akan kembali ke status Pending.")) {
      try {
        await axios.patch(`http://localhost:5000/users/${uuid}/cancel-verify`, {}, { withCredentials: true });
        getUsers();
      } catch (error) {
        alert("Gagal membatalkan verifikasi");
      }
    }
  };
  
  const cancelRejectUser = async (uuid) => {
    if (window.confirm("Batalkan penolakan? User ini akan kembali ke status Pending")) {
      try {
        await axios.patch(`http://localhost:5000/users/${uuid}/cancel-reject`, {}, { withCredentials: true });
        getUsers();
      } catch (error) {
        alert("Gagal membatalkan penolakan");
      }
    }
  };

  const filteredRows = users.filter((item) => {
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR */}
      <div className="hidden lg:block">
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
      </div>

      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="p-0">
        <div className="mb-2 flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {authuser?.role === "admin" ? <SidebarAdmin /> : <SidebarKetuaForum />}
      </Drawer>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex items-center bg-white lg:bg-transparent px-4 py-1">
          <IconButton variant="text" color="blue-gray" className="lg:hidden mr-2" onClick={openDrawer}>
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Card className="w-full shadow-md border border-gray-200 rounded-xl">
            <CardHeader shadow={false} floated={false} className="rounded-none p-4">
              <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h5" color="blue-gray">Daftar {authuser?.role === "admin" ? "Pengguna" : "Anggota Forum"}</Typography>
                  <Typography color="gray" className="mt-1 font-normal text-sm">Kelola verifikasi dan data anggota P3M</Typography>
                </div>
                {authuser?.role === "admin" && (
                  <Button onClick={handleOpenAdd} color="black" className="flex items-center gap-3 w-full sm:w-auto justify-center" size="sm">
                    <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah User
                  </Button>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Tabs value={filter} className="w-full md:w-max overflow-x-auto">
                  <TabsHeader>
                    {TABS.map(({ label, value }) => (
                      <Tab key={value} value={value} onClick={() => setFilter(value)} className="whitespace-nowrap px-4">{label}</Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                  <Input label="Cari User..." icon={<MagnifyingGlassIcon className="h-5 w-5" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </CardHeader>

            <CardBody className="overflow-x-auto px-0 pt-0">
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
                  {filteredRows.map((item, index) => {
                    const isLast = index === filteredRows.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                    const info = item.anggotas && item.anggotas.length > 0 ? item.anggotas[0] : {};

                    return (
                      <tr key={item.uuid} className="hover:bg-gray-50/50 transition-colors">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Tooltip content="Klik untuk lihat foto penuh">
                              <div 
                                className="relative cursor-pointer group shrink-0" 
                                onClick={() => info.url && handleOpenPhotoPreview(info.url, info.nama_lengkap || item.username)}
                              >
                                {/* Ikon Indikator yang muncul saat Hover */}
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <MagnifyingGlassPlusIcon className="h-4 w-4 text-white" />
                                </div>

                                {info.url ? (
                                  <Avatar 
                                    src={info.url} 
                                    alt={item.username} 
                                    size="sm" 
                                    variant="circular" 
                                    className="border border-gray-200" 
                                  />
                                ) : (
                                  <div className="h-9 w-9 rounded-full bg-blue-gray-50 flex items-center justify-center">
                                    <UserCircleIcon className="h-6 w-6 text-blue-gray-300" />
                                  </div>
                                )}
                              </div>
                            </Tooltip>
                            <div className="flex flex-col">
                              <Typography variant="small" color="blue-gray" className="font-bold leading-tight">
                                {info.nama_lengkap || item.username}
                              </Typography>
                              <Typography variant="small" className="font-normal opacity-70 text-[11px]">
                                {item.email}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="font-normal">{info.instansi || "-"}</Typography>
                            <Typography variant="small" className="font-normal opacity-70 text-xs">{info.jabatan || "-"}</Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Chip variant="ghost" size="sm" value={item.status} color={item.status === "verified" ? "green" : item.status === "pending" ? "amber" : "red"} />
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">{item.role}</Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex gap-1">
                            {item.status === "verified" && (
                              <IconButton variant="text" color="amber" size="sm" onClick={() => cancelVerifyUser(item.uuid)}><ArrowPathIcon className="h-4 w-4" /></IconButton>
                            )}
                            {item.status === "rejected" && (
                              <IconButton variant="text" color="amber" size="sm" onClick={() => cancelRejectUser(item.uuid)}><ArrowPathIcon className="h-4 w-4" /></IconButton>
                            )}
                            {item.status === "pending" && (
                              <>
                                <IconButton variant="text" color="green" size="sm" onClick={() => verifyUser(item.uuid)}><CheckIcon className="h-4 w-4" /></IconButton>
                                <IconButton variant="text" color="red" size="sm" onClick={() => rejectUser(item.uuid)}><XMarkIcon className="h-4 w-4" /></IconButton>
                              </>
                            )}
                            <IconButton variant="text" size="sm" onClick={() => handleOpen(item)}><EyeIcon className="h-4 w-4"/></IconButton>
                            {authuser?.role === "admin" && (
                              <>
                                <IconButton variant="text" size="sm" onClick={() => handleOpenEdit(item)}><PencilIcon className="h-4 w-4"/></IconButton>
                                <IconButton variant="text" color="red" size="sm" onClick={() => deleteUser(item.uuid)}><TrashIcon className="h-4 w-4" /></IconButton>
                              </>
                            )}
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
      {/* MODAL DETAIL PROFIL USER */}
      <Dialog open={open} handler={() => handleOpen(null)} size="md" className="max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader className="flex justify-between items-center border-b border-gray-100">
          <Typography variant="h5" color="blue-gray">Detail Profil Pengguna</Typography>
          <IconButton color="blue-gray" size="sm" variant="text" onClick={() => handleOpen(null)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-4 md:p-6">
          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-4">
                <div className="cursor-pointer" onClick={() => selectedUser.anggotas?.[0]?.url && handleOpenPhotoPreview(selectedUser.anggotas[0].url, selectedUser.anggotas[0].nama_lengkap || selectedUser.username)}>
                  {selectedUser.anggotas?.[0]?.url ? (
                    <Avatar src={selectedUser.anggotas[0].url} alt="profile" size="xxl" className="mb-4 shadow-xl border-2 border-black p-1" />
                  ) : (
                    <UserCircleIcon className="h-24 w-24 text-gray-300 mb-4" />
                  )}
                </div>
                <Typography variant="h6" className="text-center leading-tight">{selectedUser.anggotas?.[0]?.nama_lengkap || selectedUser.username}</Typography>
                <Typography variant="small" color="gray" className="font-normal mb-2 italic">{selectedUser.anggotas?.[0]?.gelar || "-"}</Typography>
                <Chip variant="ghost" size="sm" value={selectedUser.status} color={selectedUser.status === "verified" ? "green" : "amber"} />
              </div>
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem icon={<BuildingOfficeIcon className="h-4 w-4" />} label="Instansi" value={selectedUser.anggotas?.[0]?.instansi} />
                  <InfoItem icon={<BriefcaseIcon className="h-4 w-4" />} label="Jabatan" value={selectedUser.anggotas?.[0] ? `${selectedUser.anggotas[0].jabatan} (${selectedUser.anggotas[0].masa_jabat || ''})` : "-"} />
                  <InfoItem icon={<AcademicCapIcon className="h-4 w-4" />} label="Email / Username" value={`${selectedUser.email} / @${selectedUser.username}`} />
                </div>
                <hr className="my-2 border-gray-100" />
                <Typography variant="small" color="blue-gray" className="font-bold uppercase text-[10px]">Publikasi & Sosial</Typography>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <SocialLink label="LinkedIn" value={selectedUser.anggotas?.[0]?.linkedin} />
                  <SocialLink label="Sinta ID" value={selectedUser.anggotas?.[0]?.sinta} />
                  <SocialLink label="Google Scholar" value={selectedUser.anggotas?.[0]?.google_scholar} />
                  <SocialLink label="Scopus ID" value={selectedUser.anggotas?.[0]?.scopus} />
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button color="black" onClick={() => handleOpen(null)}>Tutup</Button>
        </DialogFooter>
      </Dialog>

      <Dialog 
        size="md" 
        open={openPhotoPreview} 
        handler={handleTogglePhoto} // Panggil handler spesifik foto
        className="shadow-2xl overflow-hidden ..."
      >
        <DialogHeader className="flex shrink-0 justify-between items-center border-b border-gray-100 bg-gray-50 py-3 px-5">
          <div className="flex flex-col min-w-0">
            <Typography variant="h6" color="blue-gray" className="leading-tight text-sm md:text-base">
              Foto Profil Member
            </Typography>
            <Typography variant="small" color="gray" className="font-normal truncate max-w-[200px] sm:max-w-[400px] text-xs italic">
              {selectedPhoto.name}
            </Typography>
          </div>
          <IconButton 
            variant="text" 
            color="blue-gray" 
            onClick={(e) => {
              e.stopPropagation(); // Mencegah bubbling event ke dialog di bawahnya
              handleTogglePhoto();
            }} 
            size="sm"
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody className="p-0 bg-gray-100 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center p-4 min-h-[300px] w-full">
            <img
              alt="Profile Preview"
              className="max-h-[60vh] w-auto h-auto rounded-xl shadow-xl object-contain bg-white border-4 border-white"
              src={selectedPhoto.url}
            />
          </div>
          <div className="bg-white p-4 border-t border-gray-100 w-full sticky bottom-0">
            <div className="flex items-center gap-2">
              <PhotoIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <Typography variant="small" color="blue-gray" className="font-mono text-[10px] md:text-[11px] truncate">
                {selectedPhoto.url.split('/').pop()}
              </Typography>
            </div>
          </div>
        </DialogBody>
      </Dialog>

      <TambahUserAdmin open={openAdd} handler={handleOpenAdd} refreshData={getUsers} />
      <EditUserComponent open={openEdit} handler={() => setOpenEdit(false)} user={userToEdit} refreshData={getUsers} />
    </div>
  );
}