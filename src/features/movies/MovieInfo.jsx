import { formatLongDate } from "../../utils/date";
import styles from "./MovieInfo.module.css";

function MovieInfo({ movie }) {
  const items = [
    ["Director", movie.director],
    ["Main cast", movie.cast],
    ["Genre", movie.genres.map((g) => g.name).join(", ")],
    ["Duration", `${movie.runtimeMinutes} minutes`],
    ["Release date", formatLongDate(movie.releaseDate)],
    ["Formats", movie.formats.map((f) => f.name).join(", ")],
    ["From", `₾${movie.fromPrice}`],
  ].filter(([, value]) => value);

  return (
    <aside>
      <h2 className={styles.heading}>Details</h2>
      <dl className={styles.list}>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.note}>
        <p className={styles.noteTitle}>Rating note</p>
        <p className={styles.noteText}>
          <strong>{movie.ageRating.code}</strong> {movie.ageRating.description}
        </p>
      </div>
    </aside>
  );
}

export default MovieInfo;
