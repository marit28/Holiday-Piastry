export const API_BASE = "http://localhost:5000";
export const absUrl = (p) => (!p ? "" : p.startsWith("http") ? p : `${API_BASE}${p}`);