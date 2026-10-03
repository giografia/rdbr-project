import { Link } from "react-router";

import Badge from "../../components/ui/Badge";
import styles from "./NowPlayingCard.module.css";

function NowPlayingCard({ movie }) {
  const genre = movie.genres[0]?.name;
  const meta = [genre, `${movie.runtimeMinutes} min`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link to={`/movies/${movie.id}`} className={styles.card}>
      <img
        src={movie.posterUrl}
        alt=""
        className={styles.poster}
        loading="lazy"
      />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.meta}>{meta}</p>
      </div>
      <Badge variant="accent">{movie.ageRating.code}</Badge>
      <p className={styles.synopsis}>{movie.synopsis}</p>
      <div className={styles.footer}>
        <span className={styles.price}>From ₾ {movie.fromPrice}</span>
        <span className={styles.buy}>Buy Ticket</span>{" "}
        {/*span not button because buttons not allowed in link */}
      </div>
    </Link>
  );
}

export default NowPlayingCard;
