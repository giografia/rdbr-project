import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../auth/authContext";
import {
  useSeatMap,
  useCreateHold,
  useReleaseHold,
  useCreateOrder,
} from "./useBooking";
import { formatShortDate } from "../../utils/date";
import { useFilterOptions } from "../sessions/useSessions";

import SelectedSeats from "./SelectedSeats";
import HoldTimer from "./HoldTimer";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import SeatMap from "./SeatMap";
import CheckoutStep from "./CheckoutStep";
import Confirmation from "./Confirmation";
import styles from "./BookingModal.module.css";

function BookingModal({ movie, session, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const seatMap = useSeatMap(session.id);
  const options = useFilterOptions();
  const createHold = useCreateHold(session.id);
  const releaseHold = useReleaseHold();
  const createOrder = useCreateOrder();

  const ticketTypes = options.data?.ticketTypes ?? [];
  const maxSeats = options.data?.maxSeatsPerOrder ?? 3;

  const [step, setStep] = useState("seats"); //seats, checkout, done
  const [selected, setSelected] = useState([]); //id, code, ticketType
  const [message, setMessage] = useState("");
  const [hold, setHold] = useState(null); //response from POST holds
  const [order, setOrder] = useState(null); //response from POST orders

  function lostSeatsMessage(lost) {
    return `Sorry, ${lost.join(", ")} ${lost.length === 1 ? "was" : "were"} just taken. Your other seats are still selected.`;
  }

  function requestHold(nextSelected, goToCheckout = false) {
    setMessage("");

    if (nextSelected.length === 0) {
      if (hold) releaseHold.mutate(hold.holdId);
      setHold(null);
      return;
    }

    const seats = nextSelected.map((s) => ({
      seatId: s.id,
      ticketType: s.ticketType,
    }));

    createHold.mutate(seats, {
      onSuccess: (data) => {
        setHold(data);
        if (goToCheckout) setStep("checkout");
      },
      onError: (error) => {
        setHold(null);

        if (error.status === 409) {
          const lost = error.data?.contested ?? [];
          setSelected(nextSelected.filter((s) => !lost.includes(s.code)));
          setMessage(lostSeatsMessage(lost));
          seatMap.refetch();
          return;
        }
        if (error.status === 422 && error.errors) {
          setMessage(Object.values(error.errors)[0][0]);
          return;
        }
        setMessage(error.message);
      },
    });
  }

  function removeSeat(seatId) {
    const next = selected.filter((s) => s.id !== seatId);
    setSelected(next);
    requestHold(next);
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
    const next = [
      ...selected,
      { id: seat.id, code: seat.code, ticketType: "adult" },
    ];
    setSelected(next);
    requestHold(next);
  }
  function changeType(seatId, slug) {
    const next = selected.map((s) =>
      s.id === seatId ? { ...s, ticketType: slug } : s,
    );
    setSelected(next);
    requestHold(next);
  }
  function handleNext() {
    if (hold) {
      setStep("checkout"); //seats are held
    } else {
      requestHold(selected, true);
    }
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

  function handleExpire() {
    setHold(null);
    setSelected([]);
    setStep("seats");
    setMessage("Your hold time expired. Please re-select your seats.");
    seatMap.refetch();
  }

  function handlePay(values, setFieldError) {
    setMessage("");

    createOrder.mutate(
      { holdId: hold.holdId, ...values },
      {
        onSuccess: (data) => {
          setOrder(data);
          setStep("done");
        },
        onError: (error) => {
          if (error.status === 422 && error.errors) {
            //field validation: put each message under its input
            Object.entries(error.errors).forEach(([field, messages]) => {
              setFieldError(field, { message: messages[0] });
            });
            return;
          }
          if (error.status === 422) {
            //message only = the hold ran out
            handleExpire();
            return;
          }
          if (error.status === 409) {
            //a seat was sold in between: same recovery as for holds
            const lost = error.data?.contested ?? [];
            setHold(null);
            setSelected(selected.filter((s) => !lost.includes(s.code)));
            setStep("seats");
            setMessage(lostSeatsMessage(lost));
            seatMap.refetch();
            return;
          }
          setMessage(error.message);
        },
      },
    );
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
  function goToTickets() {
    onClose();
    navigate("/profile?tab=tickets");
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
          isPaying={createOrder.isPending}
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
              disabled={createHold.isPending}
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

  //all hooks are above, so this early return is safe
  if (step === "done") {
    return (
      <Modal onClose={onClose} maxWidth={1146}>
        <Confirmation
          order={order}
          movie={movie}
          session={session}
          hall={hall}
          onViewTickets={goToTickets}
          onClose={onClose}
        />
      </Modal>
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
            key={hold.expiresAt}
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
