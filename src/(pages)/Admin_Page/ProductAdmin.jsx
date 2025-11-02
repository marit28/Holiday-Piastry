// src/(pages)/Admin_Page/ProductAdmin.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct, // ✅ เพิ่ม
} from "../../api/products";

export default function ProductAdmin() {
  const navigate = useNavigate();
  const { id } = useParams(); // มีค่าเมื่อเป็นหน้าแก้ไขสินค้า

  // ----- form fields -----
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "BS",
    description: "",
  });

  // ----- files & preview -----
  const [imageMain, setImageMain] = useState(null); // File | null
  const [imageSide, setImageSide] = useState([]); // File[]
  const [previewMain, setPreviewMain] = useState(null); // string|null
  const [previewSides, setPreviewSides] = useState([]); // string[]
  const [loading, setLoading] = useState(false);

  // ถ้ามี id → โหลดข้อมูลสินค้ามาเติมให้ดู
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const p = await getProduct(id);
        if (!alive) return;

        // เติมค่าฟอร์ม
        setForm({
          name: p?.name || "",
          price: p?.price ?? "",
          category: p?.category || "BS",
          description: p?.description || "",
        });

        // พรีวิว URL ที่มีอยู่แล้วจากแบ็กเอนด์
        setPreviewMain(p?.imageMainUrl || null);
        setPreviewSides(Array.isArray(p?.imageSideUrls) ? p.imageSideUrls.filter(Boolean) : []);
      } catch (e) {
        console.error("load product error:", e);
        alert(e?.response?.data?.message || "โหลดสินค้าไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const onPickMain = (e) => {
    const f = e.target.files?.[0] || null;
    setImageMain(f);
    setPreviewMain(f ? URL.createObjectURL(f) : null);
  };

  const onPickSides = (e) => {
    const files = Array.from(e.target.files || []);
    setImageSide(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewSides(urls.length ? urls : previewSides); // ถ้าไม่เลือกใหม่ ให้คงรูปเดิม
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "BS", description: "" });
    setImageMain(null);
    setImageSide([]);
    setPreviewMain(null);
    setPreviewSides([]);
  };

  // CREATE
  const submit = async () => {
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        price: form.price === "" ? "" : Number(form.price),
        category: form.category,
        description: form.description,
        imageMain,
        imageSide,
      };
      await createProduct(payload);
      alert("บันทึกสินค้าเรียบร้อย");
      resetForm();
      navigate("/admin");
    } catch (e) {
      console.error("save product error:", e);
      alert(e?.response?.data?.message || e.message || "บันทึกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        price: form.price === "" ? "" : Number(form.price),
        category: form.category,
        description: form.description,
        imageMain,        // แนบก็ต่อเมื่อผู้ใช้เลือกใหม่ (เป็น File) → backend จะอัปเดต main
        imageSide,        // ถ้ามีไฟล์ใหม่ → backend จะ push ต่อท้าย side ได้หลายรูป
      };
      await updateProduct(id, payload);
      alert("อัปเดตข้อมูลเรียบร้อย");
      navigate("/admin");
    } catch (e) {
      console.error("update product error:", e);
      alert(e?.response?.data?.message || e.message || "อัปเดตไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!confirm("ลบสินค้านี้ใช่ไหม?")) return;
    try {
      setLoading(true);
      await deleteProduct(id);
      alert("ลบสินค้าเรียบร้อย");
      navigate("/admin");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "ลบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const sideCount = Array.isArray(previewSides) ? previewSides.length : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      {/* ปุ่มย้อนกลับ */}
      <Button
        size="small"
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 1 }}
      >
        กลับ
      </Button>

      <Typography variant="h4" fontWeight={800} mb={2}>
        {id ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
      </Typography>

      <Stack spacing={2} divider={<Divider flexItem />}>
        {/* ฟิลด์ข้อมูลทั่วไป */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <TextField
            label="ชื่อสินค้า"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="ราคา"
            type="number"
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
            fullWidth
          />
          <TextField
            select
            label="หมวดหมู่"
            value={form.category}
            onChange={(e) =>
              setForm((s) => ({ ...s, category: e.target.value }))
            }
            fullWidth
          >
            <MenuItem value="BS">BS — Best Seller</MenuItem>
            <MenuItem value="CF">CF — Customer Favorite</MenuItem>
            <MenuItem value="LO">LO — Limited Offer</MenuItem>
          </TextField>
          <TextField
            label="รายละเอียด"
            value={form.description}
            onChange={(e) =>
              setForm((s) => ({ ...s, description: e.target.value }))
            }
            fullWidth
            multiline
            minRows={3}
          />
        </Box>

        {/* อัปโหลดรูป */}
        <Box>
          <Typography fontWeight={700} mb={1}>
            รูปหลัก (1 รูป)
          </Typography>
          {/* imageMain 1 รูป */}
          <input type="file" accept="image/*" onChange={onPickMain} />
          {/* พรีวิว */}
          {previewMain ? (
            <img
              src={previewMain}
              alt="preview-main"
              style={{ width: 160, height: 160, objectFit: "cover", marginTop: 8 }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : null}
        </Box>

        <Box>
          <Typography fontWeight={700} mb={1}>
            รูป Side View (หลายรูป) {sideCount ? `• ${sideCount} รูป` : ""}
          </Typography>
          {/* imageSide หลายรูป */}
          <input type="file" accept="image/*" multiple onChange={onPickSides} />
          {Array.isArray(previewSides) && previewSides.length > 0 ? (
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 1 }}>
              {previewSides.map((src, idx) =>
                src ? (
                  <img
                    key={idx}
                    src={src}
                    alt={`side-${idx}`}
                    style={{
                      width: 110,
                      height: 110,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : null
              )}
            </Box>
          ) : null}
        </Box>

        {/* ปุ่มแอ็กชัน */}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          {/* สร้างใหม่ */}
          {!id && (
            <Button
              disabled={loading}
              variant="contained"
              onClick={submit}
              sx={{ bgcolor: "#ffa000", "&:hover": { bgcolor: "#ffb300" } }}
            >
              บันทึกสินค้า
            </Button>
          )}

          {/* อัปเดตของเดิม */}
          {id && (
            <Button
              disabled={loading}
              variant="contained"
              onClick={handleUpdate}
              sx={{ bgcolor: "#ffa000", "&:hover": { bgcolor: "#ffb300" } }}
            >
              บันทึกข้อมูล
            </Button>
          )}

          <Button variant="outlined" onClick={resetForm} disabled={loading}>
            ล้างฟอร์ม
          </Button>

          {/* ลบ */}
          {id && (
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              onClick={onDelete}
              disabled={loading}
              sx={{ ml: "auto" }}
            >
              ลบสินค้า
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
