import React from "react";
import { ComplexNavbar } from "../../components/pengunjung/navbar";
import Footer from "../../components/pengunjung/landing-page/Footer";
import ProfilP3M from "../../components/pengunjung/profil/profilP3MPengunjung";
import Head from "../../components/head";

const ProfilP3MPengunjungPage = () => {
  return (
    <div>
      <Head title={"Profil P3M"} />
        <ComplexNavbar/>
            <ProfilP3M />
        <Footer/>
    </div>
  )
}

export default ProfilP3MPengunjungPage