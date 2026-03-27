import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/home";
import Register from "./pages/register"
import Dashboard from "./pages/dashboard";
import DaftarUser from "./pages/daftaruser";
import Login from "./pages/login";

function App() {
  return ( 
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/daftar" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/dashboard/daftar-user" element={<DaftarUser/>}></Route>
        <Route path="/masuk" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App;