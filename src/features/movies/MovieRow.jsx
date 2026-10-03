import { Link } from "react-router";

import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import styles from "./MovieRow.module.css";

const SKELETON_COUNT = 6;

function MovieRow({
  title,
  seeAllTo,
  query,
  renderCard,
  skeletonSize,
  emptyMessage,
  uppercaseTitle = true,
}) {
  const { data, isPending, isError, refetch } = query;

  function renderBody() {
    if (isPending) {
      return (
        <div className={styles.row} aria-busy="true">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div key={i} className={styles.skeleton} style={skeletonSize} />
          ))}
        </div>
      );
    }
    if (isError) {
      return (
        <ErrorState
          message={`We couldn't load %{title.toLowerCase()}.`}
          onRetry={refetch}
        />
      );
    }
    if (data.length === 0) {
      return <EmptyState message={emptyMessage} />;
    }
    return <div className={styles.row}>{data.map(renderCard)}</div>;
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <h2
            className={`${styles.title} ${uppercaseTitle ? styles.uppercase : ""}`}
          >
            {title}
          </h2>
          {seeAllTo && (
            <Link to={seeAllTo} className={styles.seeAll}>
              See all
            </Link>
          )}
        </header>
        {renderBody()}
      </div>
    </section>
  );
}

//render prop - passing renderCard function by page, allows one MovieRow to show two different card types

export default MovieRow;
