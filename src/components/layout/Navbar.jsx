import { Link, NavLink } from "react-router";

import { useAuth } from "../../features/auth/authContext";

import styles from "./Navbar.module.css";
import Button from "../ui/Button";
import UserMenu from "./UserMenu";
import SearchBox from "../../features/search/SearchBox";

function Navbar({ overlay = false }) {
  const { user, isBooting, openLogin, openRegister } = useAuth();

  return (
    <nav className={`${styles.navbar} ${overlay ? styles.overlay : ""}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            KINO <span>XII</span>
          </Link>

          <NavLink to="/sessions" className={styles.link}>
            SESSIONS
          </NavLink>
        </div>

        <div className={styles.right}>
          <SearchBox />
          {!isBooting &&
            (user ? (
              <UserMenu />
            ) : (
              <div className={styles.actions}>
                <Button variant="primary" onClick={openRegister}>
                  Sign up
                </Button>
                <Button variant="secondary" onClick={openLogin}>
                  Log in
                </Button>
              </div>
            ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
