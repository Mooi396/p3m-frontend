import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/home";
import Register from "./pages/register"
import Dashboard from "./pages/dashboard";
import DaftarUser from "./pages/daftaruser";
import Login from "./pages/login";
import DaftarAgenda from "./pages/daftaragenda";
import Daftarberita from "./pages/daftarberita";
import Daftarlaporan from "./pages/daftarlaporan";
import DaftarTag from "./pages/daftartag";
import DaftarKategori from "./pages/daftarkategori";
import TambahUserAdminPage from "./pages/tambahuseradmin";
import GuestRoute from "./components/guestRoute";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { GetMe } from "./features/authSlice.js";
import DetailProfilUserPage from "./pages/detailprofiladmin.jsx";
import TambahBeritaPage from "./pages/tambahberita.jsx";
import DetailBeritaDashboardPage from "./pages/detailberitadashboard.jsx";
import EditberitaPage from "./pages/editberita.jsx";
import TambahAgendaPage from "./pages/tambahagenda.jsx";
import EditProfilUserPage from "./pages/editprofil.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);
  return ( 
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/daftar" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }/>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/dashboard/profil" element={<DetailProfilUserPage/>}></Route>
        <Route path="/dashboard/profil/edit" element={<EditProfilUserPage/>}></Route>
        <Route path="/dashboard/pengguna" element={<DaftarUser/>}></Route>
        <Route path="/dashboard/pengguna/tambah" element={<TambahUserAdminPage/>}></Route>
        <Route path="/dashboard/agenda" element={<DaftarAgenda/>}></Route>
        <Route path="/dashboard/agenda/tambah" element={<TambahAgendaPage/>}></Route>
        <Route path="/dashboard/berita" element={<Daftarberita/>}></Route>
        <Route path="/dashboard/berita/:uuid" element={<DetailBeritaDashboardPage/>}></Route>
        <Route path="/dashboard/berita/edit/:uuid" element={<EditberitaPage/>}></Route>
        <Route path="/dashboard/berita/tambah" element={<TambahBeritaPage/>}></Route>
        <Route path="/dashboard/berita/tag" element={<DaftarTag/>}></Route>
        <Route path="/dashboard/berita/kategori" element={<DaftarKategori/>}></Route>
        <Route path="/dashboard/laporan" element={<Daftarlaporan/>}></Route>
        <Route path="/masuk" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }></Route>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App;