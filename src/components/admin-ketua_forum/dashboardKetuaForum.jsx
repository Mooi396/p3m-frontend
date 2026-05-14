import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { 
  Card, CardHeader, Typography, CardBody, 
  IconButton, Avatar, Chip, Button, Dialog,
  DialogHeader, DialogBody, DialogFooter, Drawer, Spinner
} from "@material-tailwind/react";
import { 
  UserGroupIcon, CheckIcon, XMarkIcon, UserCircleIcon,
  ArrowLongRightIcon, DocumentTextIcon, Bars3Icon
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon, BriefcaseIcon, BuildingOfficeIcon, EyeIcon
} from "@heroicons/react/24/outline";
import DashboardNavbar from '../dashboardNavbar';
import { Link } from 'react-router-dom';
import DetailLaporan from './detail/detailLaporan';
import SidebarKetuaForum from './sidebarKetuaForum';

// --- Sub-Components ---

/**
 * Komponen SecureAvatar untuk menangani pengambilan gambar via API 
 * agar tidak mengekspos token di URL dan menghindari error void element.
 */
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

  if (loading || !imgSrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-full overflow-hidden`}>
        {fallback}
      </div>
    );
  }

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

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 p-1 bg-gray-200 rounded text-black">{icon}</div>
    <div>
      <Typography variant="small" color="gray" className="font-normal">{label}</Typography>
      <Typography variant="small" color="blue-gray" className="font-bold">{value || "-"}</Typography>
    </div>
  </div>
);

const SocialLink = ({ label, value }) => (
  <div>
    <Typography variant="small" color="gray" className="font-normal text-[11px]">{label}</Typography>
    <Typography variant="small" className="font-medium text-blue-600 truncate">
      {value ? (
        <a href={value.startsWith("http") ? value : "#"} target="_blank" rel="noreferrer" className="hover:underline">
          {value.length > 20 ? "Lihat Tautan" : value}
        </a>
      ) : ("-")}
    </Typography>
  </div>
);

const StatCard = ({ icon, color, label, value }) => (
  <Card className="border border-blue-gray-50 shadow-sm">
    <CardBody className="flex items-center gap-4 p-4">
      <IconButton variant="outlined" color={color} size="lg" className="pointer-events-none rounded-full">{icon}</IconButton>
      <div>
        <Typography variant="small" className="font-medium text-blue-gray-500">{label}</Typography>
        <Typography variant="h4">{value}</Typography>
      </div>
    </CardBody>
  </Card>
);

const VerificationTable = ({ title, data, link, renderRow }) => (
  <Card className="border border-blue-gray-50 shadow-sm h-full">
    <CardHeader floated={false} shadow={false} className="flex justify-between items-center rounded-none pb-2 mx-4 mt-4">
      <Typography variant="h6" color="blue-gray" className="text-sm sm:text-base">{title}</Typography>
      <Link to={link}>
        <Button variant="text" size="sm" className="flex items-center gap-2">
          Semua <ArrowLongRightIcon className="h-4 w-4" />
        </Button>
      </Link>
    </CardHeader>
    <CardBody className="p-0 overflow-x-auto">
      <table className="w-full min-w-[300px] table-auto text-left">
        <thead>
          <tr>
            {["Data", "Status", "Actions"].map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-3">
                <Typography variant="small" className="font-bold opacity-70 text-[10px] uppercase">{head}</Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.slice(0, 3).map((item, index) => renderRow(item, index === 2 ? "p-3" : "p-3 border-b border-blue-gray-50"))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                <Typography variant="small" color="gray" className="italic text-xs">Kosong</Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </CardBody>
  </Card>
);

// --- Main Component ---
const DashboardKetuaForum = () => {
  const [users, setUsers] = useState([]);
  const [laporans, setLaporans] = useState([]);
  const [totals, setTotals] = useState({ user: 0, laporan: 0 });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDetailLaporan, setOpenDetailLaporan] = useState(false);
  const [userMe, setUserMe] = useState(null);

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    setOpen(!open);
  };

  const fetchData = useCallback(async () => {
    try {
      const [resUsers, resLaporan] = await Promise.all([
        api.get('/users'),
        api.get('/laporans')
      ]);
      
      const anggotaOnly = resUsers.data.filter(u => u.role === "anggota");
      
      setUsers(anggotaOnly);
      setLaporans(resLaporan.data);
      setTotals({
        user: anggotaOnly.length,
        laporan: resLaporan.data.length
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }, []);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await api.get('/me');
        setUserMe(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    getMe();
    fetchData();
  }, [fetchData]);

  const handleAction = async (type, uuid, action) => {
    if(!window.confirm(`Yakin ingin melakukan verifikasi?`)) return;
    try {
      await api.patch(`/${type}/${uuid}/${action}`);
      fetchData();
    } catch (error) {
      alert(`Gagal melakukan aksi pada ${type}`);
    }
  };

  return (
    <div className='flex h-screen w-full bg-gray-50 overflow-hidden'>
      <div className="hidden lg:block">
        <SidebarKetuaForum />
      </div>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Typography variant="h5" color="blue-gray">Ketua Forum</Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <SidebarKetuaForum />
      </Drawer>

      <div className='flex-1 flex flex-col min-w-0 h-full overflow-hidden'>
        <div className="flex items-center bg-white lg:bg-transparent shadow-sm lg:shadow-none">
          <IconButton 
            variant="text" 
            color="blue-gray" 
            className="lg:hidden ml-2" 
            onClick={() => setIsDrawerOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex-1">
            <DashboardNavbar />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <Typography variant="h4" color="blue-gray" className="text-2xl capitalize">
              Selamat datang, {userMe?.username}
            </Typography>
            <Typography color="gray" className="font-normal text-sm">
              Panel manajemen forum hari ini.
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <StatCard icon={<UserGroupIcon className="h-6 w-6"/>} color="blue" label="Total Anggota" value={totals.user} />
            <StatCard icon={<DocumentTextIcon className="h-6 w-6"/>} color="red" label="Total Laporan" value={totals.laporan} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            <VerificationTable 
              title="Persetujuan Anggota Forum" 
              data={users.filter(u => u.status === "pending")}
              link="/dashboard/pengguna"
              renderRow={(user, classes) => (
                <tr key={user.uuid}>
                  <td className={classes}>
                    <div className="flex items-center gap-2">
                      <SecureAvatar 
                        src={user.anggotas?.[0]?.url} 
                        size="xs" 
                        variant="circular" 
                        className="h-8 w-8"
                        fallback={<UserCircleIcon className="h-6 w-6 text-gray-300"/>}
                      />
                      <Typography variant="small" className="font-bold text-xs truncate w-24">{user.username}</Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Chip size="sm" variant="ghost" value="pending" color="amber" className="text-[10px]"/>
                  </td>
                  <td className={classes}>
                    <div className="flex gap-0">
                      <IconButton variant="text" size="sm" onClick={() => handleOpen(user)}><EyeIcon className="h-4 w-4"/></IconButton>
                      <IconButton variant="text" color="green" size="sm" onClick={() => handleAction('users', user.uuid, 'verify')}><CheckIcon className="h-4 w-4"/></IconButton>
                      <IconButton variant="text" color="red" size="sm" onClick={() => handleAction('users', user.uuid, 'reject')}><XMarkIcon className="h-4 w-4"/></IconButton>
                    </div>
                  </td>
                </tr>
              )}
            />

            <VerificationTable 
              title="Laporan Menunggu" 
              data={laporans.filter(l => l.status === "pending")}
              link="/dashboard/laporan"
              renderRow={(laporan, classes) => (
                <tr key={laporan.uuid}>
                  <td className={classes}>
                    <Typography variant="small" className="font-bold truncate w-32 sm:w-48 text-xs">{laporan.keterangan}</Typography>
                  </td>
                  <td className={classes}>
                    <Chip size="sm" variant="ghost" value="pending" color="amber" className="text-[10px]"/>
                  </td>
                  <td className={classes}>
                    <IconButton variant="text" size="sm" onClick={() => { setSelectedItem(laporan); setOpenDetailLaporan(true); }}><EyeIcon className="h-4 w-4"/></IconButton>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>

      <Dialog open={open} handler={() => handleOpen(null)} size="md" className="max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader className="flex justify-between items-center border-b p-4">
          <Typography variant="h5" color="blue-gray">Detail Profil Anggota</Typography>
          <IconButton size="sm" variant="text" color="blue-gray" onClick={() => handleOpen(null)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-4 lg:p-6">
          {selectedUser ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-4">
                <SecureAvatar 
                  src={selectedUser.anggotas?.[0]?.url} 
                  size="xxl" 
                  className="mb-4 shadow-xl border-2 border-black p-1 h-32 w-32" 
                  fallback={<UserCircleIcon className="h-24 w-24 text-gray-300" />}
                />
                <Typography variant="h6" className="text-center text-blue-gray-900">{selectedUser.anggotas?.[0]?.nama_lengkap || selectedUser.username}</Typography>
                <Typography variant="small" color="gray" className="italic mb-2 text-center">{selectedUser.anggotas?.[0]?.gelar || "-"}</Typography>
                <Chip variant="ghost" size="sm" value={selectedUser.status} color={selectedUser.status === "verified" ? "green" : "amber"} />
              </div>
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <InfoItem icon={<BuildingOfficeIcon className="h-4 w-4" />} label="Instansi" value={selectedUser.anggotas?.[0]?.instansi} />
                  <InfoItem icon={<BriefcaseIcon className="h-4 w-4" />} label="Jabatan" value={selectedUser.anggotas?.[0]?.jabatan} />
                  <InfoItem icon={<AcademicCapIcon className="h-4 w-4" />} label="Email" value={selectedUser.email} />
                </div>
                <hr className="my-2" />
                <Typography variant="small" color="blue-gray" className="font-bold uppercase text-[10px] tracking-wider text-gray-500">Publikasi & Sosial</Typography>
                <div className="grid grid-cols-2 gap-2">
                  <SocialLink label="LinkedIn" value={selectedUser.anggotas?.[0]?.linkedin} />
                  <SocialLink label="Sinta ID" value={selectedUser.anggotas?.[0]?.sinta} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center py-10">
              <Spinner className="h-8 w-8" />
            </div>
          )}
        </DialogBody>
        <DialogFooter className="p-4 border-t gap-2">
          <Button variant="gradient" color="blue-gray" onClick={() => handleOpen(null)} className="capitalize">Tutup</Button>
        </DialogFooter>
      </Dialog>

      <DetailLaporan open={openDetailLaporan} handler={() => setOpenDetailLaporan(false)} laporan={selectedItem} />
    </div>
  );
};

export default DashboardKetuaForum;