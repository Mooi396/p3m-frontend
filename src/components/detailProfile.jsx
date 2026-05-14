import React, { useState, useEffect } from "react";
import api from "../utils/api";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Drawer,
  Dialog,
  DialogBody,
  Spinner,
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

// --- Sub-Component: SecureAvatar ---
const SecureAvatar = ({ src, alt, className, variant, fallback }) => {
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

    if (src) fetchImage();
    else setLoading(false);

    return () => {
      isMounted = false;
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [src]);

  if (loading || !imgSrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-full overflow-hidden border border-gray-200`}>
        {fallback}
      </div>
    );
  }

  return (
    <Avatar 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      variant={variant} 
    />
  );
};

export default function DetailProfile() {
  const [user, setUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const handleOpenImage = () => setOpenImage(!openImage);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    getMe();
  }, []);

  if (!user) return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner color="blue" className="h-8 w-8" />
      <span className="ml-3 text-gray-600 font-medium">Memuat Data Profil...</span>
    </div>
  );

  const profil = user.anggotas && user.anggotas[0];
  const info = user.anggotas && user.anggotas.length > 0 ? user.anggotas[0] : {};

  const renderSidebar = () => {
    switch (user.role) {
      case "admin": return <SidebarAdmin />;
      case "anggota": return <SidebarAnggota />;
      case "humas": return <SidebarHumas />;
      case "ketua_forum": return <SidebarKetuaForum />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <div className="hidden lg:block">
        {renderSidebar()}
      </div>

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
        <div className="flex items-center bg-white lg:bg-transparent shrink-0 shadow-sm lg:shadow-none">
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden ml-4"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex justify-center pb-10">
            <Card className="w-full max-w-5xl shadow-sm border border-gray-100 bg-white rounded-xl">
              <CardBody className="p-5 md:p-10">
                
                {/* Header Profil */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100 mb-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 md:gap-6 text-center sm:text-left">
                    <Tooltip content={info.url ? "Klik untuk melihat foto penuh" : "Foto belum tersedia"}>
                      <div 
                        className="relative h-24 w-24 group cursor-pointer" 
                        onClick={info.url ? handleOpenImage : undefined}
                      >
                        <SecureAvatar 
                          src={info.url}
                          alt={user.username}
                          className="h-full w-full border-2 border-blue-500 p-0.5"
                          variant="circular"
                          fallback={<UserCircleIcon className="h-16 w-16 text-blue-gray-400" />}
                        />
                        {info.url && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PhotoIcon className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                    </Tooltip>
                    
                    <div>
                      <Typography variant="h4" color="blue-gray" className="font-bold capitalize text-xl md:text-2xl">
                        {profil?.nama_lengkap}{profil?.gelar ? `, ${profil.gelar}` : ""}
                      </Typography>
                      {!profil?.nama_lengkap && (
                        <Typography variant="h4" color="blue-gray" className="font-bold">{user.username}</Typography>
                      )}
                      <Typography variant="paragraph" color="gray" className="font-medium opacity-70 uppercase text-xs tracking-wider">
                        {profil?.jabatan || user.role}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-end">
                    <Link to="/dashboard/profil/edit" className={`w-full sm:w-auto ${user.status !== "verified" ? "pointer-events-none" : ""}`}>
                      <Button 
                        size="md" 
                        disabled={user.status !== "verified"}
                        className="flex items-center justify-center gap-2 rounded-lg normal-case w-full sm:px-6"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit Profil
                      </Button>
                    </Link>
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

                {/* Section: Tautan & ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-8 border-t border-gray-100">
                  <div>
                    <Typography variant="h6" color="blue-gray" className="font-semibold mb-5">
                      Tautan Akademik
                    </Typography>
                    <div className="flex items-center gap-6 pt-2">
                      <AcademicLink label="LinkedIn" href={profil?.linkedin} />
                      <AcademicLink label="Google Scholar" href={profil?.google_scholar} />
                      <AcademicLink label="Scopus" href={profil?.scopus} />
                      <AcademicLink label="Sinta" href={profil?.sinta} />
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

      {/* MODAL FOTO FULL */}
      <Dialog 
        size="xs" 
        open={openImage} 
        handler={handleOpenImage} 
        className="bg-transparent shadow-none flex justify-center items-center"
      >
        <DialogBody className="p-0 relative">
          <IconButton
            color="white"
            size="sm"
            variant="text"
            onClick={handleOpenImage}
            className="!absolute -top-10 right-0 bg-white/20 hover:bg-white/40 rounded-full"
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </IconButton>
          <div className="flex justify-center items-center">
            <SecureAvatar 
              src={info.url}
              alt="Foto Profil Full"
              className="h-[80vw] w-[80vw] md:h-96 md:w-96 aspect-square rounded-full object-cover shadow-2xl border-[6px] border-white/30 backdrop-blur-sm"
              variant="circular"
              fallback={<UserCircleIcon className="h-32 w-32 text-gray-300" />}
            />
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}

function ReadOnlyField({ label, value, isChip, color }) {
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
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${colorMap[color] || colorMap.blue}`}>
          {value}
        </div>
      ) : (
        <div className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-blue-gray-900 font-medium">
          {value}
        </div>
      )}
    </div>
  );
}

function AcademicLink({ label, href }) {
  const isAvailable = href && href !== "" && href !== "#";
  
  return (
    <Tooltip content={isAvailable ? `Lihat ${label}` : `${label} belum diisi`}>
      <a
        href={isAvailable ? (href.startsWith("http") ? href : `https://${href}`) : "#"}
        target={isAvailable ? "_blank" : "_self"}
        rel="noreferrer"
        className={`transition-all duration-300 ${
          isAvailable 
            ? `text-blue-600 hover:scale-125 hover:text-blue-800` 
            : "text-gray-300 cursor-not-allowed"
        }`}
      >
        <AcademicCapIcon className="h-7 w-7" />
      </a>
    </Tooltip>
  );
}