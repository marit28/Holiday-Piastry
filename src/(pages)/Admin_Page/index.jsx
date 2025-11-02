// src/(pages)/Admin_Page/index.jsx
import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { listProducts } from "../../api/products";

export default function AdminPage() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const data = await listProducts();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={800} mb={2}>Admin — สินค้าทั้งหมด</Typography>
      <Button
        variant="contained"
        onClick={() => nav("/admin/product/new")}   // ✅ ไปหน้าเพิ่มสินค้า
        sx={{ bgcolor:"#ffa000", "&:hover":{ bgcolor:"#ffb300" }, mb:2 }}
      >
        + เพิ่มสินค้า
      </Button>

      <Box sx={{ display: "grid", gap: 2 }}>
        {items.map((p) => (
          <Box key={p._id} sx={{ p:2, border:"1px solid #eee", borderRadius:2, display:"flex", gap:2, alignItems:"center" }}>
            <img src={p.imageMain} alt="" width={72} height={72} style={{objectFit:"cover", borderRadius:8}} />
            <Box sx={{ flex:1 }}>
              <Typography fontWeight={700}>{p.name}</Typography>
              <Typography color="text.secondary">{p.category} • {Number(p.price).toLocaleString()} ฿</Typography>
            </Box>
            <Button variant="outlined" onClick={() => nav(`/admin/product/${p._id}`)}>
              แก้ไข
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
    