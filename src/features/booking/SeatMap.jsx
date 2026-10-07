import { Fragment } from "react";
import styles from "./SeatMap.module.css";

function Seat({ seat, isSelected, onToggle, disabled }) {
  if (seat.state === "unavailable") {
    return <span className={styles.gap} />;
    //if no seat exists, keep the space so grid stays perfect
  }

  const state = seat.isMine ? "available" : seat.state;
  const canClick = state === "available";

  return (
    <button
      type="button"
      className={`${styles.seat} ${styles[state]} ${isSelected ? styles.selected : ""}`}
      disabled={!canClick || disabled}
      onClick={() => onToggle(seat)}
      aria-pressed={isSelected}
      aria-label={`Seat ${seat.code}`}
    >
      {seat.label}
    </button>
  );
}
function SeatMap({ sections, selectedIds, onToggle, disabled }) {
  return (
    <div className={styles.map}>
      <div className={styles.screen}>Screen</div>
      {sections.map((section) => {
        const firstRow = section.rows[0].label;
        const lastRow = section.rows[section.rows.length - 1].label;

        return (
          <section key={section.name} className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {section.name} · Rows {firstRow}-{lastRow}
            </h3>

            <div className={styles.rows}>
              {section.rows.map((row) => (
                <div key={row.label} className={styles.row}>
                  <span className={styles.rowLabel}>{row.label}</span>
                  {row.seats.map((seat) => (
                    <Fragment key={seat.id}>
                      <Seat
                        seat={seat}
                        isSelected={selectedIds.includes(seat.id)}
                        onToggle={onToggle}
                        disabled={disabled}
                      />
                      {seat.aisleAfter && <span className={styles.aisle} />}
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          </section>
        );
      })}
      <ul className={styles.legend}>
        <li>
          <span className={`${styles.swatch} ${styles.available}`} />
          Available
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.selected}`} />
          Selected
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.sold}`} />
          Sold
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.held}`} />
          Held by another user
        </li>
      </ul>
    </div>
  );
}

export default SeatMap;
