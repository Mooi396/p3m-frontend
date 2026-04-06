import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
  Input,
  Tooltip,
} from "@material-tailwind/react";
import { AcademicCapIcon, PencilIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import DashboardNavbar from "./dashboardNavbar";
import SidebarAdmin from "./admin/sidebarAdmin";
import SidebarAnggota from "./anggota/sidebarAnggota";
import { Link } from "react-router-dom";

export default function DetailProfile() {
  const [user, setUser] = useState(null);
  const [active, setActive] = React.useState(1);

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

  if (!user) return <div className="p-6 text-center text-gray-600">Memuat Data Profil...</div>;

  const profil = user.anggotas && user.anggotas[0];

  const info = user.anggotas && user.anggotas.length > 0 ? user.anggotas[0] : {};

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
        { user.role === "admin" ? <SidebarAdmin /> : user.role === "anggota" && <SidebarAnggota /> }
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <DashboardNavbar />

        <div className="p-8 flex justify-center">
          <Card className="w-full max-w-6xl shadow-sm border border-gray-100 bg-white rounded-lg">
            <CardBody className="p-10">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100 mb-8">
                <div className="flex items-center gap-6">
                  {info.url ? (
                        <Avatar src={info.url} alt={user.username} size="sm" variant="circular" />
                        ) : (
                        <div className="h-24 w-24 rounded-full bg-blue-gray-50 flex items-center justify-center">
                        <UserCircleIcon className="h-18 w-18" />
                        </div>
                    )}
                  <div>
                    <Typography variant="h4" color="blue-gray" className="font-bold capitalize">
                      {profil?.nama_lengkap}{profil?.gelar ? `, ${profil.gelar}` : `${user.username}`}
                    </Typography>
                    <Typography variant="paragraph" color="gray" className="font-medium">
                      {profil?.jabatan || user.role}
                    </Typography>
                  </div>
                </div>
                {user.status === "verified" ? (
                  <Link to="/dashboard/profil/edit">
                  <Button size="sm" className="flex items-center gap-2 rounded-full normal-case px-6 py-2.5">
                    <PencilIcon className="h-4 w-4" />
                    Edit Profil
                  </Button>
                  </Link>
                ) : (
                <Tooltip content="Tidak memiliki akses">
                    <div className="w-max">
                        <Button size="sm" className="flex items-center gap-2 rounded-full normal-case px-6 py-2.5" disabled={active === 1}>
                            <PencilIcon className="h-4 w-4" />
                            Edit Profil
                        </Button>
                    </div>
                </Tooltip>
                )}
              </div>
                <div className="border-b border-gray-100 pb-10 mb-10">
                  <Typography variant="h6" color="blue-gray" className="font-semibold mb-5">
                    Informasi Akun
                  </Typography>
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <ReadOnlyField label="Role" value={user.role} isChip color="blue" />
                      <ReadOnlyField label="Status" value={user.status} isChip color={user.status === 'verified' ? 'green' : user.status === 'pending' ? 'amber' : 'red'} />
                    </div>
                    <ReadOnlyField label="Email" value={user.email || "-"} />
                    <ReadOnlyField label="Username" value={user.username || "-"} />
                  </div>
                </div>
              <div className="mb-10">
                <Typography variant="h5" color="blue-gray" className="font-semibold mb-6">
                  Detail Personal
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ReadOnlyField label="Nama Lengkap" value={profil?.nama_lengkap || "-"} />
                  <ReadOnlyField label="Gelar" value={profil?.gelar || "-"} />

                  <ReadOnlyField label="Jabatan" value={profil?.jabatan || "-"} />
                  <ReadOnlyField label="Masa Jabatan" value={profil?.masa_jabat || "-"} />

                  <div className="md:col-span-2">
                    <ReadOnlyField label="Instansi" value={profil?.instansi || "-"} />
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
                    <AcademicLink icon="fas fa-book" label="Scopus" href={profil?.scopus ? `https://www.scopus.com/authid/detail.uri?authorId=${profil.scopus}` : null} color="deep-orange" />
                    <AcademicLink icon="fas fa-microchip" label="Sinta" href={profil?.sinta ? `https://sinta.kemdikbud.go.id/authors/profile/${profil.sinta}` : null} color="green" />
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
  );
}

function ReadOnlyField({ label, value, isChip, color }) {
  return (
    <div className="w-full">
      <Typography variant="small" color="blue-gray" className="font-medium mb-1.5 text-gray-700">
        {label}
      </Typography>
      {isChip ? (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase bg-${color}-50 text-${color}-700 border border-${color}-100`}>
          {value}
        </div>
      ) : (
        <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-sm text-gray-900 shadow-inner font-normal">
          {value}
        </div>
      )}
    </div>
  );
}

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