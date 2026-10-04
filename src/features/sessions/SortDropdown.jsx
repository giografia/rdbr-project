import arrowDownIcon from "../../assets/icons/arrowDown.svg";
import styles from "./SortDropdown.module.css";

function SortDropdown({ options, value, onChange }) {
  return (
    <label className={styles.sort}>
      <span className={styles.prefix}>Sort:</span>
      <span className={styles.wrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <img src={arrowDownIcon} alt="" className={styles.arrowDown} />
      </span>
    </label>
  );
}

export default SortDropdown;
