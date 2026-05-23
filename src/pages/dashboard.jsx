import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import DashboardAdmin from "../components/admin/dashboardAdmin";
import Head from "../components/head";
import DashboardAnggota from "../components/anggota/dashboardAnggota";
import DashboardHumas from "../components/admin-humas/dashboardHumas";
import DashboardKetuaForum from "../components/admin-ketua_forum/dashboardKetuaForum";
import { Spinner, Typography } from "@material-tailwind/react"; 

const Dashboard = () => {
  // Ambil state langsung dari Redux. 
  // Tidak perlu lagi memanggil dispatch() di file ini karena sudah diurus App.jsx
  const { user, isError, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      // Hanya berjalan jika GetMe benar-benar gagal karena token invalid/expired, 
      // bukan error nyangkut dari sebelum login.
      localStorage.removeItem("token");
      window.location.href = "/masuk";
    }
  }, [isError]);

  // Tampilkan LOADING SCREEN UTAMA
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-10 w-10 text-blue-500" />
          <Typography variant="h6" color="blue-gray">
            Memuat Dashboard...
          </Typography>
        </div>
      </div>
    );
  }

  // Jika tidak ada user (mencegah error render komponen anak)
  if (!user) return null;

  return (
    <div>
      <Head title={"Dashboard"} />
      
      {user.role === "admin" && <DashboardAdmin />}
      {user.role === "anggota" && <DashboardAnggota />}
      {user.role === "humas" && <DashboardHumas />}
      {user.role === "ketua_forum" && <DashboardKetuaForum />}
    </div>
  );
};

export default Dashboard;