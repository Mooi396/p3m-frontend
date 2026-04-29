import React, { useEffect } from "react";
import { ComplexNavbar } from "../components/pengunjung/navbar";
import Footer from "../components/pengunjung/landing-page/Footer";
import NotFound from "../components/notFound";

const NotFoundPage = () => {
  return (
    <div>
        <ComplexNavbar/>
            <NotFound />
        <Footer/>
    </div>
  )
}

export default NotFoundPage