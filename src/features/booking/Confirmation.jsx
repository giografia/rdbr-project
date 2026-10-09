import { formatShortDate } from "../../utils/date";
import { formatPrice } from "../../utils/price";
import { countTickets } from "../../utils/tickets";

import Button from "../../components/ui/Button";
import checkIcon from "../../assets/icons/check.svg";
import styles from "./Confirmation.module.css";

function Confirmation({ order, movie, session, hall, onViewTickets, onClose }) {
  const seats = order.tickets.map((t) => t.seatCode).join(", ");

  return (
    <div className={styles.confirmation}>
      <div className={styles.icon}>
        <img src={checkIcon} alt="" />
      </div>

      <div className={styles.heading}>
        <h2 className={styles.title}>Booking confirmed!</h2>
        <p className={styles.text}>
          Your tickets are ready. We've sent the confirmation to your email.
        </p>
      </div>

      <span className={styles.reference}>Order #{order.reference}</span>

      <div className={styles.card}>
        <div className={styles.movie}>
          <img src={movie.posterUrl} alt="" className={styles.poster} />
          <div>
            <h3 className={styles.movieTitle}>{movie.title}</h3>
            <p className={styles.meta}>
              {hall.venue.name} · Hall {hall.name} ·{" "}
              {formatShortDate(session.date)} · {session.time}
            </p>
          </div>
        </div>

        <dl className={styles.lines}>
          <div className={styles.line}>
            <dt>Seats</dt>
            <dd>{seats}</dd>
          </div>
          <div className={styles.line}>
            <dt>Tickets</dt>
            <dd>{countTickets(order.tickets)}</dd>
          </div>
        </dl>

        <div className={styles.total}>
          <span>Total paid</span>
          <strong>{formatPrice(order.totalPrice)}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <Button onClick={onViewTickets}>View my tickets</Button>
        <Button variant="ghost" onClick={onClose}>
          Back to home
        </Button>
      </div>
    </div>
  );
}

export default Confirmation;
