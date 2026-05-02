import React from "react";
import { ComplexNavbar } from "../components/pengunjung/navbar";
import Footer from "../components/pengunjung/landing-page/Footer";
import NotFound from "../components/notFound";
import Head from "../components/head";

const NotFoundPage = () => {
  return (
    <div>
      <Head title={"Halaman Tidak Ditemukan"} />
        <ComplexNavbar/>
            <NotFound />
        <Footer/>
    </div>
  )
}

export default NotFoundPage