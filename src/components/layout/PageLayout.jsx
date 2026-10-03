import { Outlet, useLocation } from "react-router";

import Navbar from "./Navbar";
import Footer from "./Footer";

function PageLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar overlay={pathname === "/"} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default PageLayout;
