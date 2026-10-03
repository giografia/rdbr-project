import { useSearchParams } from "react-router";

import { getNextDays } from "../../utils/date";

const LIST_KEYS = ["venues", "formats", "languages", "bands"];
const DAYS_SHOWN = 7;

function readList(searchParams, key) {
  const value = searchParams.get(key);
  return value ? value.split(",") : [];
}
export function useSessionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dates = getNextDays(DAYS_SHOWN);
  const dateParam = searchParams.get("data");

  const filters = {
    venues: readList(searchParams, "venues"),
    formats: readList(searchParams, "formats"),
    languages: readList(searchParams, "languages"),
    bands: readList(searchParams, "bands"),
    date: dates.includes(dateParam) ? dateParam : dates[0], // default today
    sort: searchParams.get("sort") || "time_asc",
    search: searchParams.get("search") || "",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
  };
  function update(changes, { resetPage = true } = {}) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        const text = Array.isArray(value)
          ? value.join(",")
          : String(value ?? "");
        if (text) next.set(key, text);
        else next.delete(key);
      });
      if (resetPage) next.delete("page");
      return next;
    });
  }
  function clearFilters() {
    update(Object.fromEntries(LIST_KEYS.map((key) => [key, []]))); //keep date and sort
  }
  function setPage(page) {
    update({ page }, { resetPage: false });
  }
  const activeCount = LIST_KEYS.reduce(
    (sum, key) => sum + filters[key].length,
    0,
  );

  return { filters, dates, activeCount, update, clearFilters, setPage };
}
