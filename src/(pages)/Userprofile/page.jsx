import React, { useRef, useState, useEffect } from "react";
import { api } from "../../lib/api";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Grid,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Slide,
  Container,
  InputAdornment,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Topbar from "../../components/Topbar";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/Footer";

const DEFAULT_PROFILE_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
const DEFAULT_BANK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/166/166527.png";

function SuccessAlert({ open, onClose, message }) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionComponent={Slide}
      autoHideDuration={2000}
    >
      <Alert severity="success" sx={{ width: 300, fontSize: 18 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Success
          </Typography>
          <Typography sx={{ fontSize: 14, mb: 1 }}>{message}</Typography>
          <Button
            sx={{ mt: 0.5, fontWeight: 700 }}
            variant="contained"
            color="success"
            onClick={onClose}
          >
            OK
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
}

export default function UserProfilePage() {
  const [page, setPage] = useState("account");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorOpen, setErrorOpen] = useState("");
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [bankImage, setBankImage] = useState(DEFAULT_BANK_IMAGE);
  const profileInputRef = useRef();
  const bankInputRef = useRef();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    bankFirst: "",
    bankLast: "",
    bankNumber: "",
    bankType: "",
  });

  const norm = (v) => (v == null ? "" : String(v));

  useEffect(() => {
    let alive = true;
    api
      .get("/user/me")
      .then((res) => {
        if (!alive) return;
        const u = res.data || {};
        setUserData({
          username: norm(u.username),
          email: norm(u.email),
          phone: norm(u.phone),
          address: norm(u.address),
          bankFirst: norm(u.bankFirst),
          bankLast: norm(u.bankLast),
          bankNumber: norm(u.bankNumber),
          bankType: norm(u.bankType),
        });
        if (u.profileImage) setProfileImage(norm(u.profileImage));
        if (u.bankImage) setBankImage(norm(u.bankImage));
      })
      .catch((err) => console.error("❌ GET /user/me failed:", err));
    return () => {
      alive = false;
    };
  }, []);

  const handleSave = async (newData, targetPage = "account") => {
    try {
      const payload = { ...userData, ...newData, profileImage, bankImage };
      await api.put("/user/me", payload);
      setUserData(payload);
      setSuccessMsg("Information updated successfully!");
      setSuccessOpen(true);
      setTimeout(() => setPage(targetPage), 1500);
    } catch (err) {
      console.error("❌ PUT /user/me failed:", err);
      setErrorOpen("Save failed, please try again");
    }
  };

  const renderBackBtn = () => (
    <IconButton
      onClick={() => setPage("account")}
      sx={{ position: "absolute", top: 32, left: 24, color: "#333" }}
      aria-label="back"
      size="large"
    >
      <ArrowBackIosNewIcon fontSize="medium" />
    </IconButton>
  );

  // ---------- Account ----------
  const AccountPage = () => (
    <Card sx={mainCardStyle}>
      <Typography variant="h6" sx={cardTitleStyle}>
        HOLIDAY PASTRY
      </Typography>
      <Box sx={profileBoxStyle}>
        <Avatar src={profileImage} sx={avatarStyle} />
        <IconButton
          sx={cameraIconStyle}
          onClick={() => profileInputRef.current.click()}
          aria-label="upload"
        >
          <CameraAltIcon />
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setProfileImage(String(reader.result || ""));
              reader.readAsDataURL(file);
            }}
            style={{ display: "none" }}
          />
        </IconButton>
        <Typography sx={{ fontSize: 12, mb: 2 }}>Edit Profile</Typography>
      </Box>
      <CardContent>
        <Typography>User name</Typography>
        <TextField size="small" fullWidth sx={fieldStyle} value={userData.username} InputProps={{ readOnly: true }} />
        <Typography>Email</Typography>
        <TextField size="small" fullWidth sx={fieldStyle} value={userData.email} InputProps={{ readOnly: true }} />
        <Typography>Phone</Typography>
        <TextField size="small" fullWidth sx={fieldStyle} value={userData.phone} InputProps={{ readOnly: true }} />
        <Typography>Address</Typography>
        <TextField size="small" fullWidth sx={fieldStyle} value={userData.address} InputProps={{ readOnly: true }} />
        <Typography>Bank Information</Typography>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField size="small" fullWidth value={userData.bankFirst} InputProps={{ readOnly: true }} placeholder="First Name" sx={fieldStyle} />
          </Grid>
          <Grid item xs={4}>
            <TextField size="small" fullWidth value={userData.bankLast} InputProps={{ readOnly: true }} placeholder="Last Name" sx={fieldStyle} />
          </Grid>
          <Grid item xs={4}>
            <TextField size="small" fullWidth value={userData.bankType} InputProps={{ readOnly: true }} placeholder="Bank" sx={fieldStyle} />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button onClick={() => setPage("password")} color="primary" variant="contained" sx={btnStyle}>Change Password</Button>
          <Button onClick={() => setPage("setting")} color="warning" variant="contained" sx={btnStyle}>Edit</Button>
          <Button onClick={() => setPage("address")} color="success" variant="contained" sx={btnStyle}>Address</Button>
        </Box>
      </CardContent>
    </Card>
  );

  // ---------- Address ----------
  const AddressPage = () => {
    const [address, setAddress] = useState(userData.address);
    return (
      <Card sx={mainCardStyle}>
        {renderBackBtn()}
        <Typography variant="h6" sx={cardTitleStyle}>ADDRESS INFO</Typography>
        <CardContent>
          <Typography>Address</Typography>
          <TextField
            size="small"
            fullWidth
            sx={fieldStyle}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Province, District, Subdistrict, House number, Street"
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: "100%" }}
            onClick={() => handleSave({ address }, "account")}
          >
            Save
          </Button>
        </CardContent>
      </Card>
    );
  };

  // ---------- Setting ----------
  const SettingPage = () => {
    const [form, setForm] = useState({
      username: userData.username,
      phone: userData.phone,
      bankFirst: userData.bankFirst,
      bankLast: userData.bankLast,
      bankType: userData.bankType,
    });
    const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
    return (
      <Card sx={mainCardStyle}>
        {renderBackBtn()}
        <Typography variant="h6" sx={cardTitleStyle}>EDIT PROFILE</Typography>
        <CardContent>
          <Typography>User name</Typography>
          <TextField size="small" fullWidth sx={fieldStyle} value={form.username} onChange={(e) => handleChange("username", e.target.value)} />
          <Typography>Phone</Typography>
          <TextField size="small" fullWidth sx={fieldStyle} value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          <Typography>Bank Information</Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField size="small" fullWidth value={form.bankFirst} onChange={(e) => handleChange("bankFirst", e.target.value)} placeholder="First Name" sx={fieldStyle} />
            </Grid>
            <Grid item xs={4}>
              <TextField size="small" fullWidth value={form.bankLast} onChange={(e) => handleChange("bankLast", e.target.value)} placeholder="Last Name" sx={fieldStyle} />
            </Grid>
            <Grid item xs={4}>
              <TextField size="small" fullWidth value={form.bankType} onChange={(e) => handleChange("bankType", e.target.value)} placeholder="Bank" sx={fieldStyle} />
            </Grid>
          </Grid>
          <Typography sx={{ mt: 1 }}>Upload Bank Account Image</Typography>
          <Box sx={{ position: "relative", mb: 2, mt: 1 }}>
            <img
              src={bankImage}
              alt="bank"
              style={{
                width: 120,
                height: 68,
                borderRadius: 6,
                border: "1.5px solid #ddd",
                background: "#fff",
              }}
              onClick={() => bankInputRef.current.click()}
            />
            <input
              type="file"
              accept="image/*"
              ref={bankInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => setBankImage(String(reader.result || ""));
                reader.readAsDataURL(file);
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button color="primary" variant="contained" sx={btnStyle} onClick={() => handleSave(form, "account")}>Save</Button>
            <Button color="error" variant="contained" sx={btnStyle} onClick={() => setPage("account")}>Cancel</Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // ---------- Change Password ----------
  const PasswordPage = () => {
    const [oldPwd, setOldPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState({ old: false, new: false, confirm: false });

    const changePassword = async () => {
      if (!oldPwd || !newPwd || !confirm)
        return setErrorOpen("Please fill all fields");
      if (newPwd !== confirm)
        return setErrorOpen("Passwords do not match");
      try {
        await api.post("/auth/reset-password", {
          email: userData.email,
          oldPassword: oldPwd,
          newPassword: newPwd,
        });
        setSuccessMsg("Password changed successfully!");
        setSuccessOpen(true);
        setTimeout(() => setPage("account"), 2000);
      } catch (err) {
        setErrorOpen(err?.response?.data?.message || "Password change failed");
      }
    };

    return (
      <Card sx={mainCardStyle}>
        {renderBackBtn()}
        <Typography variant="h6" sx={cardTitleStyle}>CHANGE PASSWORD</Typography>
        <CardContent>
          {["Current Password", "New Password", "Confirm Password"].map((label, i) => {
            const keys = ["old", "new", "confirm"];
            const values = [oldPwd, newPwd, confirm];
            const setFns = [setOldPwd, setNewPwd, setConfirm];
            return (
              <React.Fragment key={i}>
                <Typography>{label}</Typography>
                <TextField
                  size="small"
                  fullWidth
                  sx={fieldStyle}
                  type={show[keys[i]] ? "text" : "password"}
                  value={values[i]}
                  onChange={(e) => setFns[i](e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShow((p) => ({ ...p, [keys[i]]: !p[keys[i]] }))}>
                          {show[keys[i]] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </React.Fragment>
            );
          })}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button color="primary" variant="contained" sx={btnStyle} onClick={changePassword}>Save Changes</Button>
            <Button color="error" variant="contained" sx={btnStyle} onClick={() => setPage("account")}>Cancel</Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fffde7", display: "flex", flexDirection: "column" }}>
      <Topbar />
      <SearchBar />
      <Container
        maxWidth="sm"
        sx={{
          py: 5,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {page === "account" && <AccountPage />}
        {page === "address" && <AddressPage />}
        {page === "setting" && <SettingPage />}
        {page === "password" && <PasswordPage />}
        <SuccessAlert open={successOpen} onClose={() => setSuccessOpen(false)} message={successMsg} />
        <Snackbar
          open={!!errorOpen}
          onClose={() => setErrorOpen("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={2000}
        >
          <Alert severity="error" sx={{ width: 300 }}>
            {errorOpen}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </Box>
  );
}

// ---------- STYLES ----------
const mainCardStyle = {
  bgcolor: "linear-gradient(180deg, #ffe366 0%, #ffd115 60%, #ffb114 100%)",
  borderRadius: 4,
  minWidth: 370,
  maxWidth: 500,
  width: "100%",
  py: 1.5,
  px: 2.5,
  boxShadow: 6,
  position: "relative",
};
const cardTitleStyle = {
  fontWeight: 700,
  color: "#fff",
  textShadow: "0 2px 5px #e7a708",
  pt: 2,
  pb: 1,
  textAlign: "center",
};
const avatarStyle = { width: 72, height: 72, bgcolor: "#fafafa", border: "3px solid #fffde7", mt: 2 };
const cameraIconStyle = { position: "absolute", bottom: 24, right: 45, bgcolor: "#fff", border: "1.5px solid #ddd", ":hover": { bgcolor: "#fafafa" }, zIndex: 2, p: 0.5 };
const profileBoxStyle = { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", mb: 1.5 };
const fieldStyle = { mb: 1, bgcolor: "#fff" };
const btnStyle = { fontWeight: 700, flex: 1 };
