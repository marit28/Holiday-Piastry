// src/(pages)/ForgetPassword/page.jsx
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import Topbar from "../../components/Topbar";
import { checkEmailApi, resetPasswordApi } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const nav = useNavigate();

  const [step, setStep] = useState("email"); // 'email' | 'password'
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [sb, setSb] = useState({ open: false, type: "info", msg: "" });
  const openSb = (type, msg) => setSb({ open: true, type, msg });

  const doCheck = async () => {
    const e = email.trim().toLowerCase();
    if (!e) return openSb("error", "Please enter your email address");
    try {
      const res = await checkEmailApi(e);
      const found = !!(res?.ok && (res?.exists === true || !!res?.email));
      if (found) {
        openSb("success", `Email found: ${res?.email || e}. Please set a new password.`);
        setStep("password");
      } else {
        openSb("error", "Email not found");
      }
    } catch (err) {
      console.error(err);
      openSb("error", err?.response?.data?.message || "Check email failed");
    }
  };

  const doReset = async () => {
    const e = email.trim().toLowerCase();
    if (!e) return openSb("error", "Email is required");
    if (!pw) return openSb("error", "Please enter a new password");
    if (pw !== pw2) return openSb("error", "Passwords do not match");

    try {
      const res = await resetPasswordApi(e, pw); // ← ส่ง newPassword แน่ ๆ
      if (res?.ok) {
        openSb("success", res?.message || "Password reset successful");
        setTimeout(() => nav("/login"), 900);
      } else {
        openSb("error", res?.message || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      openSb("error", err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column",
      background: "linear-gradient(180deg,#fff176 0%, #ffb300 45%, #ffb300 100%)" }}>
      <Topbar />

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ width: { xs: "90%", sm: 460 }, p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h3" sx={{ textAlign: "center", color: "white", fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,.25)", mb: 3 }}>
            Reset Your Password
          </Typography>

          <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, backdropFilter: "blur(2px)", bgcolor: "transparent" }}>
            {step === "email" && (
              <>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "white" } }}
                />
                <Button
                  fullWidth
                  onClick={doCheck}
                  sx={{ py: 1.2, borderRadius: 999, bgcolor: "#f57c00", color: "white", fontWeight: 700,
                    letterSpacing: 0.3, boxShadow: "0 6px 16px rgba(0,0,0,.15)", "&:hover": { bgcolor: "#ff9800" } }}
                  endIcon={<LockResetIcon />}
                >
                  Continue
                </Button>
              </>
            )}

            {step === "password" && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "white" } }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "white" } }}
                />
                <Button
                  fullWidth
                  onClick={doReset}
                  sx={{ py: 1.2, borderRadius: 999, bgcolor: "#f57c00", color: "white", fontWeight: 700,
                    letterSpacing: 0.3, boxShadow: "0 6px 16px rgba(0,0,0,.15)", "&:hover": { bgcolor: "#ff9800" } }}
                  endIcon={<LockResetIcon />}
                >
                  Reset Password
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar open={sb.open} autoHideDuration={2500} onClose={() => setSb((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSb((s) => ({ ...s, open: false }))} severity={sb.type} sx={{ width: "100%" }}>
          {sb.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPasswordPage;
