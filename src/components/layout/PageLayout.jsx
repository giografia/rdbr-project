import { Outlet } from "react-router";

function PageLayout() {
  return (
    <>
      <nav>Navbar placeholder</nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default PageLayout;
