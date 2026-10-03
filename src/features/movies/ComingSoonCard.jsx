import { useAuth } from "../auth/authContext";
import { useNotifyMe } from "./useMovies";
import { formatReleaseDate } from "../../utils/date";
import Badge from "../../components/ui/Badge";
import bellIcon from "../../assets/icons/bell.svg";
import checkIcon from "../../assets/icons/check.svg";
import styles from "./ComingSoonCard.module.css";

function ComingSoonCard({ movie }) {
  const { requireAuth } = useAuth();
  const notify = useNotifyMe();

  const genre = movie.genres[0]?.name;
  const meta = [genre, `${movie.runtimeMinutes} min`]
    .filter(Boolean)
    .join(" · ");

  function handleNotify() {
    requireAuth(() => notify.mutate(movie.id));
  }

  return (
    <article className={styles.card}>
      <img
        src={movie.backdropUrl}
        alt=""
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.body}>
        <p className={styles.date}>{formatReleaseDate(movie.releaseDate)}</p>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.meta}>{meta}</p>
        <Badge variant="accent">{movie.ageRating.code}</Badge>

        {movie.isNotified ? (
          <span className={`${styles.notify} ${styles.notified}`}>
            <img src={checkIcon} alt="" />
            Reminder set
          </span>
        ) : (
          <button
            type="button"
            className={styles.notify}
            onClick={handleNotify}
            disabled={notify.isPending}
          >
            <img src={bellIcon} alt="" />
            {notify.isPending ? "Saving..." : "Notify Me"}
          </button>
        )}
        {notify.isError && (
          <p className={styles.error}>Couldn't set reminder, Try again.</p>
        )}
      </div>
    </article>
  );
}

export default ComingSoonCard;
