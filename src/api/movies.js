import { apiFetch } from "./client";

export async function getFeaturedMovies() {
  const res = await apiFetch("/movies/featured");
  return res.data;
}
export async function getNowPlayingMovies() {
  const res = await apiFetch("/movies/now-playing");
  return res.data;
}
export async function getComingSoonMovies() {
  const res = await apiFetch("/movies/coming-soon");
  return res.data;
}
export async function notifyMe(movieId) {
  await apiFetch(`/movies/${movieId}/notify`, { method: "POST" });
}
