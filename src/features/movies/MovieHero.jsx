import Badge from "../../components/ui/Badge";
import timerIcon from "../../assets/icons/timer.svg";
import styles from "./MovieHero.module.css";

function MovieHero({ movie }) {
  return (
    <section className={styles.hero}>
      <img src={movie.backdropUrl} alt="" className={styles.backdrop} />
      <div className={styles.overlay} />

      <div className={`container ${styles.inner}`}>
        <img
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          className={styles.poster}
        />

        <div className={styles.content}>
          <span className={styles.label}>
            {movie.isComingSoon ? "Coming soon" : "Now playing"}
          </span>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.synopsis}>{movie.synopsis}</p>

          <div className={styles.badges}>
            <Badge variant="accent">{movie.ageRating.code}</Badge>
            <Badge icon={timerIcon}>{movie.runtimeMinutes} Min</Badge>
            {movie.formats.map((format) => (
              <Badge key={format.id}>{format.name}</Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieHero;
