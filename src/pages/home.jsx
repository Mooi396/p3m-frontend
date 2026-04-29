import { ComplexNavbar } from "../components/pengunjung/navbar";
import LandingPage from "../components/pengunjung/landing-page/landingPage";
import Footer from "../components/pengunjung/landing-page/Footer";

function Home() {
  return (
    <div className="bg-blue-50/30">
      <ComplexNavbar />
      <LandingPage />
      <Footer />
    </div>
  );
}

export default Home;