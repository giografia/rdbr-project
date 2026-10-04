import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useRefund } from "./useTickets";
import { formatShortDate } from "../../utils/date";
import styles from "./RefundModal.module.css";

function RefundModal({ order, onClose }) {
  const refund = useRefund();
  const { session } = order;

  async function handleConfirm() {
    try {
      await refund.mutateAsync(order.reference);
      onClose();
    } catch {
      //error is handled below
    }
  }
  return (
    <Modal onClose={onClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>Refund this order?</h2>
        <p className={styles.text}>
          {session.movie.title} · {formatShortDate(session.date)} ·{" "}
          {session.time}. ₾{order.totalPrice} goes back to the card ending in{" "}
          {order.cardLastFour}. Your seats will be released, and this can't be
          undone.
        </p>
      </header>
      {refund.isError && <p className={styles.error}>{refund.error.message}</p>}
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClose} disabled={refund.isPending}>
          Close
        </Button>
        <Button onClick={handleConfirm} loading={refund.isPending}>
          Refund
        </Button>
      </div>
    </Modal>
  );
}

export default RefundModal;
