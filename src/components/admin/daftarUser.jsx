import { useState, useEffect } from "react";
import SidebarAdmin from "./sidebarAdmin";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, Tabs, TabsHeader, Tab, Avatar, IconButton, Tooltip } from "@material-tailwind/react";
import { UserCircleIcon, PencilIcon, UserPlusIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const TABS = [
  { label: "All", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const TABLE_HEAD = ["Member", "Instansi / Jabatan", "Status", "Role", "Actions"];

export default function DaftarUser() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      console.log("STRUKTUR DATA:", response.data[0]);
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  const deleteUser = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      await axios.delete(`http://localhost:5000/users/${uuid}`, { withCredentials: true });
      getUsers();
    }
  };

  const verifyUser = async (uuid) => {
    await axios.patch(`http://localhost:5000/users/${uuid}/verify`, {}, { withCredentials: true });
    getUsers();
  };
  const rejectUser = async (uuid) => {
    await axios.patch(`http://localhost:5000/users/${uuid}/reject`, {}, { withCredentials: true });
    getUsers();
  };

  const filteredRows = users.filter((user) => {
    if (filter === "all") return true;
    return user.status === filter;
  });

  return (
    <div className="flex">
      <SidebarAdmin/>
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">Daftar Pengguna</Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Kelola verifikasi dan data anggota E-Caku
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button className="flex items-center gap-3" size="sm">
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
            <Input label="Cari User" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
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
              
              // Ambil data dari relation Anggota
              const info = (user.anggotas && user.anggotas.length > 0) ? user.anggotas[0] : {};

              return (
                <tr key={user.uuid}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      {info.url && info.url.trim() !== "" ? (
                        <Avatar 
                          src={info.url} 
                          alt={user.username} 
                          size="sm" 
                          variant="circular"
                          onError={(e) => {
                            e.target.src = ""; 
                            e.target.style.display = "none";
                          }}
                        />
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
                    <div className="flex gap-2">
                      {user.status === "pending" && (
                        <>
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
                        </>
                      )}
                      <Tooltip content="Edit">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Hapus">
                        <IconButton variant="text" color="red" onClick={() => deleteUser(user.uuid)}>
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
  );
}