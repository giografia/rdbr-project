import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTickets, refundOrder } from "../../api/tickets";
import { useAuth } from "../auth/authContext";

export function useTickets(filter) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tickets", user?.id, filter], //per user so accounts dont mix up
    queryFn: () => getTickets(filter),
    enabled: Boolean(user),
  });
}
export function useRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refundOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] }); //refetched from server
      queryClient.invalidateQueries({ queryKey: ["sessions"] }); //seats released, seat count are stale
      queryClient.invalidateQueries({ queryKey: ["movie"] });
    },
  });
}
