import { useState } from "react";
import { useSearchParams } from "react-router";

import { useTickets } from "./useTickets";
import TicketCard from "./TicketCard";
import RefundModal from "./RefundModal";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import styles from "./MyTickets.module.css";

const VIEWS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

function MyTickets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") === "past" ? "past" : "upcoming";
  const upcoming = useTickets("upcoming");
  const past = useTickets("past");
  const queries = { upcoming, past };
  const current = queries[view];
  const [refunding, setRefunding] = useState(null);

  function selectView(next) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("view", next);
        return params;
      },
      { replace: true },
    );
  }
  function renderList() {
    if (current.isPending) {
      return (
        <div className={styles.list} aria-busy="true">
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      );
    }
    if (current.isError) {
      return (
        <ErrorState
          message="We couldn't load you tickets."
          onRetry={current.refetch}
        />
      );
    }
    if (current.data.length === 0) {
      return view === "upcoming" ? (
        <div className={styles.empty}>
          <EmptyState message="No upcoming tickets yet." />
          <Button to="/sessions">Browse sessions</Button>
        </div>
      ) : (
        <EmptyState message="No past tickets yet." />
      );
    }
    return (
      <div className={styles.list}>
        {current.data.map((order) => (
          <TicketCard key={order.id} order={order} onRefund={setRefunding} />
        ))}
      </div>
    );
  }
  return (
    <section>
      <div className={styles.switch} role="tablist">
        {VIEWS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            className={`${styles.option} ${view === id ? styles.selected : ""}`}
            onClick={() => selectView(id)}
          >
            {label}
            {queries[id].data && (
              <span className={styles.count}>{queries[id].data.length}</span>
            )}
          </button>
        ))}
      </div>
      {renderList()}
      {refunding && (
        <RefundModal order={refunding} onClose={() => setRefunding(null)} />
      )}
    </section>
  );
}

export default MyTickets;
