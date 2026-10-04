import { apiFetch } from "./client";

export async function updateProfile(values) {
  const res = await apiFetch("/profile", { method: "PUT", body: values });
  return res.data;
}
