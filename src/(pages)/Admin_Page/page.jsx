import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Button,
  Card, CardActionArea, CardMedia, CardContent, Chip, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { listProducts, deleteProduct } from "../../api/products";
import { resolveImg } from "../../lib/img";

export default function AdminPage() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => { listProducts().then(setItems); }, []);

  const onDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("ลบสินค้านี้ใช่ไหม?")) return;
    try {
      await deleteProduct(id);
      setItems((old) => old.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  const imgSrc = (p) =>
    resolveImg(
      p?.imageMainUrl ||
      (Array.isArray(p?.imageSideUrls) ? p.imageSideUrls[0] : null) ||
      p?.imageMain // เผื่อของเก่า
    ) || null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fffde7" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" fontWeight={800}>จัดการสินค้า</Typography>
          <Button
            variant="contained"
            onClick={() => nav("/admin/product/new")}
            sx={{ bgcolor: "#ffa000", "&:hover": { bgcolor: "#ffb300" } }}
          >
            + เพิ่มสินค้า
          </Button>
        </Box>

        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" },
          gap: 2
        }}>
          <Card onClick={() => nav("/admin/product/new")}
                sx={{ border: "2px dashed #bbb", height: 230, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <Typography fontWeight={700}>+ เพิ่มสินค้า</Typography>
          </Card>

          {items.map((p) => (
            <Card key={p._id} sx={{ position: "relative" }}>
              <IconButton
                size="small"
                onClick={(e) => onDelete(e, p._id)}
                sx={{ position: "absolute", top: 6, right: 6, bgcolor: "rgba(255,255,255,.9)" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              <CardActionArea onClick={() => nav(`/admin/product/${p._id}`)}>
                <CardMedia
                  component="img"
                  image={imgSrc(p) || undefined}
                  alt={p.name}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <CardContent>
                  <Typography fontWeight={700} noWrap>{p.name}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: .5 }}>
                    <Chip size="small" label={p.category} />
                    <Typography color="text.secondary">
                      {Number(p.price || 0).toLocaleString()} ฿
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
