import { api } from "./base"; // หรือจาก src/api/auth.js ที่มี axios instance baseURL แล้ว
let authHeaders = {};

export function attachAuthToPurchApi({ token, userId }) {
  authHeaders = {};
  if (token) authHeaders.Authorization = `Bearer ${token}`;
  if (userId) authHeaders["x-user-id"] = userId; // fallback
}

export async function createPurchase({ items, subtotal, shipping, total }) {
  const { data } = await api.post(
    "/purchases/checkout",
    { items, subtotal, shipping, total },
    { headers: authHeaders }
  );
  return data; // { ok, purchase:{id} }
}

export async function listPurchases() {
  const { data } = await api.get("/purchases", { headers: authHeaders });
  return data; // { ok, rows: [...] }
}
