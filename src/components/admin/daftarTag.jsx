import { useState, useEffect } from "react";
import SidebarAdmin from "./sidebarAdmin"; 
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { 
  Card, CardHeader, Input, Typography, Button, CardBody, 
  IconButton, Tooltip, Dialog, DialogHeader, DialogBody, DialogFooter 
} from "@material-tailwind/react";
import { PencilIcon, PlusIcon, TrashIcon, TagIcon } from "@heroicons/react/24/solid";

const TABLE_HEAD = ["Nama Tag", "UUID", "Actions"];

export default function DaftarTagAdmin() {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUuid, setCurrentUuid] = useState("");
  const [namaTag, setNamaTag] = useState("");

  useEffect(() => {
    getTags();
  }, []);

  const getTags = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tag", {
        withCredentials: true,
      });
      setTags(response.data);
    } catch (error) {
      console.error("Gagal mengambil data tag:", error);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    if(open) {
        setNamaTag("");
        setIsEdit(false);
        setCurrentUuid("");
    }
  };

  const handleEdit = (tag) => {
    setIsEdit(true);
    setCurrentUuid(tag.uuid);
    setNamaTag(tag.nama_tag);
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.patch(`http://localhost:5000/tag/${currentUuid}`, { nama_tag: namaTag }, { withCredentials: true });
      } else {
        await axios.post("http://localhost:5000/tag", { nama_tag: namaTag }, { withCredentials: true });
      }
      getTags();
      handleOpen();
    } catch (error) {
      alert(error.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  const deleteTag = async (uuid) => {
    if (window.confirm("Yakin ingin menghapus tag ini?")) {
      try {
        await axios.delete(`http://localhost:5000/tag/${uuid}`, { withCredentials: true });
        getTags();
      } catch (error) {
        alert(error.response?.data?.msg || "Gagal menghapus");
      }
    }
  };

  const filteredRows = tags.filter((item) =>
    item.nama_tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <div className="flex-1 min-w-0 overflow-auto">
      <Card className="w-full rounded-none shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">Manajemen Tag Berita</Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Kelola kategori atau label untuk pengelompokan berita
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3" size="sm" onClick={handleOpen}>
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah Tag
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-end gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input 
                label="Cari Nama Tag..." 
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
              {filteredRows.map((tag, index) => {
                const isLast = index === filteredRows.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={tag.uuid}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <TagIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {tag.nama_tag}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-mono text-gray-500">
                        {tag.uuid}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        <Tooltip content="Edit Tag">
                          <IconButton variant="text" onClick={() => handleEdit(tag)}>
                            <PencilIcon className="h-4 w-4 text-blue-500" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Hapus Tag">
                          <IconButton variant="text" color="red" onClick={() => deleteTag(tag.uuid)}>
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
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>{isEdit ? "Update Tag" : "Tambah Tag Baru"}</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
            <Input 
                label="Nama Tag" 
                value={namaTag} 
                onChange={(e) => setNamaTag(e.target.value)} 
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            <span>Batal</span>
          </Button>
          <Button onClick={handleSubmit}>
            <span>{isEdit ? "Simpan Perubahan" : "Simpan"}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}