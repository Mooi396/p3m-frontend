import React, { useEffect } from "react";
import { ComplexNavbar } from "../components/pengunjung/navbar";
import Footer from "../components/pengunjung/landing-page/Footer";
import HalamanAgenda from "../components/pengunjung/agenda/daftarAgendaPengunjung";

const DaftarAgendaPengunjungPage = () => {
  return (
    <div>
        <ComplexNavbar/>
            <HalamanAgenda />
        <Footer/>
    </div>
  )
}

export default DaftarAgendaPengunjungPage