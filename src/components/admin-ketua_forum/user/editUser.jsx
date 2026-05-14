import React, { useState, useEffect } from "react";
// Menggunakan instance api dari utils
import api from "../../../utils/api";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Alert,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function EditUserComponent({ open, handler, user, refreshData }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    status: "pending",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Efek untuk mengisi data awal saat dialog dibuka atau user terpilih berganti
  useEffect(() => {
    if (user && open) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "", // Password dikosongkan secara default untuk keamanan
        role: user.role || "anggota",
        status: user.status || "pending",
      });
      setErrorMsg(""); // Reset error saat buka dialog
    }
  }, [user, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Mengirim patch menggunakan utilitas api
      // URL menjadi lebih ringkas karena baseURL sudah diatur di utils/api
      await api.patch(`/users/${user.uuid}`, formData);
      
      refreshData(); // Refresh list user di parent component
      handler();     // Tutup dialog
    } catch (error) {
      setErrorMsg(error.response?.data?.msg || "Gagal memperbarui data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm" className="rounded-xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex flex-col items-start gap-1">
          <Typography variant="h5" color="blue-gray">
            Edit Data Pengguna
          </Typography>
          <Typography className="font-normal text-sm text-gray-600">
            Perbarui informasi akun atau status verifikasi user.
          </Typography>
        </DialogHeader>

        <DialogBody divider className="flex flex-col gap-4">
          {errorMsg && (
            <Alert color="red" variant="ghost" className="py-2 px-3 text-xs font-medium">
              {errorMsg}
            </Alert>
          )}

          <div className="flex flex-col gap-4">
            <Input 
              label="Username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Email" 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Role" 
                value={formData.role} 
                onChange={(val) => setFormData({ ...formData, role: val })}
              >
                <Option value="admin">Admin</Option>
                <Option value="anggota">Anggota</Option>
                <Option value="ketua_forum">Ketua Forum</Option>
                <Option value="humas">Humas</Option>
              </Select>

              <Select 
                label="Status" 
                value={formData.status} 
                onChange={(val) => setFormData({ ...formData, status: val })}
              >
                <Option value="verified">Verified</Option>
                <Option value="pending">Pending</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </div>

            <div className="relative">
              <Input 
                label="Ganti Password" 
                name="password"
                placeholder="Kosongkan jika tidak diubah"
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleChange} 
              />
              <IconButton 
                variant="text" 
                size="sm" 
                className="!absolute right-1 top-1 rounded" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
              </IconButton>
            </div>
            
            <Typography variant="small" color="gray" className="italic text-[11px] -mt-2 px-1">
              *Biarkan password kosong jika tidak ingin melakukan perubahan.
            </Typography>
          </div>
        </DialogBody>

        <DialogFooter className="gap-2">
          <Button 
            variant="text" 
            color="red" 
            onClick={handler} 
            disabled={loading}
            className="capitalize"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            color="black" 
            loading={loading}
            className="capitalize shadow-none hover:shadow-md"
          >
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}