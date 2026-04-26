import React, { useEffect } from "react";
import DetailBeritaPengunjung from "../components/pengunjung/berita/detailberitaPengunjung";
import { ComplexNavbar } from "../components/pengunjung/navbar";
import Footer from "../components/pengunjung/landing-page/Footer";

const DetailBeritaPengunjungPage = () => {
  return (
    <div>
        <ComplexNavbar/>
            <DetailBeritaPengunjung />
        <Footer/>
    </div>
  )
}

export default DetailBeritaPengunjungPage