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

function App() {
  return ( 
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/daftar" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/dashboard/pengguna" element={<DaftarUser/>}></Route>
        <Route path="/dashboard/agenda" element={<DaftarAgenda/>}></Route>
        <Route path="/dashboard/berita" element={<Daftarberita/>}></Route>
        <Route path="/dashboard/berita/tag" element={<DaftarTag/>}></Route>
        <Route path="/dashboard/berita/kategori" element={<DaftarKategori/>}></Route>
        <Route path="/dashboard/laporan" element={<Daftarlaporan/>}></Route>
        <Route path="/masuk" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App;