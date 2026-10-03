import { parseLocalDate, getWeekday } from "../../utils/date";
import styles from "./DatePicker.module.css";

function DatePicker({ dates, value, onChange }) {
  return (
    <div className={styles.dates} role="radiogroup" aria-label="Choose a date">
      {dates.map((date) => {
        const isSelected = date === value;
        return (
          <button
            key={date}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`${styles.date} ${isSelected ? styles.selected : ""}`}
            onClick={() => onChange(date)}
          >
            <span className={styles.weekday}>{getWeekday(date)}</span>
            <span className={styles.day}>{parseLocalDate(date).getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}

export default DatePicker;
