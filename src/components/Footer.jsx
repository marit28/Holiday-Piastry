import React from "react";
import { Box, Container, Typography, Link, TextField, Button } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ background: "linear-gradient(180deg,#ffe57f 0%, #ffa000 100%)", color: "#222", py: { xs: 6, md: 8 }, mt: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" },
          }}
        >
          {/* About Us */}
          <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              About Us
            </Typography>
            <Typography sx={{ maxWidth: 520 }}>
              Receive our newsletter and discover our stories, collections, and surprises.
            </Typography>
          </Box>

          {/* Support */}
          <Box sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
            <Typography sx={{ fontWeight: 800, mb: 2 }}>Support</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link underline="hover" href="#">ORDER TRACKING</Link>
              <Link underline="hover" href="#">PRIVACY POLICY</Link>
              <Link underline="hover" href="#">FAQ</Link>
              <Link underline="hover" href="#">CONTACT US</Link>
            </Box>
          </Box>

          {/* Follow / Search */}
          <Box sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
            <Typography sx={{ fontWeight: 800, mb: 2 }}>Follow Us</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Link underline="hover" href="#">G</Link>
              <Link underline="hover" href="#">F</Link>
              <Link underline="hover" href="#">IG</Link>
              <Link underline="hover" href="#">TW</Link>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField size="small" placeholder="Search" fullWidth />
              <Button variant="contained">Submit</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
