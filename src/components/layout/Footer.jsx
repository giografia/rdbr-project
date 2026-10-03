import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="container">
      <div className={styles.inner}>
        <span className={styles.logo}>
          KINO <span>XII</span>
        </span>
        <p className={styles.copyright}>
          © {year} Kino XII. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
