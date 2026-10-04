import Badge from "../../components/ui/Badge";
import SessionCard from "./SessionCard";
import styles from "./SessionGroup.module.css";

function SessionGroup({ movie, sessions, onSelect }) {
  return (
    <article className={styles.group}>
      <div className={styles.header}>
        <img
          src={movie.posterUrl}
          alt=""
          className={styles.poster}
          loading="lazy"
        />
        <div>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{movie.title}</h3>
            <Badge variant="accent">{movie.ageRating.code}</Badge>
          </div>
          <p className={styles.meta}>{movie.runtimeMinutes} min</p>
        </div>
      </div>

      <div className={styles.sessions}>
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} onSelect={onSelect} />
        ))}
      </div>
    </article>
  );
}

export default SessionGroup;
