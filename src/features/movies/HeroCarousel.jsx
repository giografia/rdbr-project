import { useEffect, useState } from "react";

import { useFeaturedMovies } from "./useMovies";
import { formatPremiereWeek } from "../../utils/date";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ErrorState from "../../components/ui/ErrorState";
import ticketIcon from "../../assets/icons/ticket.svg";
import timerIcon from "../../assets/icons/timer.svg";
import arrowDownIcon from "../../assets/icons/arrowDown.svg";
import styles from "./HeroCarousel.module.css";

const SLIDE_DURATION = 3500; //ms

function HeroCarousel() {
  const { data: movies, isPending, isError, refetch } = useFeaturedMovies();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = movies?.length ?? 0;

  //auto scroll, any manual scroll resets timer
  useEffect(() => {
    if (isPaused || count < 2) return;
    const timer = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % count);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, count]);

  if (isPending) {
    return (
      <section
        className={`${styles.hero} ${styles.skeleton}`}
        aria-busy="true"
      />
    );
  }

  if (isError) {
    return (
      <section className={styles.hero}>
        <div className={`container ${styles.errorWrap}`}>
          <ErrorState
            message="We couldn't load the featured films."
            onRetry={refetch}
          />
        </div>
      </section>
    );
  }

  if (count === 0) return null;

  function goTo(index) {
    setActiveIndex((index + count) % count);
  }

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured film"
    >
      {movies.map((movie, i) => {
        const isActive = i === activeIndex;

        return (
          <div
            key={movie.id}
            className={`${styles.slide} ${isActive ? styles.slideActive : ""}`}
            inert={!isActive}
          >
            <img src={movie.backdropUrl} alt="" className={styles.backdrop} />
            <div className={styles.overlay} />

            <div className={`container ${styles.slideInner}`}>
              <div className={styles.content}>
                <span className={styles.label}>
                  {formatPremiereWeek(movie.releaseDate)}
                </span>
                <h1 className={styles.title}>{movie.title}</h1>

                <div className={styles.badges}>
                  <Badge variant="accent">{movie.ageRating.code}</Badge>
                  <Badge icon={timerIcon}>{movie.runtimeMinutes} Min</Badge>
                  {movie.formats.map((format) => (
                    <Badge key={format.id}>{format.name}</Badge>
                  ))}
                </div>

                <p className={styles.synopsis}>{movie.synopsis}</p>

                <div className={styles.actions}>
                  <Button to={`/movies/${movie.id}`}>
                    <img src={ticketIcon} alt="" />
                    Buy tickets
                  </Button>
                  <Button to="/sessions" variant="ghost">
                    All sessions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className={`container ${styles.controls}`}>
        <div className={styles.progress}>
          {movies.map((movie, i) => (
            <button
              key={movie.id}
              type="button"
              className={`${styles.segment} ${i === activeIndex ? styles.segmentActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Show ${movie.title}`}
              aria-current={i === activeIndex}
            />
          ))}
        </div>

        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous film"
          >
            <img src={arrowDownIcon} alt="" />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next film"
          >
            <img src={arrowDownIcon} alt="" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
