import { apiFetch } from "./client";

export async function getFilterOptions() {
  const res = await apiFetch("/filter-options");
  return res.data;
}
function toQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(`${key}[]`, item));
    } else if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  return query.toString();
}

export function getSessions(params) {
  return apiFetch(`/sessions?${toQueryString(params)}`);
}
