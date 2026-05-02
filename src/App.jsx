import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/pengunjung/home";
import Register from "./pages/register"
import Dashboard from "./pages/dashboard";
import DaftarUser from "./pages/admin-ketua_forum/daftaruser";
import Login from "./pages/login";
import DaftarAgenda from "./pages/admin-humas/daftaragenda";
import Daftarberita from "./pages/admin-humas/daftarberita";
import Daftarlaporan from "./pages/admin-ketua_forum/daftarlaporan";
import DaftarTag from "./pages/admin-humas/daftartag";
import DaftarKategori from "./pages/admin-humas/daftarkategori";
import TambahUserAdminPage from "./pages/admin-ketua_forum/tambahuseradmin";
import GuestRoute from "./components/guestRoute";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { GetMe } from "./features/authSlice.js";
import ScrollToTop from "./components/scrollToTop.jsx";
import DetailProfilUserPage from "./pages/detailprofiladmin.jsx";
import TambahBeritaPage from "./pages/admin-humas/tambahberita.jsx";
import DetailBeritaDashboardPage from "./pages/admin-humas/detailberitadashboard.jsx";
import EditberitaPage from "./pages/admin-humas/editberita.jsx";
import TambahAgendaPage from "./pages/admin-humas/tambahagenda.jsx";
import EditProfilUserPage from "./pages/editprofil.jsx";
import BeritaPengunjungPage from "./pages/pengunjung/beritapengunjung.jsx";
import DetailBeritaPengunjungPage from "./pages/pengunjung/detailberitapengunjung.jsx";
import DaftarPengurus from "./pages/admin-ketua_forum/daftarpengurusdashboard.jsx";
import ProfilOrganisasiDashboardPage from "./pages/admin-humas/profilorganisasidashboard.jsx";
import DaftarAnggotaPengunjungPage from "./pages/pengunjung/daftaranggotapengunjung.jsx";
import DaftarPengurusPengunjungPage from "./pages/pengunjung/daftarpenguruspengunjung.jsx";
import ProfilP3MPengunjungPage from "./pages/pengunjung/profilP3MPengunjung.jsx";
import DaftarAgendaPengunjungPage from "./pages/pengunjung/daftaragendapengunjung.jsx";
import NotFoundPage from "./pages/notfound.jsx";
import KustomLandingPage from "./pages/admin/kustomlandingpage.jsx";

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
        <Route path="/dashboard/kustom-landing-page" element={<KustomLandingPage/>}></Route>
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
        <Route path="*" element={<NotFoundPage/>}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App;