// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./state/auth.jsx";
import { CartProvider } from "./state/cart.jsx";
import { setAuthHeaders } from "./lib/api"; // ✅ boot headers

import LoginPage from "./(pages)/Login/page.jsx";
import RegisterPage from "./(pages)/register/page.jsx";
import ResetPasswordPage from "./(pages)/ForgetPassword/page.jsx";
import HomePage from "./(pages)/Home/page.jsx";
import ProductPage from "./(pages)/Product/page.jsx";
import SearchPage from "./(pages)/Searchpage/page.jsx";
import CartPage from "./(pages)/Cart/page.jsx";
import CheckoutPage from "./(pages)/Checkout/page.jsx";
import PurchasesPage from "./(pages)/Purchases/page.jsx";
import AdminPage from "./(pages)/Admin_Page/page.jsx";
import ProductAdmin from "./(pages)/Admin_Page/ProductAdmin.jsx";
import UserProfilePage from "./(pages)/Userprofile/page.jsx"; // ✅ เพิ่มหน้าโปรไฟล์

// ✅ ส่วนตรวจสอบสิทธิ์ admin
function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("auth:user") || "null");
  if (!user || user.role !== "admin") return <Navigate to="/home" replace />;
  return children;
}

// ✅ ส่วนตรวจสอบว่าต้อง login ก่อนถึงจะเข้าได้
function RequireAuth({ children }) {
  const token = localStorage.getItem("auth:token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  // ✅ boot headers ครั้งเดียวตอนเปิดเว็บ
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("auth:user") || "null");
      const t = localStorage.getItem("auth:token") || "";
      if (u?._id || t) setAuthHeaders({ token: t, userId: u?._id });
    } catch {}
  }, []);

  return (
    <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* ✅ หน้า public */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgetpassword" element={<ResetPasswordPage />} />

              {/* ✅ หน้า user */}
              <Route
                path="/home"
                element={
                  <RequireAuth>
                    <HomePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <RequireAuth>
                    <ProductPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/search"
                element={
                  <RequireAuth>
                    <SearchPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/cart"
                element={
                  <RequireAuth>
                    <CartPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <CheckoutPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/purchases"
                element={
                  <RequireAuth>
                    <PurchasesPage />
                  </RequireAuth>
                }
              />

              {/* ✅ หน้าโปรไฟล์ผู้ใช้ */}
              <Route
                path="/user"
                element={
                  <RequireAuth>
                    <UserProfilePage />
                  </RequireAuth>
                }
              />

              {/* ✅ หน้าแอดมิน */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/product/new"
                element={
                  <RequireAdmin>
                    <ProductAdmin />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <RequireAdmin>
                    <ProductAdmin />
                  </RequireAdmin>
                }
              />

              {/* ✅ default redirect */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
