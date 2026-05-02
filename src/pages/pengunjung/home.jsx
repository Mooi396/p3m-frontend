import { ComplexNavbar } from "../../components/pengunjung/navbar";
import LandingPage from "../../components/pengunjung/landing-page/landingPage";
import Footer from "../../components/pengunjung/landing-page/Footer";
import Head from "../../components/head";

function Home() {
  return (
    <>
    <Head title={"Forum P3M Nasional"} />
    <div className="bg-blue-50/30">
      <ComplexNavbar />
      <LandingPage />
      <Footer />
    </div>
    </>
  );
}

export default Home;