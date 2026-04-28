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
import ScrollToTop from "./components/scrollToTop.jsx";
import DetailProfilUserPage from "./pages/detailprofiladmin.jsx";
import TambahBeritaPage from "./pages/tambahberita.jsx";
import DetailBeritaDashboardPage from "./pages/detailberitadashboard.jsx";
import EditberitaPage from "./pages/editberita.jsx";
import TambahAgendaPage from "./pages/tambahagenda.jsx";
import EditProfilUserPage from "./pages/editprofil.jsx";
import BeritaPengunjungPage from "./pages/beritapengunjung.jsx";
import DetailBeritaPengunjungPage from "./pages/detailberitapengunjung.jsx";
import DaftarPengurus from "./pages/daftarpengurusdashboard.jsx";
import ProfilOrganisasiDashboardPage from "./pages/profilorganisasidashboard.jsx";
import DaftarAnggotaPengunjungPage from "./pages/daftaranggotapengunjung.jsx";
import DaftarPengurusPengunjungPage from "./pages/daftarpenguruspengunjung.jsx";
import ProfilP3MPengunjungPage from "./pages/profilP3MPengunjung.jsx";
import DaftarAgendaPengunjungPage from "./pages/daftaragendapengunjung.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);
  return ( 
  <div>
    <BrowserRouter>
    <ScrollToTop />
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
        <Route path="/dashboard/pengurus" element={<DaftarPengurus/>}></Route>
        <Route path="/dashboard/profil-p3m" element={<ProfilOrganisasiDashboardPage/>}></Route>
        <Route path="/berita" element={<BeritaPengunjungPage/>}></Route>
        <Route path="/daftar-anggota" element={<DaftarAnggotaPengunjungPage/>}></Route>
        <Route path="/daftar-pengurus" element={<DaftarPengurusPengunjungPage/>}></Route>
        <Route path="/berita/:uuid" element={<DetailBeritaPengunjungPage/>}></Route>
        <Route path="/profil-p3m" element={<ProfilP3MPengunjungPage/>}></Route>
        <Route path="/agenda" element={<DaftarAgendaPengunjungPage/>}></Route>
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