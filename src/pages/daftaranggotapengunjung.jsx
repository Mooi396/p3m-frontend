import React, { useEffect } from "react";
import { ComplexNavbar } from "../components/pengunjung/navbar";
import Footer from "../components/pengunjung/landing-page/Footer";
import DaftarAnggotaP3M from "../components/pengunjung/anggota/daftarAnggota";

const DaftarAnggotaPengunjungPage = () => {
  return (
    <div>
        <ComplexNavbar/>
            <DaftarAnggotaP3M />
        <Footer/>
    </div>
  )
}

export default DaftarAnggotaPengunjungPage