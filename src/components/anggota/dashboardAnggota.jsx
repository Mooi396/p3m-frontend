import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Tooltip,
  Button,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import { 
  EyeIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon 
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import SidebarAnggota from "./sidebarAnggota";
import DashboardNavbar from "../dashboardNavbar";

export default function DashboardAnggota() {
  const [user, setUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        <Typography color="gray" className="font-medium">Memuat Dashboard...</Typography>
      </div>
    </div>
  );

  const profil = user.anggotas && user.anggotas[0];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        <SidebarAnggota />
      </div>

      {/* DRAWER MOBILE */}
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Menu Anggota</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <SidebarAnggota />
      </Drawer>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* NAVBAR */}
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

        {/* MAIN CONTENT Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex justify-center pb-10">
            <Card className="w-full max-w-5xl shadow-sm border border-gray-100 bg-white rounded-xl">
              <CardBody className="p-6 md:p-10">
                
                {/* Header Profil */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100 mb-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
                    {profil?.url ? (
                      <Avatar
                        src={profil.url}
                        alt="foto-profil"
                        size="xl"
                        variant="circular"
                        className="border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                        <UserCircleIcon className="h-14 w-14 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <Typography variant="h4" color="blue-gray" className="font-bold text-xl md:text-2xl">
                        {profil?.nama_lengkap}{profil?.gelar ? `, ${profil.gelar}` : ""}
                        {!profil?.nama_lengkap && user.username}
                      </Typography>
                      <Typography variant="paragraph" color="gray" className="font-medium opacity-70">
                        {profil?.jabatan || "Anggota Forum"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Link to="/dashboard/profil" className="w-full sm:w-auto">
                      <Tooltip content="Lihat Detail Profil">
                        <Button 
                          color="black" // Mengganti blue ke black
                          size="md" 
                          className="flex items-center justify-center gap-2 rounded-lg normal-case w-full sm:px-6 shadow-none hover:shadow-md"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Lihat Detail
                        </Button>
                      </Tooltip>
                    </Link>
                  </div>
                </div>

                {/* Dashboard Stats / Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <Typography variant="h6" color="blue-gray" className="font-bold mb-5 flex items-center gap-2">
                      <div className="h-2 w-2 bg-black rounded-full"></div>
                      Informasi Akun
                    </Typography>
                    <div className="space-y-5">
                      <div className="flex flex-wrap gap-4">
                        <ReadOnlyField label="Role" value={user.role} isChip color="gray" />
                        <ReadOnlyField 
                          label="Status" 
                          value={user.status} 
                          isChip 
                          color={user.status === 'verified' ? 'green' : user.status === 'pending' ? 'amber' : 'red'} 
                        />
                      </div>
                      <ReadOnlyField label="Email Terdaftar" value={user.email || "-"} />
                      <ReadOnlyField label="ID Pengguna" value={user.username || "-"} />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center">
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                      Halo, {user.username}!
                    </Typography>
                    <Typography variant="small" color="gray" className="leading-relaxed">
                      Selamat datang di dashboard Anggota P3M. Di sini Anda dapat memantau status verifikasi akun Anda dan mengakses data personal. Pastikan data profil Anda selalu diperbarui.
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Helper Field
function ReadOnlyField({ label, value, isChip, color }) {
  const colorMap = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className="w-full">
      <Typography variant="small" color="blue-gray" className="font-bold mb-1.5 opacity-60 text-[11px] uppercase tracking-wider">
        {label}
      </Typography>
      {isChip ? (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${colorMap[color] || colorMap.gray}`}>
          {value}
        </div>
      ) : (
        <div className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-blue-gray-900 font-medium shadow-sm">
          {value}
        </div>
      )}
    </div>
  );
}