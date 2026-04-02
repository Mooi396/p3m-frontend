import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardHeader, Typography, CardBody, 
  IconButton, Avatar, Chip, Tooltip, 
  Button
} from "@material-tailwind/react";
import { 
  CalendarDateRangeIcon, NewspaperIcon, UserGroupIcon,
  CheckIcon, XMarkIcon, PencilIcon, TrashIcon, UserCircleIcon,
  ArrowLongRightIcon
} from "@heroicons/react/24/solid";
import SidebarAdmin from './sidebarAdmin';
import DashboardNavbar from '../dashboardNavbar';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [totalAnggota, setTotalAnggota] = useState(0);
  const [totalAgenda, setTotalAgenda] = useState(0);
  const [totalBerita, setTotalBerita] = useState(0);

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
    await axios.patch(`http://localhost:5000/users/${uuid}/verify`, {}, { withCredentials: true });
    fetchData();
  };

  const rejectUser = async (uuid) => { 
    await axios.patch(`http://localhost:5000/users/${uuid}/reject`, {}, { withCredentials: true });
    fetchData();
  };

  const deleteUser = async (uuid) => { 
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      await axios.delete(`http://localhost:5000/users/${uuid}`, { withCredentials: true });
      fetchData();
    }
  };

  const TABLE_HEAD = ["Member", "Instansi / Jabatan", "Status", "Role", "Actions"];

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
              <Typography variant="h5" color="blue-gray">Pengguna Terbaru</Typography>
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
                  {users.slice(0, 5).map((user, index) => {
                    const isLast = index === users.slice(0, 5).length - 1;
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
                              <Typography variant="small" color="blue-gray" className="font-bold">{info.nama_lengkap || user.username}</Typography>
                              <Typography variant="small" className="font-normal opacity-70">{user.email}</Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant="small">{info.instansi || "-"}</Typography>
                          <Typography variant="small" className="opacity-70">{info.jabatan || "-"}</Typography>
                        </td>
                        <td className={classes}>
                          <Chip className='w-max' size="sm" variant="ghost" value={user.status} color={user.status === "verified" ? "green" : "amber"} />
                        </td>
                        <td className={classes}>
                          <Typography variant="small">{user.role}</Typography>
                        </td>
                        <td className={classes}>
                          {user.status === "pending" && (
                              <div className="flex gap-2">
                                <Tooltip content="Verifikasi">
                                  <IconButton variant="text" color="green" onClick={() => verifyUser(user.uuid)}>
                                      <CheckIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip content="Tolak">
                                  <IconButton variant="text" color="red" onClick={() => rejectUser(user.uuid)}>
                                      <XMarkIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                          )}
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
        <Typography variant="h4" color="blue-gray">{value}</Typography>
      </div>
    </CardBody>
  </Card>
);

export default DashboardAdmin;