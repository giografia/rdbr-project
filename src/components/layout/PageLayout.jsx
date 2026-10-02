import { Outlet } from "react-router";
import Navbar from "./Navbar";

function PageLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default PageLayout;
