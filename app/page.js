import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route";
import HomeClient from "@/components/HomeClient";
import { Box, Typography } from "@mui/material";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
     <Box sx={{width: "100vw", height: "100vh", display: "flex", flexDirection: "column"}}>
        <Box sx={{width: "100%", height: "10%"}}>
          <Navbar session={session}/>
        </Box>
        <Box sx={{width: "100%", height: "90%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Typography sx={{fontFamily: "Arial, Helvetica, sans-serif", fontSize: "36pt"}}>
            Welcome{session && (`, ${session?.user.name}`)}
          </Typography>
        </Box>
     </Box>
  );
}
