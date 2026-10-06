import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../auth/authContext";
import { useSeatMap, useCreateHold, useReleaseHold } from "./useBooking";
import { formatShortDate } from "../../utils/date";
import { useFilterOptions } from "../sessions/useSessions";

import SelectedSeats from "./SelectedSeats";
import HoldTimer from "./HoldTimer";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import SeatMap from "./SeatMap";
import CheckoutStep from "./CheckoutStep";
import styles from "./BookingModal.module.css";

function BookingModal({ movie, session, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const seatMap = useSeatMap(session.id);
  const options = useFilterOptions();
  const createHold = useCreateHold(session.id);
  const releaseHold = useReleaseHold();

  const ticketTypes = options.data?.ticketTypes ?? [];
  const maxSeats = options.data?.maxSeatsPerOrder ?? 3;

  const [step, setStep] = useState("seats"); //seats, checkout, done
  const [selected, setSelected] = useState([]); //id, code, ticketType
  const [message, setMessage] = useState("");
  const [hold, setHold] = useState(null); //response from POST holds

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

  function handleNext() {
    setMessage("");
    const seats = selected.map((s) => ({
      seatId: s.id,
      ticketType: s.ticketType,
    }));
    createHold.mutate(seats, {
      onSuccess: (data) => {
        setHold(data);
        setStep("checkout");
      },
      onError: (error) => {
        if (error.status === 409) {
          const lost = error.data?.contested ?? [];
          setHold(null);
          setSelected(selected.filter((s) => !lost.includes(s.code)));
          setMessage(
            `Sorry, ${lost.join(", ")} ${lost.length === 1 ? "was" : "were"} just taken. Your other seats are still selected.`,
          );
          seatMap.refetch();
          return;
        }
        if (error.status === 422 && error.errors) {
          const firstError = Object.values(error.errors)[0][0];
          setMessage(firstError);
          return;
        }
        //422 rule error (profile, age, session started) or anything else
        setMessage(error.message);
      },
    });
  }
  function handleExpire() {
    setHold(null);
    setSelected([]);
    setStep("seats");
    setMessage("Your hold time expired. Please re-select your seats.");
    seatMap.refetch();
  }
  function handlePay(values) {
    console.log("Pay: ", { holdId: hold.holdId, ...values });
  }
  function handleBack() {
    setStep("seats");
  }
  function handleClose() {
    //free the seats right away
    if (hold && step !== "done") {
      releaseHold.mutate(hold.holdId);
    }
    onClose();
  }
  function goToProfile() {
    onClose();
    navigate("/profile");
  }

  const hall = seatMap.data?.hall;
  const stepsBar = (
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
  );

  const messageLine = message && <p className={styles.message}>{message}</p>;

  function renderContent() {
    if (!user.profileComplete) {
      return (
        <div className={styles.profileBlock}>
          <p>Please complete your profile before buying tickets.</p>
          <Button onClick={goToProfile}>Go to profile</Button>
        </div>
      );
    }
    if (step === "checkout") {
      return (
        <CheckoutStep
          movie={movie}
          session={session}
          hall={hall}
          hold={hold}
          user={user}
          isPaying={false}
          onBack={handleBack}
          onPay={handlePay}
        >
          {stepsBar}
          {messageLine}
        </CheckoutStep>
      );
    }

    return (
      <div className={styles.body}>
        <div className={styles.main}>
          {stepsBar}
          {messageLine}
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
          isLoading={createHold.isPending}
          onChangeType={changeType}
          onRemove={removeSeat}
          onNext={handleNext}
        />
      </div>
    );
  }

  return (
    <Modal onClose={handleClose} maxWidth={1146} className={styles.booking}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.subline}>
            {hall ? `${hall.venue.name} · Hall ${hall.name} · ` : ""}
            {formatShortDate(session.date)} · {session.time} ·{" "}
            {session.format.name} · {session.language.name}
          </p>
        </div>
        {hold && step !== "done" && (
          <HoldTimer
            key={hold.holdId}
            expiresAt={hold.expiresAt}
            onExpire={handleExpire}
          />
        )}
      </header>
      {renderContent()}
    </Modal>
  );
}

export default BookingModal;
