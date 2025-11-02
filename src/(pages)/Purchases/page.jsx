import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Typography, IconButton, Avatar, Grid, Paper, Chip
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import SearchBar from "../../components/SearchBar";
import { useAuth } from "../../state/auth";

const Stat = ({ icon, label, value }) => (
  <Box sx={{ textAlign: "center", px: 2 }}>
    <Box sx={{ fontSize: 0 }}>{icon}</Box>
    <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
      {label}
    </Typography>
    {typeof value === "number" && (
      <Typography sx={{ fontWeight: 800, mt: 0.5 }}>{value}</Typography>
    )}
  </Box>
);

export default function PurchasesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const key = user?._id ? `purchases:${user._id}` : "purchases:guest";
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  }, [user?._id]);

  // นับตามสถานะ
  const toBePaid = useMemo(
    () => orders.filter(o => o.status === "Amount to be Paid").length,
    [orders]
  );
  const pendingDelivery = useMemo(
    () => orders.filter(o => o.status === "Pending Delivery").length,
    [orders]
  );
  const toBeReceived = useMemo(
    () => orders.filter(o => o.status === "To be received").length,
    [orders]
  );
  const toBeRated = useMemo(
    () => orders.filter(o => ["To be rated", "Completed"].includes(o.status)).length,
    [orders]
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fffde7", display: "flex", flexDirection: "column" }}>
      <Topbar />
      <SearchBar />

      <Container maxWidth="lg" sx={{ py: 2, flex: 1 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 1 }}>
          <ArrowBackIosNewIcon />
        </IconButton>

        {/* Header gradient */}
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            background: "linear-gradient(180deg,#ffd54f 0%, #ffa000 100%)",
            color: "#000",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ position: "relative", width: 96, height: 96 }}>
              <Avatar sx={{ width: 96, height: 96 }} src="" alt="profile" />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2, right: -2,
                  width: 28, height: 28,
                  bgcolor: "#fff",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,.2)"
                }}
                title="Change photo"
              >
                <PhotoCameraOutlinedIcon sx={{ fontSize: 18, color: "#444" }} />
              </Box>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              My Purchases
            </Typography>
          </Box>

          {/* สถิติ */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              borderRadius: 3,
              bgcolor: "#f3f8cf",
              p: { xs: 2, md: 3 },
            }}
          >
            <Grid container spacing={2} sx={{ textAlign: "center" }}>
              <Grid item xs={6} md={3}>
                <Stat icon={<PaymentsOutlinedIcon />} label="Amount to be Paid" value={toBePaid} />
              </Grid>
              <Grid item xs={6} md={3}>
                <Stat icon={<Inventory2OutlinedIcon />} label="Pending Delivery" value={pendingDelivery} />
              </Grid>
              <Grid item xs={6} md={3}>
                <Stat icon={<LocalShippingOutlinedIcon />} label="To be received" value={toBeReceived} />
              </Grid>
              <Grid item xs={6} md={3}>
                <Stat icon={<StarBorderOutlinedIcon />} label="Give a rating" value={toBeRated} />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* รายการสั่งซื้อ */}
        <Box sx={{ mt: 2 }}>
          {orders.length === 0 ? (
            <Typography color="text.secondary">ยังไม่มีประวัติคำสั่งซื้อ</Typography>
          ) : (
            orders.map(order => (
              <Paper
                key={order.id}
                elevation={0}
                sx={{ p: 2, mt: 2, borderRadius: 2, bgcolor: "#fff" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontWeight: 800 }}>
                    Order #{order.id}
                  </Typography>
                  <Chip size="small" label={order.status} color="warning" />
                </Box>
                <Typography sx={{ color: "text.secondary", fontSize: 13, mt: .5 }}>
                  {new Date(order.ts).toLocaleString()}
                </Typography>

                <Box sx={{ mt: 1.5, display: "grid", gap: 1 }}>
                  {order.lines.map((ln, idx) => (
                    <Box key={`${order.id}-${idx}`} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                      <img
                        src={ln.img || "/placeholder.png"}
                        alt={ln.name}
                        style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }}
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700 }}>{ln.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                          {ln.meta?.base || ""} {ln.meta?.size ? `• ${ln.meta.size}` : ""}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700 }}>x{ln.qty}</Typography>
                      <Typography sx={{ width: 100, textAlign: "right" }}>
                        {(ln.price * ln.qty).toLocaleString()} ฿
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Typography>รวมทั้งสิ้น</Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {(order.grand ?? order.total).toLocaleString()} ฿
                  </Typography>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}
