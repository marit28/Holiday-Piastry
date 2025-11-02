import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const nav = useNavigate(); // ✅ ใช้สำหรับเปลี่ยนหน้า

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(180deg,#fff176 0%, #ffb300 60%, #ffb300 100%)",
        height: 100,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography
          variant="h3"
          onClick={() => nav("/home")} // ✅ คลิกแล้วไปหน้า /home
          sx={{
            width: { xs: "100%" },
            fontFamily: "'Kanit','Noto Sans Thai',sans-serif",
            fontWeight: 600,
            letterSpacing: 2,
            color: "white",
            textAlign: "center",
            cursor: "pointer", // ✅ เพิ่มให้ดูเหมือนปุ่มคลิกได้
            userSelect: "none", // ✅ ป้องกันลากเลือกข้อความ
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.03)", // ✅ hover นิดๆ สวยๆ
            },
          }}
        >
          HOLIDAY PASTRY
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
