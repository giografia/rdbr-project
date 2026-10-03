import { useEffect } from "react";
import { useParams } from "react-router";

import { useMovie } from "../features/movies/useMovies";
import { addRecentlyViewed } from "../utils/recentlyViewed";
import MovieHero from "../features/movies/MovieHero";
import MovieSessions from "../features/movies/MovieSessions";
import MovieInfo from "../features/movies/MovieInfo";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import styles from "./MovieDetailsPage.module.css";

function MovieDetailsPage() {
  const { slug } = useParams();
  const { data: movie, isPending, isError, error, refetch } = useMovie(slug);

  useEffect(() => {
    if (movie) addRecentlyViewed(movie);
  }, [movie]);

  if (isPending) {
    return <div className={styles.heroSkeleton} aria-busy="true" />;
  }
  if (isError) {
    return (
      <div className={`container ${styles.message}`}>
        {error.status === 404 ? (
          <EmptyState message="Couldn't find this film." />
        ) : (
          <ErrorState message="Couldn't load this film." onRetry={refetch} />
        )}
      </div>
    );
  }
  return (
    <>
      <MovieHero movie={movie} />
      <div className={styles.body}>
        <div className={`container ${styles.layout}`}>
          <MovieSessions movie={movie} />
          <MovieInfo movie={movie} />
        </div>
      </div>
    </>
  );
}

export default MovieDetailsPage;
