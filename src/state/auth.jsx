// src/state/auth.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthHeaders } from "../lib/api";

// shape: { user, token, setUser, setToken, logout }
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // โหลดค่าจาก localStorage ตอนเริ่ม
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem("token") || ""; }
    catch { return ""; }
  });

  // sync ลง localStorage และแนบเฮดเดอร์ให้ axios api
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    setAuthHeaders({ token, userId: user?._id });
  }, [user, token]);

  // ให้ฟังก์ชัน logout ล้างทุกอย่างที่เกี่ยวกับ auth
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // อัปเดตเฮดเดอร์ (ให้ไม่มี token/userId)
    setAuthHeaders({ token: "", userId: "" });
  };

  const value = useMemo(() => ({
    user, token, setUser, setToken, logout
  }), [user, token]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
