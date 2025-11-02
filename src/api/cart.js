// src/api/cart.js
import axios from "axios";

export const cartApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ให้เรียกทุกครั้งหลัง login/logout หรือเมื่อ token/user เปลี่ยน
export function attachAuthToCartApi({ token, userId }) {
  cartApi.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  cartApi.defaults.headers.common["x-user-id"] = userId || "";
}

// ดึงตะกร้า
export async function fetchCart() {
  const { data } = await cartApi.get("/cart");
  // คาดหวัง { items: [...] }
  return data || { items: [] };
}

// บันทึกตะกร้า
export async function saveCart(items) {
  const { data } = await cartApi.put("/cart", { items: items || [] });
  return data || { ok: true };
}
