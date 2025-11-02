// src/lib/img.js
export const FILE_BASE =
  import.meta.env.VITE_FILE_BASE || "http://localhost:5000";

// ฟังก์ชันแปลงชื่อไฟล์หรือ path เป็น URL เต็ม
export function resolveImg(v) {
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("/uploads")) return `http://localhost:5000${v}`;
  return `http://localhost:5000/uploads/${v}`;
}


