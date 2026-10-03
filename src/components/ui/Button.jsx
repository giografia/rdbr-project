import { Link } from "react-router";

import styles from "./Button.module.css";

function Button({
  to,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  children,
  ...rest
}) {
  const classes = `${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading} // disabled if parent is disabled or is loading
      {...rest}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
