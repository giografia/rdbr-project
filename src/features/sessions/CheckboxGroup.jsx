import styles from "./CheckboxGroup.module.css";

function CheckboxGroup({ title, options, selected, onChange }) {
  function toggle(value) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  }

  return (
    <fieldset className={styles.group}>
      <legend className={styles.title}>{title}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
            <span className={styles.label}>{option.label}</span>
            {option.hint && (
              <span className={styles.hint}>· {option.hint}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default CheckboxGroup;
