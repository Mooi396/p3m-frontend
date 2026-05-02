import React from "react";
import { ComplexNavbar } from "../../components/pengunjung/navbar";
import Footer from "../../components/pengunjung/landing-page/Footer";
import HalamanAgenda from "../../components/pengunjung/agenda/daftarAgendaPengunjung";
import Head from "../../components/head";

const DaftarAgendaPengunjungPage = () => {
  return (
    <div>
        <Head title={"Daftar Agenda"} />
        <ComplexNavbar/>
            <HalamanAgenda />
        <Footer/>
    </div>
  )
}

export default DaftarAgendaPengunjungPage