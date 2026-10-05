import Button from "../../components/ui/Button";
import closeIcon from "../../assets/icons/close.svg";
import styles from "./SelectedSeats.module.css";

function formatPrice(amount) {
  return `₾${Math.round(amount * 100) / 100}`;
}
function SelectedSeats({
  selected,
  ticketTypes,
  basePrice,
  minAge,
  maxSeats,
  onChangeType,
  onRemove,
  onNext,
}) {
  //child 60% student 75% adult 100%
  const sortedTypes = [...ticketTypes].sort(
    (a, b) => a.priceRatio - b.priceRatio,
  );

  function priceFor(slug) {
    const type = ticketTypes.find((t) => t.slug === slug);
    return basePrice * (type?.priceRatio ?? 1);
  }
  const subtotal = selected.reduce(
    (sum, seat) => sum + priceFor(seat.ticketType),
    0,
  );
  return (
    <aside className={styles.panel}>
      <h3>Your seats · Max {maxSeats}</h3>
      <p className={styles.text}>
        Pick up to {maxSeats} seats from the map. Each seat can carry its own
        ticket type.
      </p>
      <ul className={styles.list}>
        {selected.map((seat) => (
          <li key={seat.id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.seatCode}>Seat {seat.code}</span>
              <span className={styles.price}>
                {formatPrice(priceFor(seat.ticketType))}
              </span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => onRemove(seat.id)}
                aria-label={`Remove seat ${seat.code}`}
              >
                <img src={closeIcon} alt="" />
              </button>
            </div>

            <div className={styles.types}>
              {sortedTypes.map((type) => {
                const isBlocked =
                  type.blockedFromRatingAge !== null &&
                  minAge >= type.blockedFromRatingAge;
                return (
                  <button
                    key={type.slug}
                    type="button"
                    disabled={isBlocked}
                    className={`${styles.type} ${seat.ticketType === type.slug ? styles.typeActive : ""}`}
                    onClick={() => onChangeType(seat.id, type.slug)}
                  >
                    {type.name} {Math.round(type.priceRatio * 100)}%
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <div className={styles.subtotal}>
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <Button fullWidth disabled={selected.length === 0} onClick={onNext}>
          Next: Checkout
        </Button>
      </div>
    </aside>
  );
}

export default SelectedSeats;
