import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardHeader, Typography, CardBody, 
  IconButton, Avatar, Chip, Tooltip, 
  Button, Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { 
  CalendarDateRangeIcon, NewspaperIcon, UserGroupIcon,
  CheckIcon, XMarkIcon, UserCircleIcon,
  ArrowLongRightIcon, EyeIcon
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import SidebarAdmin from './sidebarAdmin';
import DashboardNavbar from '../dashboardNavbar';
import { Link } from 'react-router-dom';

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
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

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [totalAnggota, setTotalAnggota] = useState(0);
  const [totalAgenda, setTotalAgenda] = useState(0);
  const [totalBerita, setTotalBerita] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    setOpen(!open);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resUsers, resAnggota, resAgenda, resBerita] = await Promise.all([
        axios.get("http://localhost:5000/users", { withCredentials: true }),
        axios.get("http://localhost:5000/anggotas", { withCredentials: true }),
        axios.get("http://localhost:5000/agendas", { withCredentials: true }),
        axios.get("http://localhost:5000/beritas", { withCredentials: true })
      ]);
      setUsers(resUsers.data);
      setTotalAnggota(resAnggota.data.length);
      setTotalAgenda(resAgenda.data.length);
      setTotalBerita(resBerita.data.length);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const verifyUser = async (uuid) => { 
    try {
      await axios.patch(`http://localhost:5000/users/${uuid}/verify`, {}, { withCredentials: true });
      fetchData();
    } catch (error) {
      alert("Gagal memverifikasi user");
    }
  };

  const rejectUser = async (uuid) => { 
    try {
      await axios.patch(`http://localhost:5000/users/${uuid}/reject`, {}, { withCredentials: true });
      fetchData();
    } catch (error) {
      alert("Gagal menolak user");
    }
  };

  const TABLE_HEAD = ["Nama User", "Status", "Actions"];

  const pendingUsers = users.filter(user => user.status === "pending");

  return (
    <div className='flex h-screen w-full bg-gray-50 overflow-hidden'>
      <SidebarAdmin />
      <div className='flex-1 flex flex-col min-w-0 h-full overflow-y-auto'>
        <DashboardNavbar />
        <div className="p-6">
          <div className="mb-6">
            <Typography variant="h4" color="blue-gray">Selamat datang, Admin</Typography>
            <Typography color="gray" className="font-normal">Ringkasan data organisasi hari ini.</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<UserGroupIcon className="h-6 w-6"/>} color="blue" label="Total Anggota" value={totalAnggota} />
            <StatCard icon={<CalendarDateRangeIcon className="h-6 w-6"/>} color="green" label="Total Agenda" value={totalAgenda} />
            <StatCard icon={<NewspaperIcon className="h-6 w-6"/>} color="amber" label="Total Berita" value={totalBerita} />
          </div>

          <Card className="w-full border border-blue-gray-50 shadow-none">
            <CardHeader floated={false} shadow={false} className="flex justify-between items-center rounded-none pb-3 mx-4 mt-4">
              <div>
                <Typography variant="h5" color="blue-gray">Persetujuan Pengguna</Typography>
                <Typography variant="small" color="gray" className="font-normal">Daftar calon anggota yang menunggu verifikasi.</Typography>
              </div>
              <Link to={'/dashboard/pengguna'}>
                <Button variant="outlined" size="sm" className="flex items-center gap-3">
                    Lihat Semua
                    <ArrowLongRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardBody className="overflow-x-auto p-0">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-bold opacity-70">{head}</Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.length > 0 ? (
                    pendingUsers.slice(0, 5).map((user, index) => {
                      const isLast = index === pendingUsers.slice(0, 5).length - 1;
                      const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                      const info = user.anggotas?.[0] || {};

                      return (
                        <tr key={user.uuid}>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              {info.url ? (
                                <Avatar src={info.url} size="sm" variant="circular" />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-blue-gray-50 flex items-center justify-center">
                                  <UserCircleIcon className="h-6 w-6 text-blue-gray-300" />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                  {info.nama_lengkap || user.username}
                                </Typography>
                                <Typography variant="small" className="text-xs opacity-70">{user.email}</Typography>
                              </div>
                            </div>
                          </td>
                          <td className={classes}>
                            <Chip 
                              className='w-max' 
                              size="sm" 
                              variant="ghost" 
                              value={user.status} 
                              color="amber" 
                            />
                          </td>
                          <td className={classes}>
                            <div className="flex gap-2">
                              <Tooltip content="Verifikasi">
                                <IconButton variant="text" color="green" size="sm" onClick={() => verifyUser(user.uuid)}>
                                  <CheckIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Tolak">
                                <IconButton variant="text" color="red" size="sm" onClick={() => rejectUser(user.uuid)}>
                                  <XMarkIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Lihat Profil">
                                <IconButton variant="text" onClick={() => handleOpen(user)}>
                                  <EyeIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center">
                        <Typography variant="small" color="gray" className="italic">
                          Tidak ada pengguna yang menunggu verifikasi.
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </div>
      <Dialog open={open} handler={() => handleOpen(null)} size="md" className="overflow-auto">
              <DialogHeader className="flex justify-between items-center border-b border-gray-100">
                <Typography variant="h5">Detail Profil Pengguna</Typography>
                <IconButton size="sm" variant="text" onClick={() => handleOpen(null)}>
                  <XMarkIcon className="h-5 w-5" />
                </IconButton>
              </DialogHeader>
      
              <DialogBody className="p-6">
                {selectedUser && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 flex flex-col items-center border-r border-gray-100 pr-4">
                      {selectedUser.anggotas?.[0]?.url ? (
                          <Avatar
                              src={selectedUser.anggotas[0].url}
                              alt="profile"
                              size="xxl"
                              className="mb-4 shadow-xl border-2 border-black p-1"
                          />
                      ) : (
                          <UserCircleIcon className="h-24 w-24 text-gray-300 mb-4" />
                      )}
                      
                      <Typography variant="h6" className="text-center leading-tight">
                        {selectedUser.anggotas?.[0]?.nama_lengkap || selectedUser.username}
                      </Typography>
                      <Typography variant="small" color="gray" className="font-normal mb-2 italic">
                        {selectedUser.anggotas?.[0]?.gelar || "-"}
                      </Typography>
                      <Chip
                        variant="ghost"
                        size="sm"
                        value={selectedUser.status}
                        color={selectedUser.status === "verified" ? "green" : selectedUser.status === "pending" ? "amber" : "red"}
                      />
                    </div>
      
                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <InfoItem icon={<BuildingOfficeIcon className="h-4 w-4" />} label="Instansi" value={selectedUser.anggotas?.[0]?.instansi} />
                        <InfoItem 
                          icon={<BriefcaseIcon className="h-4 w-4" />} 
                          label="Jabatan" 
                          value={selectedUser.anggotas?.[0] ? `${selectedUser.anggotas[0].jabatan} (${selectedUser.anggotas[0].masa_jabat || ''})` : "-"} 
                        />
                        <InfoItem icon={<AcademicCapIcon className="h-4 w-4" />} label="Email / Username" value={`${selectedUser.email} / @${selectedUser.username}`} />
                      </div>
      
                      <hr className="my-2 border-gray-100" />
      
                      <Typography variant="small" color="blue-gray" className="font-bold uppercase ">Publikasi & Sosial</Typography>
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
                <Button onClick={() => handleOpen(null)}>Tutup</Button>
              </DialogFooter>
            </Dialog>
    </div>
  );
};

const StatCard = ({ icon, color, label, value }) => (
  <Card className="border border-blue-gray-50 shadow-none">
    <CardBody className="flex items-center gap-4 p-4">
      <IconButton variant="outlined" color={color} size="lg" className="pointer-events-none rounded-full">
        {icon}
      </IconButton>
      <div>
        <Typography variant="small" className="font-medium text-blue-gray-500">{label}</Typography>
        <Typography variant="h4">{value}</Typography>
      </div>
    </CardBody>
  </Card>
);

export default DashboardAdmin;