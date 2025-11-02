import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import Topbar from "../../components/Topbar";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/Footer";
import { useCart } from "../../state/cart.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../state/auth.jsx";

const qrcode = "http://localhost:5000/uploads/1QR.jpg";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sec, setSec] = useState(15 * 60);
  useEffect(() => {
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mmss = useMemo(() => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m} : ${s}`;
  }, [sec]);

  const shipping = 0;
  const grand = total + shipping;

  const onPaymentCompleted = async () => {
    try {
      const key = user?._id ? `purchases:${user._id}` : "purchases:guest";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");

      const order = {
        id: `odr_${Date.now()}`,
        ts: new Date().toISOString(),
        lines: items.map(it => ({
          key: it.key,
          name: it.name,
          price: it.price,
          qty: it.qty,
          img: it.img || "",
          meta: it.meta || {},
        })),
        total,
        shipping,
        grand,
        status: "To be received",
      };

      localStorage.setItem(key, JSON.stringify([order, ...prev]));
    } catch (e) {
      console.error("save purchases failed:", e);
    }

    await clear();
    navigate("/purchases");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fffde7", display: "flex", flexDirection: "column" }}>
      <Topbar />
      <SearchBar />

      <Container maxWidth="lg" sx={{
        py: 3,
        flex: 1,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 380px" },
        gap: 3,
      }}>
        {/* ซ้าย: QR + ปุ่ม */}
        <Box sx={{ bgcolor: "#fff176", borderRadius: 4, p: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Checkout
          </Typography>

          <Typography fontWeight={700} align="right" sx={{ mb: 1 }}>
            {mmss}
          </Typography>

          <Box sx={{
            mx: "auto",
            width: { xs: 280, md: 360 },
            height: { xs: 280, md: 360 },
            borderRadius: 3,
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 0 10px rgba(0,0,0,.06)",
          }}>
            <img
              src={qrcode}
              alt="QR Code"
              style={{ width: "75%", height: "75%", objectFit: "contain", borderRadius: 12 }}
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
          </Box>

          <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center" }}>
            <button
              style={{
                background: "#ffa000",
                color: "#fff",
                border: 0,
                borderRadius: 12,
                padding: "10px 22px",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={onPaymentCompleted}
            >
              PAYMENT COMPLETED
            </button>
          </Box>
        </Box>

        {/* ขวา: สรุปตะกร้า */}
        <Box sx={{ bgcolor: "#ffb74d", borderRadius: 2.5, p: 2.5, color: "#fff" }}>
          <Typography variant="h5" fontWeight={800} mb={2}>
            Shopping Bag
          </Typography>

          {items.map((it) => (
            <Box key={it.key} sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
              <img
                src={it.img || "/placeholder.png"}
                alt={it.name}
                style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700}>{it.name}</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  {it.meta?.base} {it.meta?.size ? `• ${it.meta.size}` : ""}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>{it.price.toLocaleString()} ฿</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700 }}>x{it.qty}</Typography>
            </Box>
          ))}

          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,.5)" }} />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 0.5 }}>
            <Typography>Subtotal</Typography>
            <Typography>{total.toLocaleString()} ฿</Typography>

            <Typography>Shipping</Typography>
            <Typography>{shipping === 0 ? "Free" : `${shipping.toLocaleString()} ฿`}</Typography>

            <Divider sx={{ gridColumn: "1 / -1", my: 1, borderColor: "rgba(255,255,255,.5)" }} />

            <Typography fontWeight={800}>Total</Typography>
            <Typography fontWeight={800}>{grand.toLocaleString()} ฿</Typography>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
