import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import SearchBar from "../../components/SearchBar";
import { listProducts } from "../../api/products";
import { resolveImg } from "../../lib/img";

export default function SearchPage() {
  const { search } = useLocation();
  const q = (new URLSearchParams(search).get("q") || "").trim();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        // ถ้า backend รองรับ ?q= ก็จะกรองจากฝั่งเซิร์ฟเวอร์
        const data = await listProducts(q);
        if (!alive) return;

        let arr = Array.isArray(data) ? data : [];

        // เผื่อ backend ยังไม่กรอง: กรองฝั่ง client แบบง่าย (ไม่เปลี่ยนเยอะ)
        if (q.length >= 2) {
          const needle = q.toLowerCase();
          arr = arr.filter(p => {
            const name = (p.name || "").toLowerCase();
            const desc = (p.description || "").toLowerCase();
            const cat  = (p.category || "").toLowerCase();
            return name.includes(needle) || desc.includes(needle) || cat.includes(needle);
          });
        } else if (q.length === 1) {
          // ยาว 1 ตัวอักษร: ไม่แสดงผล เพื่อไม่ให้ “a” เจอเกือบทุกอย่าง
          arr = [];
        }

        setRows(arr);
      } catch (e) {
        console.error("listProducts error:", e);
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [q]);

  const imgSrc = (p) =>
    resolveImg(p?.imageMainUrl || p?.imageMain || p?.imageSideUrls?.[0]) || "";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fffde7" }}>
      <Topbar />
      <SearchBar placeholder={`Search: ${q || ""}`} />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h6" fontWeight={800} mb={2}>
          Search Results {q ? `for "${q}"` : ""}
        </Typography>

        {q && q.length < 2 ? (
          <Typography color="text.secondary">Type at least 2 characters to search.</Typography>
        ) : loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress/>
          </Box>
        ) : rows.length === 0 ? (
          <Typography color="text.secondary">No results.</Typography>
        ) : (
          <Grid container spacing={2}>
            {rows.map(p => (
              <Grid
                key={p._id}
                xs={6} md={3} // ✅ Grid v2 props
                onClick={() => nav(`/product/${p._id}`)}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    aspectRatio: "1 / 1",
                    borderRadius: 2,
                    backgroundImage: `url(${imgSrc(p)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 6px 16px rgba(0,0,0,.12)",
                  }}
                />
                <Typography sx={{ mt: 1, fontWeight: 600, color:"#ffa000" }}>{p.name}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                  {Number(p.price || 0).toLocaleString()} ฿
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
