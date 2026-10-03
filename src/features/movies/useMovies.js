import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getFeaturedMovies,
  getNowPlayingMovies,
  getComingSoonMovies,
  notifyMe,
} from "../../api/movies";
import { getMovie } from "../../api/movies";
import { getMovieSessions } from "../../api/movies";
import { useAuth } from "../auth/authContext";

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
  const { user, isBooting } = useAuth();
  return useQuery({
    queryKey: ["movies", "coming-soon", user?.id ?? "guest"],
    queryFn: getComingSoonMovies,
    enabled: !isBooting, //waiting until someone logs in
  });
}
export function useNotifyMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notifyMe, //refetching data from server after a change
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["movies", "coming-soon"] }),
  });
}
export function useMovie(id) {
  return useQuery({ queryKey: ["movie", id], queryFn: () => getMovie(id) });
}
export function useMovieSessions(id, date) {
  return useQuery({
    queryKey: ["movie", id, "sessions", date],
    queryFn: () => getMovieSessions(id, date),
    enabled: Boolean(date), //coming soon film could have no date yet
  });
}

//returns data, ispending, iserror and refetch to be used. any component calling these functions make no duplicate requests
