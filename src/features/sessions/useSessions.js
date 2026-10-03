import { useQuery } from "@tanstack/react-query";

import { getFilterOptions, getSessions } from "../../api/sessions";

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
    staleTime: Infinity, //fetch once and cachee it
  });
}
export function useSessions(params) {
  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () => getSessions(params),
  });
}
