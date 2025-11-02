// src/(pages)/Home/page.jsx
import React, { useEffect, useState, useMemo } from "react";

import SearchBar from "../../components/SearchBar";

import {
  Box,
  Container,
  Typography,
  Link,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import { useNavigate } from "react-router-dom";

import Topbar from "../../components/Topbar";
import { listProducts } from "../../api/products";
import { resolveImg } from "../../lib/img";

/* ---------- Card ใช้ข้อมูลจาก DB (กรอบสวย + hover) ---------- */
function ImgCardDB({ imgUrl, title, price, onClick, ratio = 1.2, badge }) {
  const bg =
    imgUrl
      ? `url(${imgUrl})`
      : "repeating-linear-gradient(45deg,#f4f4f4,#f4f4f4 10px,#eee 10px,#eee 20px)";

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        backdropFilter: "blur(3px)",
        border: "1px solid rgba(0,0,0,.06)",
        transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
        boxShadow:
          "0 2px 6px rgba(0,0,0,.05), 0 10px 24px rgba(0,0,0,.08)",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow:
            "0 6px 16px rgba(0,0,0,.08), 0 18px 36px rgba(0,0,0,.12)",
          borderColor: "rgba(0,0,0,.10)",
        },
      }}
    >
      {/* ภาพ */}
      <Box
        sx={{
          aspectRatio: `${ratio} / 1`,
          backgroundImage: bg,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform .5s ease",
          "&:hover": { transform: "scale(1.03)" },
        }}
        title={title}
      />

      {/* ไล่เฉด + ตัวอักษร */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
          display: "flex",
          alignItems: "flex-end",
          p: 1.5,
        }}
      >
        {(title || price) && (
          <Box sx={{ color: "#fff" }}>
            {title && (
              <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {title}
              </Typography>
            )}
            {price && (
              <Typography sx={{ opacity: 0.9, fontSize: 13 }}>
                {price}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* เงา inner + เส้นขาวนิด ๆ */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: 3,
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,.6), inset 0 -60px 60px rgba(0,0,0,.08)",
        }}
      />

      {/* ป้ายมุมซ้ายบน (ถ้ามี) */}
      {badge && (
        <Chip
          label={badge}
          size="small"
          color="warning"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "rgba(255,160,0,.95)",
            color: "#2c1a00",
            fontWeight: 700,
          }}
        />
      )}
    </Box>
  );
}

