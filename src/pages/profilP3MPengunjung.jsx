import React, { useEffect } from "react";
import { ComplexNavbar } from "../components/pengunjung/navbar";
import Footer from "../components/pengunjung/landing-page/Footer";
import ProfilP3M from "../components/pengunjung/profil/profilP3MPengunjung";

const ProfilP3MPengunjungPage = () => {
  return (
    <div>
        <ComplexNavbar/>
            <ProfilP3M />
        <Footer/>
    </div>
  )
}

export default ProfilP3MPengunjungPage