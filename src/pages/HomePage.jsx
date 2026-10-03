import { useState } from "react";

import HeroCarousel from "../features/movies/HeroCarousel";
import MovieRow from "../features/movies/MovieRow";
import NowPlayingCard from "../features/movies/NowPlayingCard";
import ComingSoonCard from "../features/movies/ComingSoonCard";
import {
  useNowPlayingMovies,
  useComingSoonMovies,
} from "../features/movies/useMovies";
import { getRecentlyViewed } from "../utils/recentlyViewed";
import RecentlyViewedCard from "../features/movies/RecentlyViewedCard";

function HomePage() {
  const nowPlaying = useNowPlayingMovies();
  const comingSoon = useComingSoonMovies();
  const [recentlyViewed] = useState(getRecentlyViewed);

  return (
    <>
      <HeroCarousel />
      {recentlyViewed.length > 0 && (
        <MovieRow
          title="Recently viewed"
          uppercaseTitle={false}
          query={{ data: recentlyViewed, isPending: false, isError: false }}
          renderCard={(movie) => (
            <RecentlyViewedCard key={movie.id} movie={movie} />
          )}
        />
      )}
      <MovieRow
        title="Now Playing"
        seeAllTo="/sessions"
        query={nowPlaying}
        skeletonSize={{ width: 260, height: 452 }}
        emptyMessage="No films are showing right now."
        renderCard={(movie) => <NowPlayingCard key={movie.id} movie={movie} />}
      />
      <MovieRow
        title="Coming Soon..."
        query={comingSoon}
        skeletonSize={{ width: 470, height: 160 }}
        emptyMessage="No upcoming films yet."
        renderCard={(movie) => <ComingSoonCard key={movie.id} movie={movie} />}
      />
    </>
  );
}

export default HomePage;
