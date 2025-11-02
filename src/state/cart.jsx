// src/state/cart.jsx
import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from "react";
import { fetchCart, saveCart, attachAuthToCartApi } from "../api/cart.js";
import { useAuth } from "./auth.jsx";

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const { user, token } = useAuth?.() || {};

  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart:v1") || "[]"); }
    catch { return []; }
  });

  const didLoadFromServer = useRef(false);
  const saveTimer = useRef(null);

  // แนบ auth ให้ API เมื่อ token/user เปลี่ยน
  useEffect(() => {
    attachAuthToCartApi({ token, userId: user?._id });
  }, [token, user?._id]);

  // ดึงจาก server ครั้งแรกหลังรู้ user
  useEffect(() => {
    (async () => {
      if (!user?._id) return;
      try {
        const { items: serverItems } = await fetchCart();
        if (Array.isArray(serverItems)) {
          setItems(prev => {
            // รวม local + server แบบฉลาด (key ชนกันให้ใช้ของใหม่)
            const map = new Map();
            [...serverItems, ...prev].forEach(it => map.set(it.key, it));
            return Array.from(map.values());
          });
          didLoadFromServer.current = true;
        }
      } catch (e) {
        console.warn("fetchCart failed:", e?.message);
      }
    })();
  }, [user?._id]);

  // sync localStorage ทุกครั้งที่ items เปลี่ยน
  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(items));
  }, [items]);

  // debounce บันทึกขึ้น server เมื่อ items เปลี่ยน (และมี user)
  useEffect(() => {
    if (!user?._id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveCart(items).catch(e => console.warn("saveCart debounce failed:", e?.message));
    }, 250);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [items, user?._id]);

  // ก่อนปิด/รีเฟรชหน้า ยิง saveCart อีกรอบ (best-effort)
  useEffect(() => {
    const handler = () => {
      try { navigator.sendBeacon && navigator.sendBeacon("http://localhost:5000/api/cart", new Blob([JSON.stringify({ items })], { type: "application/json" })); }
      catch {}
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [items]);

  // ฟังก์ชันพื้นฐาน
  const add = (line) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.key === line.key);
      if (i >= 0) {
        const cp = [...prev];
        cp[i] = { ...cp[i], qty: (cp[i].qty || 1) + (line.qty || 1) };
        return cp;
      }
      return [...prev, { ...line, qty: line.qty || 1 }];
    });
  };
  const inc = key => setItems(prev => prev.map(it => it.key === key ? { ...it, qty: it.qty + 1 } : it));
  const dec = key => setItems(prev => prev.map(it => it.key === key ? { ...it, qty: Math.max(1, it.qty - 1) } : it));
  const remove = key => setItems(prev => prev.filter(it => it.key !== key));
  const total = useMemo(() => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0), [items]);

  const clear = async () => {
    setItems([]);
    localStorage.removeItem("cart:v1");
    try { if (user?._id) await saveCart([]); } catch {}
  };

  return (
    <Ctx.Provider value={{ items, add, inc, dec, remove, total, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
