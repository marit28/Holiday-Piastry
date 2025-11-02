// src/(pages)/Cart/page.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Topbar from "../../components/Topbar";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/Footer";
import { useCart } from "../../state/cart.jsx";
import { useNavigate, Link } from "react-router-dom";
import { resolveImg } from "../../lib/img";

// ป้องกันรูปหาย: เลือก src ตามลำดับความน่าเชื่อถือสูงสุด -> ต่ำสุด
function pickImgSrc(it) {
  // it.img ควรเป็น URL เต็มที่เราเก็บจากหน้า Product
  const candidate =
    it?.img ||
    it?.imageMainUrl ||         // กรณีบางที่เก็บฟิลด์นี้ไว้
    it?.imageMain ||            // กรณีเก็บชื่อไฟล์/พาธจาก DB รุ่นเก่า
    it?.image || "";            // กัน NPE

  // resolveImg จะคืน URL ที่ใช้ได้ทั้ง absolute / relative / ชื่อไฟล์ uploads
  return resolveImg(candidate);
}

const CartPage = () => {
  const { items, inc, dec, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#fffde7" }}>
      <Topbar />
      <SearchBar />

      {/* เนื้อหา + กันชนด้านล่างเผื่อแถบสรุป */}
      <Box sx={{ flex: 1, p: 4, pb: 12 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Shopping Bag
        </Typography>

        {(!items || items.length === 0) ? (
          <Box>
            <Typography color="text.secondary" mb={2}>Your bag is empty.</Typography>
            <Button variant="contained" onClick={() => navigate("/home")} sx={{ bgcolor: "#ffa000", "&:hover": { bgcolor: "#ffb300" } }}>
              Go shopping
            </Button>
          </Box>
        ) : (
          items.map((it) => {
            const imgSrc = (p) => p?.imageMainUrl || p?.imageMain || null;
            const lineTotal = Number(it.price || 0) * Number(it.qty || 1);

            return (
              <Box
                key={it.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                  {/* รูปสินค้า (มี fallback + onError) */}
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={it.name}
                      onError={(e) => {
                        // ถ้ารูปเสีย ให้ซ่อนกรอบรูปแทนไม่ให้แตก
                        e.currentTarget.style.display = "none";
                      }}
                      style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        background:
                          "repeating-linear-gradient(45deg,#eee,#eee 10px,#ddd 10px,#ddd 20px)",
                        border: "1px solid rgba(0,0,0,.1)",
                      }}
                    />
                  )}

                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={600} noWrap title={it.name}>{it.name}</Typography>
                    <Typography color="text.secondary" noWrap>
                      {it.meta?.base} • {it.meta?.size}
                    </Typography>
                    <Typography color="text.secondary">
                      {Number(it.price || 0).toLocaleString()} ฿ / item
                    </Typography>
                  </Box>
                </Box>

                {/* จำนวน */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                  <Button variant="outlined" onClick={() => dec(it.key)} disabled={(it.qty || 1) <= 1}>−</Button>
                  <Typography width={28} textAlign="center">{it.qty}</Typography>
                  <Button variant="outlined" onClick={() => inc(it.key)}>+</Button>
                </Box>

                {/* ยอดรวมรายการ */}
                <Box sx={{ textAlign: "right", minWidth: 120, flexShrink: 0 }}>
                  <Typography fontWeight={700}>{lineTotal.toLocaleString()} ฿</Typography>
                  <Button color="error" size="small" onClick={() => remove(it.key)}>
                    Remove
                  </Button>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* 🔶 แถบสรุปแบบ STICKY (ไม่ทับ Footer) */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          background: "#fffde7",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 -4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Typography sx={{ fontWeight: 700 }}>
          Total: <span style={{ color: "#ffa000" }}>{Number(total || 0).toLocaleString()} ฿</span>
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/checkout")}
          sx={{
            bgcolor: "#ffa000",
            "&:hover": { bgcolor: "#ffb300" },
            px: 4,
            py: 1,
            fontWeight: 700,
            borderRadius: 2,
          }}
        >
          PAYMENT
        </Button>
      </Box>

      <Footer />
    </Box>
  );
};

export default CartPage;
