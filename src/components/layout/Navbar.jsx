import { Link, NavLink } from "react-router";
import LoginModal from "../../features/auth/LoginModal";

import styles from "./Navbar.module.css";
import searchIcon from "../../assets/icons/search.svg";
import Button from "../ui/Button";
import { useState } from "react";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className={styles.navbar}>
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
          <label className={styles.search}>
            <img src={searchIcon} alt="" />
            <input type="text" placeholder="Search films and live events" />
          </label>
          <div className={styles.actions}>
            <Button variant="primary">Sign up</Button>
            <Button variant="secondary" onClick={() => setShowLogin(true)}>
              Log in
            </Button>
          </div>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
}

export default Navbar;
