import React, { useEffect } from "react";
import { ComplexNavbar } from "../components/pengunjung/navbar";
import Footer from "../components/pengunjung/landing-page/Footer";
import DaftarPengurusP3M from "../components/pengunjung/anggota/daftarPengurus";

const DaftarPengurusPengunjungPage = () => {
  return (
    <div>
        <ComplexNavbar/>
            <DaftarPengurusP3M />
        <Footer/>
    </div>
  )
}

export default DaftarPengurusPengunjungPage