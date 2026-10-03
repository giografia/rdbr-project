import styles from "./Badge.module.css";

function Badge({ children, variant = "default", icon }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {icon && <img src={icon} alt="" className={styles.icon} />}
      {children}
    </span>
  );
}

export default Badge;
