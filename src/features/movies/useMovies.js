import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFeaturedMovies,
  getNowPlayingMovies,
  getComingSoonMovies,
  notifyMe,
} from "../../api/movies";
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

//returns data, ispending, iserror and refetch to be used. any component calling these functions make no duplicate requests
