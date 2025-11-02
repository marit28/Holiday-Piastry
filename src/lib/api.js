// src/lib/api.js
import axios from "axios";

// ชี้ไป backend ของโปรเจกต์
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// แนบ/ล้างเฮดเดอร์ auth ให้ทุก request ที่ยิงผ่าน api instance นี้
export function setAuthHeaders({ token, userId }) {
  // Authorization
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
  // x-user-id (สำหรับ route ที่คุณทำ requireAuth แบบอ่าน x-user-id ก็ได้)
  if (userId) {
    api.defaults.headers.common["x-user-id"] = userId;
  } else {
    delete api.defaults.headers.common["x-user-id"];
  }
}
