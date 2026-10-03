import { useQuery } from "@tanstack/react-query";
import {
  getFeaturedMovies,
  getNowPlayingMovies,
  getComingSoonMovies,
} from "../../api/movies";

export function useFeaturedMovies() {
  return useQuery({
    queryKey: ["movies", "featured"],
    queryFn: getFeaturedMovies,
  });
}
export function useNowPlayingMovies() {
  return useQuery({
    queryKey: ["movies", "now-playing"],
    queryFn: getNowPlayingMovies,
  });
}
export function useComingSoonMovies() {
  return useQuery({
    queryKey: ["movies", "coming-soon"],
    queryFn: getComingSoonMovies,
  });
}

//returns data, ispending, iserror and refetch to be used. any component calling these functions make no duplicate requests
