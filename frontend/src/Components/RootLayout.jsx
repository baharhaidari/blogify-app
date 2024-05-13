import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer/Footer";

function RootLayout() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;
