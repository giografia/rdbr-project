import { useEffect } from "react";
import { useState } from "react";

import { useAuth } from "../features/auth/authContext";
import {
  useFilterOptions,
  useSessions,
} from "../features/sessions/useSessions";
import { useSessionFilters } from "../features/sessions/useSessionsFilters";
import FiltersPanel from "../features/sessions/FiltersPanel";
import SortDropdown from "../features/sessions/SortDropdown";
import SessionGroup from "../features/sessions/SessionGroup";
import Pagination from "../components/ui/Pagination";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import styles from "./SessionsPage.module.css";
import BookingModal from "../features/booking/BookingModal";

const SKELETON_GROUPS = 3;

function SessionsPage() {
  const { requireAuth } = useAuth();
  const { filters, dates, activeCount, update, clearFilters, setPage } =
    useSessionFilters();
  const options = useFilterOptions();
  const sessions = useSessions(filters);
  const [booking, setBooking] = useState(null);

  const meta = sessions.data?.meta;
  const groups = sessions.data?.data ?? [];

  //new page, scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  //if page numbers passes end jump to last page
  useEffect(() => {
    if (meta && meta.lastPage > 0 && filters.page > meta.lastPage)
      setPage(meta.lastPage);
  }, [meta, filters.page]);

  function handleSelect(movie, session) {
    requireAuth(() => {
      setBooking({ movie, session });
    });
  }
  function renderCounter() {
    if (sessions.isPending) return "Loading sessions...";
    if (sessions.isError) return "";
    return meta.totalSessions > 0
      ? `Showing ${meta.totalSessions} sessions`
      : "No sessions found";
  }
  function renderList() {
    if (sessions.isPending) {
      return (
        <div aria-busy="true">
          {Array.from({ length: SKELETON_GROUPS }, (_, i) => (
            <div key={i} className={styles.skeletonGroup}>
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonCards}>
                {Array.from({ length: 4 }, (_, j) => (
                  <div key={j} className={styles.skeletonCard} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (sessions.isError) {
      return (
        <ErrorState
          message="We couldn't load the sessions."
          onRetry={sessions.refetch}
        />
      );
    }
    if (groups.length === 0) {
      return (
        <div className={styles.empty}>
          <EmptyState message="No sessions match these filters" />
          {activeCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      );
    }
    return (
      <>
        {groups.map(({ movie, sessions: movieSessions }) => (
          <SessionGroup
            key={movie.id}
            movie={movie}
            sessions={movieSessions}
            onSelect={(session) => handleSelect(movie, session)}
          />
        ))}
        <Pagination
          current={meta.currentPage}
          last={meta.lastPage}
          onChange={setPage}
        />
      </>
    );
  }
  function renderFilters() {
    if (options.isPending) return <div className={styles.panelSkeleton} />;
    if (options.isError) {
      return (
        <ErrorState
          message="We couldn't load the filters."
          onRetry={options.refetch}
        />
      );
    }
    return (
      <FiltersPanel
        options={options.data}
        filters={filters}
        dates={dates}
        activeCount={activeCount}
        onChange={update}
        onClear={clearFilters}
      />
    );
  }
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Sessions</h1>
          <p className={styles.subtitle}>Browse showtimes across all venues</p>
        </header>
        <div className={styles.layout}>
          {renderFilters()}
          <section>
            <div className={styles.toolbar}>
              <p className={styles.counter}>{renderCounter()}</p>
              {options.data && (
                <SortDropdown
                  options={options.data.sorts}
                  values={filters.sort}
                  onChange={(sort) => update({ sort })}
                />
              )}
            </div>
            {renderList()}
          </section>
        </div>
      </div>
      {booking && (
        <BookingModal
          movie={booking.movie}
          session={booking.session}
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  );
}

export default SessionsPage;
