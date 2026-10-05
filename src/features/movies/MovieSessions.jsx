import { useSearchParams } from "react-router";
import { useState } from "react";

import { useAuth } from "../auth/authContext";
import { useMovieSessions } from "./useMovies";
import { isAgeRestricted } from "../../utils/age";
import { formatLongDate, getWeekday } from "../../utils/date";
import BookingModal from "../booking/BookingModal";
import DatePicker from "../sessions/DatePicker";
import SessionTicket from "../sessions/SessionTicket";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import styles from "./MovieSessions.module.css";

const DAYS_SHOWN = 7;

function groupByHall(sessions) {
  const halls = new Map();
  sessions.forEach((session) => {
    if (!halls.has(session.hall.id)) {
      halls.set(session.hall.id, { hall: session.hall, sessions: [] });
    }
    halls.get(session.hall.id).sessions.push(session);
  });
  return [...halls.values()];
}

function MovieSessions({ movie }) {
  const { user, requireAuth } = useAuth();
  const [bookingSession, setBookingSession] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const dates = movie.availableDates.slice(0, DAYS_SHOWN);
  const dateParam = searchParams.get("date");
  const selectedDate = dates.includes(dateParam) ? dateParam : dates[0];
  const {
    data: venues,
    isPending,
    isError,
    refetch,
  } = useMovieSessions(movie.slug, selectedDate);
  const isRestricted = isAgeRestricted(movie, user);

  function handleDateChange(date) {
    setSearchParams({ date }, { replace: true });
  }
  function handleSelect(session) {
    requireAuth((currentUser) => {
      if (isAgeRestricted(movie, currentUser)) return;
      setBookingSession(session);
    });
  }

  if (dates.length === 0) {
    return (
      <section>
        <h2 className={styles.heading}>Sessions</h2>
        <EmptyState message="Sessions will open soon." />
      </section>
    );
  }
  const sessionCount = venues?.reduce(
    (sum, venue) => sum + venue.sessions.length,
    0,
  );
  const dayLabel = `${getWeekday(selectedDate)} ${formatLongDate(selectedDate)}`;

  function renderBody() {
    if (isPending) {
      return (
        <div className={styles.venues} aria-busy="true">
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      );
    }
    if (isError) {
      return <ErrorState message="Couldn't load sessions." onRetry={refetch} />;
    }
    if (sessionCount === 0) {
      return <EmptyState message="No sessions on this date." />;
    }
    return (
      <div className={styles.venues}>
        {venues.map(({ venue, sessions }) => (
          <div key={venue.id}>
            <h3 className={styles.venueName}>{venue.name}</h3>
            <div className={styles.halls}>
              {groupByHall(sessions).map(({ hall, sessions: hallSessions }) => (
                <div key={hall.id} className={styles.hall}>
                  <p className={styles.hallName}>Hall {hall.name}</p>
                  <div className={styles.tickets}>
                    {hallSessions.map((session) => (
                      <SessionTicket
                        key={session.id}
                        session={session}
                        disabled={isRestricted}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <section>
      <h2 className={styles.heading}>Sessions</h2>
      <p className={styles.subtitle}>
        {isPending
          ? "Loading sessions..."
          : `${sessionCount} sessions on ${dayLabel}`}
      </p>
      <div className={styles.picker}>
        <DatePicker
          dates={dates}
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      {isRestricted && (
        <p className={styles.restricted} role="status">
          This film is rated ${movie.ageRating.code}.
        </p>
      )}
      {renderBody()}
      {bookingSession && (
        <BookingModal
          movie={movie}
          session={bookingSession}
          onClose={() => setBookingSession(null)}
        />
      )}
    </section>
  );
}

export default MovieSessions;
