import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

function PageLayout() {
  const { pathname } = useLocation();
  const hasHero = pathname === "/" || pathname.startsWith("/movies/");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar overlay={hasHero} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default PageLayout;
