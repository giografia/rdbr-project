import { Link } from "react-router";

import Badge from "../../components/ui/Badge";
import styles from "./RecentlyViewedCard.module.css";

function RecentlyViewedCard({ movie }) {
  const meta = [movie.genre, `${movie.runtimeMinutes} min`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link to={`/movies/${movie.id}`} className={styles.card}>
      <img
        src={movie.posterUrl}
        alt=""
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.body}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.meta}>{meta}</p>
        <Badge variant="accent">{movie.ageRating}</Badge>
      </div>
    </Link>
  );
}

export default RecentlyViewedCard;
