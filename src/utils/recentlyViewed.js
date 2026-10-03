const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 6;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return []; // show nothing if something wrong
  }
}
export function addRecentlyViewed(movie) {
  const entry = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.posterUrl,
    runtimeMinutes: movie.runtimeMinutes,
    genre: movie.genres[0]?.name ?? null,
    ageRating: movie.ageRating.code,
  };
  const list = [
    entry,
    ...getRecentlyViewed().filter((m) => m.id !== movie.id),
  ].slice(0, MAX_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    //storage full or something else wrong
  }
}
