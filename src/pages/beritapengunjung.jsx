import React from 'react'
import DaftarBeritaP3M from '../components/pengunjung/berita/beritaPengunjung'
import { ComplexNavbar } from '../components/pengunjung/navbar'
import Footer from '../components/pengunjung/landing-page/Footer'


const BeritaPengunjungPage = () => {
  return (
    <div>
        <ComplexNavbar/>
        <DaftarBeritaP3M/>
        <Footer/>
    </div>
  )
}

export default BeritaPengunjungPage