/* ---------- Section wrapper ---------- */
const Section = ({
  id,
  title,
  children,
  bg = "transparent",
  py = { xs: 8, md: 12 },
  subtitle,
}) => (
  <Box id={id} sx={{ background: bg }}>
    <Container maxWidth="lg" sx={{ py }}>
      {title && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, letterSpacing: .2 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: "text.secondary", mt: .5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Container>
  </Box>
);

export default function HomePage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await listProducts();
        if (!alive) return;
        setAll(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("listProducts error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // รวม logic รูปไว้จุดเดียว (main → side[0])
  const imgSrc = (p) =>
    resolveImg(p?.imageMainUrl || p?.imageMain || p?.imageSideUrls?.[0]) || null;

  const bs = useMemo(() => all.filter((p) => p.category === "BS"), [all]);
  const cf = useMemo(() => all.filter((p) => p.category === "CF"), [all]);
  const lo = useMemo(() => all.filter((p) => p.category === "LO"), [all]);

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", bgcolor: "#fff" }}>
      {/* Topbar */}
      <Topbar />

      {/* Searchbar */}
      <Box
        sx={{
          background: "linear-gradient(180deg,#ffb300 0%, #ffa000 100%)",
          borderBottom: "1px solid rgba(0,0,0,.08)",
        }}
      >
        <SearchBar />
      </Box>

      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          color: "#fff",
          py: { xs: 10, md: 16 },
          // ไล่สี + รูปพื้นหลังพร้อมกัน
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%), url("http://localhost:5000/uploads/1761386700245_xel6d6xrblp.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Typography
            sx={{
              color: "#fff",
              fontSize: { xs: 46, md: 110 },
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: { xs: 1, md: 4 },
              textAlign: "center",
              textShadow: "0 10px 40px rgba(0,0,0,.35)",
            }}
          >
            Holiday&nbsp;Pastry
          </Typography>

          <Typography
            sx={{ textAlign: "center", mt: 1, opacity: 0.9, fontWeight: 500 }}
          >
            Freshly baked • Made with love
          </Typography>
        </Container>
      </Box>


      {/* Loading */}
      {loading && (
        <Container
          maxWidth="lg"
          sx={{ py: 6, display: "flex", justifyContent: "center" }}
        >
          <CircularProgress />
        </Container>
      )}

      {/* Best Seller */}
      {!loading && (
        <Section
          id="best-seller"
          title="Best Seller"
          subtitle="All-time favorites from our kitchen"
          bg="#fff9e6"
        >
          {bs.length === 0 ? (
            <Typography color="text.secondary">
              No Best Seller items.
            </Typography>
          ) : (
            <Masonry columns={{ xs: 2, sm: 3, md: 4 }} spacing={2}>
              {bs.map((p, i) => (
                <div key={p._id}>
                  <ImgCardDB
                    imgUrl={imgSrc(p)}
                    title={p.name}
                    price={`${Number(p.price || 0).toLocaleString()} ฿`}
                    ratio={[1.2, 1, 1.35, 0.95][i % 4]}
                    badge="Best"
                    onClick={() => nav(`/product/${p._id}`)}
                  />
                </div>
              ))}
            </Masonry>
          )}
        </Section>
      )}

      {/* Customer Favorite */}
      {!loading && (
        <Section
          id="customer-fav"
          title="Customer Favorite"
          subtitle="Loved by our regulars"
          bg="#fff"
        >
          <Box
            sx={{
              display: "grid",
              gap: "2rem",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(12, 1fr)",
              },
              alignItems: "stretch",
            }}
          >
            {cf.map((p, i) => {
              const gridColumn = {
                xs: "span 2",
                md: i === 0 ? "span 6" : i === cf.length - 1 ? "span 12" : "span 3",
              };
              const ratio = i === cf.length - 1 ? 3 : 1.2;
              return (
                <Box key={p._id} sx={{ gridColumn }}>
                  <ImgCardDB
                    imgUrl={imgSrc(p)}
                    title={p.name}
                    price={`${Number(p.price || 0).toLocaleString()} ฿`}
                    ratio={ratio}
                    badge={i === 0 ? "Hot" : undefined}
                    onClick={() => nav(`/product/${p._id}`)}
                  />
                </Box>
              );
            })}
          </Box>
        </Section>
      )}

      {/* Limited-time offer */}
      {!loading && (
        <Section
          id="limited-offer"
          title="Limited-time Offer!"
          subtitle="Seasonal specials — grab yours"
          bg="linear-gradient(180deg,#fff7e0 0%, #ffe7b0 100%)"
        >
          <Box
            sx={{
              display: "grid",
              gap: "2rem",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(12, 1fr)",
              },
              alignItems: "stretch",
            }}
          >
            {lo.map((p, i) => {
              const gridColumn = { xs: i === 2 ? "span 2" : "span 1", md: "span 4" };
              const ratio = i === 2 ? 2 : 1.2;
              return (
                <Box key={p._id} sx={{ gridColumn }}>
                  <ImgCardDB
                    imgUrl={imgSrc(p)}
                    title={p.name}
                    price={
                      p.price != null ? `${Number(p.price).toLocaleString()} ฿` : ""
                    }
                    ratio={ratio}
                    badge="Limited"
                    onClick={() => nav(`/product/${p._id}`)}
                  />
                </Box>
              );
            })}
          </Box>
        </Section>
      )}

      {/* Footer */}
      <Box
        sx={{
          background: "linear-gradient(180deg,#ffe57f 0%, #ffa000 100%)",
          color: "#222",
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gap: "3rem",
              gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
            }}
          >
            <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                About Us
              </Typography>
              <Typography sx={{ maxWidth: 520 }}>
                Receive our newsletter and discover our stories, collections,
                and surprises.
              </Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
              <Typography sx={{ fontWeight: 800, mb: 2 }}>Support</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link underline="hover" href="#">
                  ORDER TRACKING
                </Link>
                <Link underline="hover" href="#">
                  PRIVACY POLICY
                </Link>
                <Link underline="hover" href="#">
                  FAQ
                </Link>
                <Link underline="hover" href="#">
                  CONTACT US
                </Link>
              </Box>
            </Box>
            <Box sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
              <Typography sx={{ fontWeight: 800, mb: 2 }}>Follow</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link underline="hover" href="#">
                  G
                </Link>
                <Link underline="hover" href="#">
                  F
                </Link>
                <Link underline="hover" href="#">
                  IG
                </Link>
                <Link underline="hover" href="#">
                  TW
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
