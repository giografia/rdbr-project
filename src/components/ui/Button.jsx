import styles from "./Button.module.css";

function Button({
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""} ${className}`}
      disabled={disabled || loading} // disabled if parent is disabled or is loading
      {...rest}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
