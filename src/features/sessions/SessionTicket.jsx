import ticketIcon from "../../assets/icons/ticket.svg";
import styles from "./SessionTicket.module.css";

function SessionTicket({ session, disabled = false, onSelect }) {
  const isUnavailable = disabled || session.isSoldOut;

  return (
    <button
      type="button"
      className={styles.ticket}
      disabled={isUnavailable}
      onClick={() => onSelect(session)}
    >
      <span className={styles.main}>
        <span className={styles.time}>{session.time}</span>
        <span className={styles.tags}>
          <span title={session.language.name}>{session.language.code}</span>
          <span className={styles.format}>{session.format.name}</span>
        </span>
      </span>

      <span className={styles.side}>
        <span className={styles.price}>₾{session.price}</span>
        <span className={styles.seats}>
          {session.isSoldOut ? (
            "Sold out"
          ) : (
            <>
              <img src={ticketIcon} alt="" />
              {session.seatsLeft} left
            </>
          )}
        </span>
      </span>
    </button>
  );
}

export default SessionTicket;
