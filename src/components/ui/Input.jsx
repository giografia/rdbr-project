import { useId } from "react";

import checkIcon from "../../assets/icons/check.svg";
import errorIcon from "../../assets/icons/error.svg";
import styles from "./Input.module.css";

function Input({ label, error, isValid, action, ref, ...rest }) {
  const id = useId(); //generate random id to connect label and input
  const stateClass = error
    ? styles.invalid
    : isValid && action
      ? styles.valid
      : "";

  return (
    <div className={styles.field}>
      <label
        htmlFor={id}
        className={`${styles.label} ${error ? styles.labelError : ""}`}
      >
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id={id}
          ref={ref}
          className={stateClass}
          aria-invalid={!!error}
          {...rest}
        />
        {action ? (
          <span className={styles.action}>{action}</span>
        ) : error ? (
          <img src={errorIcon} alt="" className={styles.icon} />
        ) : (
          isValid && <img src={checkIcon} alt="" className={styles.icon} />
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Input;
