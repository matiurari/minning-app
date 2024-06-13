"use client";

import { Box, Typography } from "@mui/material";
import Navbar from "./Navbar";

export default function HomeClient({ session }) {
  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", padding: "0px", margin: "0px" }}>
      <Navbar session={session}/>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "90%", backgroundColor: "lightgray" }}>
        <Typography variant="h3">Welcome, {session.user.name}</Typography>
      </Box>
    </Box>
  );
}
