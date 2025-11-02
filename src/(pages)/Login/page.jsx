// src/(pages)/Login/page.jsx
import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Divider,
  IconButton, InputAdornment, Snackbar, Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { loginApi } from "../../api/auth";
import { useAuth } from "../../state/auth";
import { setAuthHeaders } from "../../lib/api";

// ปุ่มโค้งมนสไตล์เดียว ใช้ได้กับทั้ง Login / Create Account
const RoundedButton = ({ children, onClick, color = "#f57c00", hover = "#ff9800" }) => (
  <Box sx={{ position: "relative", mb: 2.5 }}>
    <Box
      sx={{
        position: "absolute",
        inset: -3,
        borderRadius: 999,
        border: "3px solid #1565d8",
        pointerEvents: "none",
      }}
    />
    <Button
      fullWidth
      onClick={onClick}
      sx={{
        py: 1.2,
        borderRadius: 999,
        bgcolor: color,
        color: "#fff",
        fontWeight: 700,
        letterSpacing: 0.3,
        boxShadow: "0 6px 16px rgba(0,0,0,.15)",
        "&:hover": { bgcolor: hover },
      }}
    >
      {children}
    </Button>
  </Box>
);

const LoginPage = () => {
  const nav = useNavigate();
  const { setUser, setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [sb, setSb] = useState({ open: false, type: "info", msg: "" });

  const handleLogin = async () => {
    try {
      const { user, token } = await loginApi({ email, password: pw });
      if (!user) throw new Error("Invalid response from server");

      // ✅ อัปเดต context
      setUser(user);
      setToken(token || "");

      // ✅ ตั้ง header ให้ axios ทุกคำขอถัดไป + เก็บลง localStorage (กันหายหลังรีเฟรช)
      setAuthHeaders({ token, userId: user?._id });
      localStorage.setItem("auth:user", JSON.stringify(user));
      localStorage.setItem("auth:token", token || "");

      nav(user.role === "admin" ? "/admin" : "/home");
    } catch (e) {
      console.error("login error:", e);
      setSb({
        open: true,
        type: "error",
        msg: e?.response?.data?.message || e.message || "Login failed",
      });
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "linear-gradient(180deg,#fff176 0%, #ffb300 45%, #ffb300 100%)"
    }}>
      <Topbar />

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ width: { xs: "90%", sm: 460 }, p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h3" sx={{ textAlign: "center", color: "#fff", fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,.25)", mb: 3 }}>
            Login
          </Typography>

          <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, backdropFilter: "blur(2px)" }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "#fff" } }}
            />
            <TextField
              label="Password"
              type={showPw ? "text" : "password"}
              fullWidth
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((s) => !s)} edge="end">
                      {showPw ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "#fff" } }}
            />

            {/* ลิงก์ลืมรหัสผ่าน */}
            <Box sx={{ textAlign: "right", mb: 2.5 }}>
              <Button variant="text" onClick={() => nav("/forgetpassword")} sx={{ fontWeight: 700, color: "#0d47a1" }}>
                Forgot password?
              </Button>
            </Box>

            {/* ปุ่ม Login (สไตล์เดียวกับ Sign up) */}
            <RoundedButton onClick={handleLogin}>Login</RoundedButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 1.5 }}>
              <Box sx={{ flex: 1 }}><Divider sx={{ borderColor: "rgba(0,0,0,.35)" }} /></Box>
              <Typography sx={{ color: "rgba(0,0,0,.6)", fontWeight: 600 }}>OR</Typography>
              <Box sx={{ flex: 1 }}><Divider sx={{ borderColor: "rgba(0,0,0,.35)" }} /></Box>
            </Box>

            {/* ปุ่ม Create Account (ใช้ RoundedButton แบบเดียวกัน) */}
            <RoundedButton onClick={() => nav("/register")}>Create Account</RoundedButton>
          </Box>
        </Box>
      </Box>

      <Snackbar open={sb.open} autoHideDuration={3000} onClose={() => setSb((s) => ({ ...s, open: false }))}>
        <Alert severity={sb.type} onClose={() => setSb((s) => ({ ...s, open: false }))}>{sb.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
