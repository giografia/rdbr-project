import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHold,
  createOrder,
  getSeatMap,
  releaseHold,
} from "../../api/booking";

export function useSeatMap(sessionId) {
  return useQuery({
    queryKey: ["seats", sessionId],
    queryFn: () => getSeatMap(sessionId),
    staleTime: 0,
    refetchOnMount: "always",
  });
}
export function useCreateHold(sessionId) {
  return useMutation({
    mutationFn: (seats) => createHold(sessionId, seats),
  });
}
export function useReleaseHold() {
  return useMutation({ mutationFn: releaseHold });
}
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] }); //refetched from server
      queryClient.invalidateQueries({ queryKey: ["sessions"] }); //seats released, seat count are stale
      queryClient.invalidateQueries({ queryKey: ["movie"] });
    },
  });
}
