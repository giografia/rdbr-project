import { useId } from "react";
import checkIcon from "../../assets/icons/check.svg";
import styles from "./Input.module.css";

function Input({ label, error, isValid, ref, ...rest }) {
  const id = useId(); //generate random id to connect label and input

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id={id}
          ref={ref}
          className={error ? styles.invalid : ""}
          aria-invalid={!!error}
          {...rest}
        />
        {isValid && <img src={checkIcon} alt="" className={styles.icon} />}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Input;
