import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../auth/authContext";
import { useSeatMap } from "./useBooking";
import { formatShortDate } from "../../utils/date";
import { useFilterOptions } from "../sessions/useSessions";

import SelectedSeats from "./SelectedSeats";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import SeatMap from "./SeatMap";
import styles from "./BookingModal.module.css";

function BookingModal({ movie, session, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const seatMap = useSeatMap(session.id);
  const options = useFilterOptions();
  const ticketTypes = options.data?.ticketTypes ?? [];
  const maxSeats = options.data?.maxSeatsPerOrder ?? 3;
  const [step, setStep] = useState("seats"); //seats, checkout, done
  const [selected, setSelected] = useState([]); //id, code, ticketType
  const [message, setMessage] = useState("");

  function removeSeat(seatId) {
    setSelected(selected.filter((s) => s.id !== seatId));
    setMessage("");
  }
  function toggleSeat(seat) {
    if (selected.some((s) => s.id === seat.id)) {
      removeSeat(seat.id);
      return;
    }
    if (selected.length >= maxSeats) {
      setMessage(`You can pick up to ${maxSeats} seats per order.`);
      return;
    }
    setSelected([
      ...selected,
      { id: seat.id, code: seat.code, ticketType: "adult" },
    ]);
    setMessage("");
  }
  function changeType(seatId, slug) {
    setSelected(
      selected.map((s) => (s.id === seatId ? { ...s, ticketType: slug } : s)),
    );
  }
  const selectedIds = selected.map((s) => s.id);

  useEffect(() => {
    if (!seatMap.data) return;
    const mySeats = seatMap.data.sections
      .flatMap((section) => section.rows)
      .flatMap((row) => row.seats)
      .filter((seat) => seat.isMine);
    if (mySeats.length > 0) {
      setSelected((current) =>
        current.length > 0
          ? current
          : mySeats.map((seat) => ({
              id: seat.id,
              code: seat.code,
              ticketType: "adult",
            })),
      );
    }
  }, [seatMap.data]);

  function goToProfile() {
    onClose();
    navigate("/profile");
  }
  const hall = seatMap.data?.hall;

  function handleNext() {
    console.log("NEXT COMING SOON", selected);
  }

  return (
    <Modal onClose={onClose} maxWidth={1146} className={styles.booking}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.subline}>
            {hall ? `${hall.venue.name} · Hall ${hall.name} · ` : ""}
            {formatShortDate(session.date)} · {session.time} ·{" "}
            {session.format.name} · {session.language.name}
          </p>
        </div>
        {/*HOLD TIMER GOES HERE */}
      </header>

      {!user.profileComplete ? (
        <div className={styles.profileBlock}>
          <p>Please complete your profile before buying tickets.</p>
          <Button onClick={goToProfile}>Go to profile</Button>
        </div>
      ) : (
        <div className={styles.body}>
          <div className={styles.main}>
            <div className={styles.steps}>
              <span
                className={`${styles.step} ${step === "seats" ? styles.active : ""}`}
              >
                Seats
              </span>
              <span
                className={`${styles.step} ${step === "checkout" ? styles.active : ""}`}
              >
                Checkout
              </span>
            </div>
            {message && <p className={styles.message}>{message}</p>}
            {seatMap.isLoading && <p>Loading seats...</p>}
            {seatMap.isError && <p>{seatMap.error.message}</p>}
            {seatMap.data && (
              <SeatMap
                sections={seatMap.data.sections}
                selectedIds={selectedIds}
                onToggle={toggleSeat}
              />
            )}
          </div>

          <SelectedSeats
            selected={selected}
            ticketTypes={ticketTypes}
            basePrice={session.price}
            minAge={movie.ageRating?.minAge ?? 0}
            maxSeats={maxSeats}
            onChangeType={changeType}
            onRemove={removeSeat}
            onNext={handleNext}
          />
        </div>
      )}
    </Modal>
  );
}

export default BookingModal;
