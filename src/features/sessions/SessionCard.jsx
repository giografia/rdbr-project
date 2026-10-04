import ticketIcon from "../../assets/icons/ticket.svg";
import styles from "./SessionCard.module.css";

const LOW_SEATS = 10; //turn count red if its lower that this

function SessionCard({ session, onSelect }) {
  const isLow = session.seatsLeft <= LOW_SEATS;
  const iconMask = {
    WebkitMaskImage: `url("${ticketIcon}")`,
    maskImage: `url("${ticketIcon}")`,
  };

  return (
    <button
      type="button"
      className={styles.card}
      disabled={session.isSoldOut}
      onClick={() => onSelect(session)}
    >
      <span className={styles.row}>
        <span className={styles.time}>{session.time}</span>
        <span className={styles.format}>{session.format.name}</span>
      </span>

      <span className={styles.row}>
        <span className={styles.muted}>{session.language.name}</span>
        {session.isSoldOut ? (
          <span className={styles.muted}>Sold out</span>
        ) : (
          <span className={`${styles.seats} ${isLow ? styles.low : ""}`}>
            <span
              className={styles.seatIcon}
              style={iconMask}
              aria-hidden="true"
            />
            {session.seatsLeft} left
          </span>
        )}
      </span>
      <span className={styles.row}>
        <span className={styles.place}>
          {session.venue.name} · Hall {session.hall.name}
        </span>
        <span className={styles.price}>₾{session.price}</span>
      </span>
    </button>
  );
}

export default SessionCard;
