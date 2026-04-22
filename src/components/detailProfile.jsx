import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Drawer,
  Dialog,      // Tambahkan ini
  DialogBody,
} from "@material-tailwind/react";
import { 
  AcademicCapIcon, 
  PencilIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  PhotoIcon
} from "@heroicons/react/24/solid";
import DashboardNavbar from "./dashboardNavbar";
import SidebarAdmin from "./admin/sidebarAdmin";
import SidebarAnggota from "./anggota/sidebarAnggota";
import SidebarHumas from "./admin-humas/sidebarHumas";
import { Link } from "react-router-dom";
import SidebarKetuaForum from "./admin-ketua_forum/sidebarKetuaForum";

export default function DetailProfile() {
  const [user, setUser] = useState(null);
  const [active] = React.useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const handleOpenImage = () => setOpenImage(!openImage);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.get("http://localhost:5000/me", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    getMe();
  }, []);

  if (!user) return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Memuat Data Profil...</span>
    </div>
  );

  const profil = user.anggotas && user.anggotas[0];
  const info = user.anggotas && user.anggotas.length > 0 ? user.anggotas[0] : {};

  // Fungsi untuk render Sidebar berdasarkan role
  const renderSidebar = () => {
    if (user.role === "admin") return <SidebarAdmin />;
    if (user.role === "anggota") return <SidebarAnggota />;
    if (user.role === "humas") return <SidebarHumas />;
    if (user.role === "ketua_forum") return <SidebarKetuaForum />; // Bisa disesuaikan jika ada sidebar khusus ketua forum
    return null;
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        {renderSidebar()}
      </div>

      {/* DRAWER MOBILE */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Navigasi</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        {renderSidebar()}
      </Drawer>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* TOPBAR / NAVBAR */}
        <div className="flex items-center bg-white lg:bg-transparent shrink-0">
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

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex justify-center pb-10">
            <Card className="w-full max-w-5xl shadow-sm border border-gray-100 bg-white rounded-xl">
              <CardBody className="p-5 md:p-10">
                
                {/* Header Profil */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100 mb-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 md:gap-6 text-center sm:text-left">
                    {info.url ? (
                      <Tooltip content="Klik untuk melihat foto penuh">
                        <div 
                          className="relative h-24 w-24 group cursor-pointer" 
                          onClick={handleOpenImage}
                        >
                          <Avatar 
                            src={info.url} 
                            alt={user.username} 
                            className="h-full w-full border-2 border-blue-500 p-0.5" 
                            variant="circular"
                          />
                          
                          {/* Overlay Hover (Muncul saat group di-hover) */}
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PhotoIcon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </Tooltip>
                    ) : (
                      // Jika tidak ada foto
                      <div className="h-24 w-24 rounded-full bg-blue-gray-100 flex items-center justify-center border border-blue-gray-50">
                        <UserCircleIcon className="h-16 w-16 text-blue-gray-400" />
                      </div>
                    )}
                    <div>
                      <Typography variant="h4" color="blue-gray" className="font-bold capitalize text-xl md:text-2xl">
                        {profil?.nama_lengkap}{profil?.gelar ? `, ${profil.gelar}` : ""}
                      </Typography>
                      {!profil?.nama_lengkap && (
                        <Typography variant="h4" color="blue-gray" className="font-bold">{user.username}</Typography>
                      )}
                      <Typography variant="paragraph" color="gray" className="font-medium opacity-70">
                        {profil?.jabatan || user.role}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-end">
                    {user.status === "verified" ? (
                      <Link to="/dashboard/profil/edit" className="w-full sm:w-auto">
                        <Button size="md" className="flex items-center justify-center gap-2 rounded-lg normal-case w-full sm:px-6">
                          <PencilIcon className="h-4 w-4" />
                          Edit Profil
                        </Button>
                      </Link>
                    ) : (
                      <Tooltip content="Akun Anda belum diverifikasi">
                        <div className="w-full sm:w-auto">
                          <Button size="md" className="flex items-center justify-center gap-2 rounded-lg normal-case w-full sm:px-6" disabled>
                            <PencilIcon className="h-4 w-4" />
                            Edit Profil
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Section: Informasi Akun */}
                <div className="border-b border-gray-100 pb-8 mb-8">
                  <Typography variant="h6" color="blue-gray" className="font-bold mb-5 flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    Informasi Akun
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <ReadOnlyField label="Username" value={user.username || "-"} />
                    <ReadOnlyField label="Email" value={user.email || "-"} />
                    <div className="flex flex-wrap gap-4 pt-2">
                        <ReadOnlyField label="Role" value={user.role} isChip color="blue" />
                        <ReadOnlyField label="Status" value={user.status} isChip color={user.status === 'verified' ? 'green' : user.status === 'pending' ? 'amber' : 'red'} />
                    </div>
                  </div>
                </div>

                {/* Section: Detail Personal */}
                <div className="mb-10">
                  <Typography variant="h6" color="blue-gray" className="font-bold mb-6 flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    Detail Personal
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <ReadOnlyField label="Nama Lengkap" value={profil?.nama_lengkap || "-"} />
                    <ReadOnlyField label="Gelar Akademik" value={profil?.gelar || "-"} />
                    <ReadOnlyField label="Jabatan Struktural" value={profil?.jabatan || "-"} />
                    <ReadOnlyField label="Masa Jabatan" value={profil?.masa_jabat || "-"} />
                    <div className="md:col-span-2">
                      <ReadOnlyField label="Instansi / Afiliasi" value={profil?.instansi || "-"} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-8 border-t border-gray-100">
                <div>
                  <Typography variant="h6" color="blue-gray" className="font-semibold mb-5">
                    Tautan Akademik
                  </Typography>
                  <div className="flex items-center gap-6 pt-2">
                    <AcademicLink icon="fab fa-linkedin" label="LinkedIn" href={profil?.linkedin} color="blue" />
                    <AcademicLink icon="fas fa-graduation-cap" label="Google Scholar" href={profil?.google_scholar} color="blue-gray" />
                    <AcademicLink icon="fas fa-book" label="Scopus" href={profil?.scopus} color="deep-orange" />
                    <AcademicLink icon="fas fa-microchip" label="Sinta" href={profil?.sinta} color="green" />
                  </div>
                  <div className="mt-6 text-sm text-gray-500">
                    ID Anggota: <span className="font-mono text-xs">{profil?.uuid || "-"}</span>
                  </div>
                </div>
              </div>

              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <Dialog 
        size="xs" 
        open={openImage} 
        handler={handleOpenImage} 
        // Menghilangkan bg agar hanya fokus ke lingkaran foto
        className="bg-transparent shadow-none flex justify-center items-center overflow-visible"
      >
        <DialogBody className="p-0 flex justify-center items-center overflow-visible">
          <div className="relative group flex justify-center items-center">
            <img
              alt="Foto Profil Full"
              className="h-[80vw] w-[80vw] md:h-96 md:w-96 aspect-square rounded-full object-cover object-center shadow-2xl border-[6px] border-white/30 backdrop-blur-sm"
              src={info.url}
            />
            <IconButton
              color="white"
              size="md"
              variant="text"
              onClick={handleOpenImage}
              className="!absolute -top-2 -right-2 md:top-2 md:right-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-md shadow-xl transition-all duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </IconButton>
            <div className="absolute -bottom-10 left-0 right-0 text-center">
              <Typography variant="h6" color="white" className="drop-shadow-lg font-medium">
                  {user?.username || "Foto Profil"}
              </Typography>
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}

// Komponen Pembantu: Field Read Only
function ReadOnlyField({ label, value, isChip, color }) {
  // Map warna untuk Tailwind class string
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className="w-full">
      <Typography variant="small" color="blue-gray" className="font-bold mb-1.5 opacity-60">
        {label}
      </Typography>
      {isChip ? (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${colorMap[color] || colorMap.blue}`}>
          {value}
        </div>
      ) : (
        <div className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-blue-gray-900 font-medium transition-all">
          {value}
        </div>
      )}
    </div>
  );
}

// Komponen Pembantu: Link Akademik
function AcademicLink({ label, href, color }) {
  const isAvailable = href && href !== "" && href !== "#";
  return (
    <Tooltip content={isAvailable ? `Lihat ${label}` : `${label} belum diisi`}>
      <Typography
        as="a"
        href={isAvailable ? href : "#"}
        target={isAvailable ? "_blank" : "_self"}
        className={`text-2xl transition-all duration-300 ${
          isAvailable 
            ? `text-${color}-600 hover:scale-110 hover:opacity-80` 
            : "text-gray-300 cursor-not-allowed"
        }`}
      >
        <AcademicCapIcon className="h-5 w-5"/>
      </Typography>
    </Tooltip>
  );
}