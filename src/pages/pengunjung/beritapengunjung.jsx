import React from 'react'
import DaftarBeritaP3M from '../../components/pengunjung/berita/beritaPengunjung'
import { ComplexNavbar } from '../../components/pengunjung/navbar'
import Footer from '../../components/pengunjung/landing-page/Footer'
import Head from '../../components/head'


const BeritaPengunjungPage = () => {
  return (
    <div>
        <Head title={"Berita P3M"} />
        <ComplexNavbar/>
        <DaftarBeritaP3M/>
        <Footer/>
    </div>
  )
}

export default BeritaPengunjungPage