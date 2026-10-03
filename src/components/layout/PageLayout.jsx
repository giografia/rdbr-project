import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";

function PageLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar overlay={pathname === "/"} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default PageLayout;
