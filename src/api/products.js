import { api } from "../lib/api";  // ✅ ใช้อันเดียวจาก lib/api.js


// GET all
export async function listProducts() {
  const { data } = await api.get("/products");
  return data;
}

// GET one
export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

// CREATE (with file upload)
export async function createProduct(payload) {
  const fd = new FormData();
fd.append("name", payload.name || "");
fd.append("price", payload.price ?? "");
fd.append("category", payload.category || "BS");
fd.append("description", payload.description || "");

// ✅ ต้องชื่อ imageMain / imageSide ตรงกัน
if (payload.imageMain) fd.append("imageMain", payload.imageMain);
if (Array.isArray(payload.imageSide)) {
  payload.imageSide.forEach(f => fd.append("imageSide", f)); // ได้หลายรูป
}
await api.post("/products", fd);
}

// DELETE
export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
// UPDATE one (PUT /products/:id)
export async function updateProduct(id, payload) {
  const fd = new FormData();
  fd.append("name", payload.name ?? "");
  fd.append("price", payload.price ?? "");
  fd.append("category", payload.category ?? "BS");
  fd.append("description", payload.description ?? "");

  // แนบไฟล์เฉพาะที่ผู้ใช้เลือกใหม่
  if (payload.imageMain) {
    fd.append("imageMain", payload.imageMain);
  }
  if (Array.isArray(payload.imageSide) && payload.imageSide.length) {
    payload.imageSide.forEach((f) => fd.append("imageSide", f));
  }

  const { data } = await api.put(`/products/${id}`, fd);
  return data;
}
