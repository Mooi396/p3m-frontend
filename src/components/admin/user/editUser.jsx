import React, { useState, useEffect } from "react";
import axios from "axios";
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

export default function EditUserAdmin({ open, handler, user, refreshData }) {
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

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        role: user.role || "anggota",
        status: user.status || "pending",
      });
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
      await axios.patch(`http://localhost:5000/users/${user.uuid}`, formData, {
        withCredentials: true,
      });
      
      refreshData();
      handler();
    } catch (error) {
      setErrorMsg(error.response?.data?.msg || "Gagal memperbarui data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex flex-col items-start gap-1">
          <Typography variant="h5" color="blue-gray">Edit Data Pengguna</Typography>
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

          <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          
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
              {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </IconButton>
          </div>
          <Typography variant="small" color="gray" className="italic text-[10px] -mt-2">
            *Biarkan password kosong jika tidak ingin menggantinya.
          </Typography>
        </DialogBody>

        <DialogFooter className="gap-2">
          <Button variant="text" color="red" onClick={handler} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}