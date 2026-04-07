import React, { useState, useEffect } from "react";
import SidebarAdmin from "../sidebarAdmin";
import axios from "axios";
import TambahUserAdmin from "./tambahUser";
import EditUserAdmin from "./editUser";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  EyeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import DashboardNavbar from "../../dashboardNavbar";

const TABS = [
  { label: "Semua", value: "all" },
  { label: "Terverifikasi", value: "verified" },
  { label: "Menunggu", value: "pending" },
  { label: "Ditolak", value: "rejected" },
];

const TABLE_HEAD = ["Member", "Instansi / Jabatan", "Status", "Role", "Actions"];

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

export default function DaftarUserAdmin() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleOpenEdit = (user = null) => {
    setUserToEdit(user);
    setOpenEdit(!openEdit);
  };

  const handleOpenAdd = () => setOpenAdd(!openAdd);

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    setOpen(!open);
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

  const filteredRows = users.filter((item) => {
    const info = item.anggotas && item.anggotas.length > 0 ? item.anggotas[0] : {};
    const matchesTab = filter === "all" || item.status === filter;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (info.nama_lengkap || "").toLowerCase().includes(searchLower) ||
      (item.username || "").toLowerCase().includes(searchLower) ||
      (item.email || "").toLowerCase().includes(searchLower);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <div className="flex-1 min-w-0 overflow-auto bg-gray-50">
        <DashboardNavbar />
        <Card className="w-full rounded-none shadow-none">
          <CardHeader shadow={false} floated={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Daftar Pengguna
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Kelola verifikasi dan data anggota P3M
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button onClick={handleOpenAdd} className="flex items-center gap-3" size="sm">
                  <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah User
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Tabs value={filter} className="w-full md:w-max">
                <TabsHeader>
                  {TABS.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => setFilter(value)}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
              <div className="w-full md:w-72">
                <Input
                  label="Cari User"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardBody className="overflow-scroll px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((user, index) => {
                  const isLast = index === filteredRows.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                  const info = user.anggotas && user.anggotas.length > 0 ? user.anggotas[0] : {};

                  return (
                    <tr key={user.uuid}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {info.url ? (
                            <Avatar src={info.url} alt={user.username} size="sm" variant="circular" />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-blue-gray-50 flex items-center justify-center">
                              <UserCircleIcon className="h-6 w-6 text-blue-gray-300" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {info.nama_lengkap || user.username}
                            </Typography>
                            <Typography variant="small" className="font-normal opacity-70">
                              {user.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {info.instansi || "-"}
                          </Typography>
                          <Typography variant="small" className="font-normal opacity-70">
                            {info.jabatan || "-"}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={user.status}
                            color={
                              user.status === "verified" ? "green" : 
                              user.status === "pending" ? "amber" : "red"
                            }
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {user.role}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex gap-1">
                          {user.status === "pending" && (
                            <>
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
                            </>
                          )}
                          <Tooltip content="Lihat Profil">
                            <IconButton variant="text" size="sm" onClick={() => handleOpen(user)}>
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Edit">
                            <IconButton variant="text" size="sm" onClick={() => handleOpenEdit(user)}>
                              <PencilIcon className="h-4 w-4"/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Hapus">
                            <IconButton variant="text" color="red" size="sm" onClick={() => deleteUser(user.uuid)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          
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
      <TambahUserAdmin
        open={openAdd} 
        handler={handleOpenAdd} 
        refreshData={getUsers} 
      />
      <EditUserAdmin 
        open={openEdit} 
        handler={() => setOpenEdit(false)} 
        user={userToEdit} 
        refreshData={getUsers} 
      />
      <Dialog open={open} handler={() => handleOpen(null)} size="md" className="overflow-auto">
        <DialogHeader className="flex justify-between items-center border-b border-gray-100">
          <Typography variant="h5" color="blue-gray">Detail Profil Pengguna</Typography>
          <IconButton color="blue-gray" size="sm" variant="text" onClick={() => handleOpen(null)}>
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
}