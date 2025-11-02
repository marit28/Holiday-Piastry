// src/(pages)/register/page.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth";
import { useAuth } from "../../state/auth";
import { loginApi, checkEmailApi, resetPasswordApi } from "../../api/auth";

const RegisterPage = () => {
  const { setUser } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [sb, setSb] = useState({ open: false, type: "info", msg: "" });

  const handleRegister = async () => {
    try {
      if (!email || !pw) throw new Error("Email/Password required");
      if (pw !== pw2) throw new Error("Password not match");
      const res = await registerApi({ name, email, password: pw });
      if (!res?.ok) throw new Error(res?.message || "Register failed");

      setUser(res.user);
      nav("/home");
    } catch (err) {
      setSb({ open: true, type: "error", msg: err?.response?.data?.message || err.message });
    }
  };

  return (
    <Box sx={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(180deg,#fff176 0%, #ffb300 45%, #ffb300 100%)" }}>
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h4" align="center" fontWeight={700} mb={2}>HOLIDAY PASTRY</Typography>
        <Typography variant="h5" align="center" fontWeight={600} mb={2}>Sign up</Typography>

        <TextField label="Name" fullWidth sx={{ mb:2, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor:"#fff" } }}
          value={name} onChange={(e)=>setName(e.target.value)} />
        <TextField label="Email" type="email" fullWidth sx={{ mb:2, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor:"#fff" } }}
          value={email} onChange={(e)=>setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth sx={{ mb:2, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor:"#fff" } }}
          value={pw} onChange={(e)=>setPw(e.target.value)} />
        <TextField label="Password Confirm" type="password" fullWidth sx={{ mb:2, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor:"#fff" } }}
          value={pw2} onChange={(e)=>setPw2(e.target.value)} />

        <Button fullWidth onClick={handleRegister}
          sx={{ py:1.2, borderRadius:999, bgcolor:"#f57c00", color:"#fff", fontWeight:700, "&:hover":{ bgcolor:"#ff9800" } }}>
          Sign up
        </Button>

        <Snackbar open={sb.open} autoHideDuration={2500} onClose={()=>setSb(s=>({...s, open:false}))}>
          <Alert severity={sb.type} onClose={()=>setSb(s=>({...s, open:false}))}>{sb.msg}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};
export default RegisterPage;
