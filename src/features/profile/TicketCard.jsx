import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { formatShortDate, formatRefundDeadline } from "../../utils/date";
import styles from "./TicketCard.module.css";

const MESSAGE = "Refunds close 2 hours before the session starts";

function TicketCard({ order, onRefund }) {
  const { session, tickets } = order;
  const { movie } = session;

  const canRefund = order.isUpcoming && order.isRefundable;
  const note =
    order.isUpcoming && !order.isRefundable
      ? MESSAGE
      : `Refundable until ${formatRefundDeadline(session.date, session.time)}`;

  return (
    <article className={styles.card}>
      <img
        src={movie.posterUrl}
        alt=""
        className={styles.poster}
        loading="lazy"
      />
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{movie.title}</h3>
          <Badge variant="accent">{movie.ageRating.code}</Badge>
          <span className={styles.runtime}>{movie.runtimeMinutes} min</span>
        </div>

        <dl className={styles.facts}>
          <div>
            <dt className={styles.label}>Date</dt>
            <dd className={styles.value}>
              {formatShortDate(session.date)} · {session.time}
            </dd>
          </div>
          <div>
            <dt className={styles.label}>Venue</dt>
            <dd className={styles.value}>
              {session.venue.name} · Hall {session.hall.name}
            </dd>
          </div>
          <div>
            <dt className={styles.label}>Format</dt>
            <dd className={styles.value}>
              {session.format.name} · {session.language.name}
            </dd>
          </div>
        </dl>

        <div className={styles.seats}>
          <span className={styles.label}>Seats</span>
          {tickets.map((ticket) => (
            <span key={ticket.id} className={styles.seat}>
              {ticket.seatCode} · {ticket.ticketType.name}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.side}>
        <p className={styles.label}>Order</p>
        <p className={styles.reference}>#{order.reference}</p>

        <div className={styles.total}>
          <span>Total paid</span>
          <strong>₾{order.totalPrice}</strong>
        </div>

        <Button
          variant="ghost"
          fullWidth
          className={styles.refund}
          disabled={!canRefund}
          title={order.isUpcoming && !order.isRefundable ? MESSAGE : undefined}
          onClick={() => onRefund(order)}
        >
          Refund
        </Button>
        <p className={styles.note}>{note}</p>
      </div>
    </article>
  );
}

export default TicketCard;
