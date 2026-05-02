import React from "react";
import { ComplexNavbar } from "../../components/pengunjung/navbar";
import Footer from "../../components/pengunjung/landing-page/Footer";
import DaftarAnggotaP3M from "../../components/pengunjung/anggota/daftarAnggota";
import Head from "../../components/head";

const DaftarAnggotaPengunjungPage = () => {
  return (
    <div>
        <Head title={"Daftar Anggota"} />
        <ComplexNavbar/>
            <DaftarAnggotaP3M />
        <Footer/>
    </div>
  )
}

export default DaftarAnggotaPengunjungPage