import { apiFetch } from "./client";

export async function getTickets(filter) {
  const res = await apiFetch(`/tickets?filter=${filter}`);
  return res.data;
}
export async function refundOrder(reference) {
  const res = await apiFetch(`/orders/${reference}/refund`, { method: "POST" });
  return res.data;
}
