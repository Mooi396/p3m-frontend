import React, { useState } from "react";
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

export default function TambahUserAdmin({ open, handler, refreshData }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confPassword: "",
    role: "anggota",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi sederhana sebelum kirim ke API
    if (formData.password !== formData.confPassword) {
      return setErrorMsg("Password dan Konfirmasi Password tidak cocok!");
    }

    setLoading(true);

    try {
      // Mengirim data menggunakan api.post ke endpoint /register
      // Base URL dan withCredentials sudah otomatis ditangani oleh instance api
      await api.post("/register", formData);
      
      // Reset form setelah berhasil
      setFormData({ 
        username: "", 
        email: "", 
        password: "", 
        confPassword: "", 
        role: "anggota" 
      });
      
      refreshData(); // Memperbarui daftar user di halaman utama
      handler();     // Menutup dialog
    } catch (error) {
      setErrorMsg(error.response?.data?.msg || "Terjadi kesalahan saat menyimpan user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handler} size="sm" className="rounded-xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="flex flex-col items-start gap-1">
          <Typography variant="h5" color="blue-gray">
            Tambah User Baru
          </Typography>
          <Typography className="font-normal text-sm text-gray-600">
            Kredensial ini akan digunakan user untuk masuk ke sistem.
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
            
            <Select 
              label="Role Pengguna" 
              value={formData.role} 
              onChange={(val) => setFormData({ ...formData, role: val })}
            >
              <Option value="admin">Administrator</Option>
              <Option value="ketua_forum">Ketua Forum</Option>
              <Option value="humas">Humas</Option>
              <Option value="anggota">Anggota</Option>
            </Select>

            <div className="relative">
              <Input 
                label="Password" 
                name="password"
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleChange} 
                required 
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

            <Input 
              label="Konfirmasi Password" 
              name="confPassword"
              type={showPassword ? "text" : "password"} 
              value={formData.confPassword} 
              onChange={handleChange} 
              required 
            />
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
            Simpan User
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}