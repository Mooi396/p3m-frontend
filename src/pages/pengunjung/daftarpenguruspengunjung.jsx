import React from "react";
import { ComplexNavbar } from "../../components/pengunjung/navbar";
import Footer from "../../components/pengunjung/landing-page/Footer";
import DaftarPengurusP3M from "../../components/pengunjung/anggota/daftarPengurus";
import Head from "../../components/head";

const DaftarPengurusPengunjungPage = () => {
  return (
    <div>
        <Head title={"Daftar Pengurus"} />
        <ComplexNavbar/>
            <DaftarPengurusP3M />
        <Footer/>
    </div>
  )
}

export default DaftarPengurusPengunjungPage