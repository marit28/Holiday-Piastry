import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchBar({ placeholder = "Search" }) {
  const nav = useNavigate();
  const { search } = useLocation();
  const urlQ = new URLSearchParams(search).get("q") || "";
  const [value, setValue] = useState(urlQ);

  const doSearch = () => {
  const q = value.trim();
  if (q.length < 2) return; // กันเคส "a" แล้วพาไปเจอทุกตัว
  nav(`/search?q=${encodeURIComponent(q)}`);
};

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg,#ffb300 0%, #ffa000 100%)",
        borderBottom: "1px solid rgba(0,0,0,.08)",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        {/* ช่องค้นหา */}
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder={placeholder}
          size="small"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#fff",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="search" onClick={doSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* ไอคอนขวาสุด */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* ปุ่มรูปคน - ให้ไป "/user" */}
          <IconButton
            onClick={() => nav("/user")}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.25)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
            }}
          >
            <PersonOutlineIcon />
          </IconButton>
          {/* ปุ่มตะกร้า */}
          <IconButton
            onClick={() => nav("/cart")}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.25)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
            }}
          >
            <ShoppingBagOutlinedIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
