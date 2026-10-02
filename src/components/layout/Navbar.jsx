import { Link, NavLink } from "react-router";
import styles from "./Navbar.module.css";
import searchIcon from "../../assets/icons/search.svg";

function Navbar() {
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
            <button className={styles.signUp}>Sign up</button>
            <button className={styles.logIn}>Log in</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
